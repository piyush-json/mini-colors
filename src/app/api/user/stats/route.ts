import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameAttempts, gameSessions, dailyStats } from "@/db/schema";
import { and, desc, eq, avg, max, min, count, sql } from "drizzle-orm";
import { createOrGetUser } from "@/db/queries";

function getUserIdentifier(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return `${ip}-${userAgent}`;
}

export async function GET(request: NextRequest) {
  try {
    const userIdentifier = getUserIdentifier(request);
    const user = await createOrGetUser(userIdentifier);

    // Get overall user statistics
    const overallStats = await db
      .select({
        totalAttempts: count(gameAttempts.id),
        averageScore: avg(gameAttempts.finalScore),
        bestScore: max(gameAttempts.finalScore),
        worstScore: min(gameAttempts.finalScore),
        totalTimePlayed: sql<number>`SUM(${gameAttempts.timeTaken})`,
        gamesPlayed: count(sql`DISTINCT ${gameAttempts.sessionId}`),
      })
      .from(gameAttempts)
      .innerJoin(gameSessions, eq(gameAttempts.sessionId, gameSessions.id))
      .where(eq(gameSessions.userId, user))
      .execute();

    // Get daily best scores for the last 30 days
    const dailyBestScores = await db
      .select({
        date: sql<string>`DATE(${dailyStats.createdAt}) as date`,
        score: dailyStats.bestScore,
      })
      .from(dailyStats)
      .where(eq(dailyStats.userId, user))
      .orderBy(desc(dailyStats.createdAt))
      .limit(30)
      .execute();

    // Get recent activity (last 7 days)
    const recentActivity = await db
      .select({
        date: sql<string>`DATE(${gameAttempts.createdAt}) as date`,
        attempts: count(gameAttempts.id),
        bestScore: max(gameAttempts.finalScore),
      })
      .from(gameAttempts)
      .innerJoin(gameSessions, eq(gameAttempts.sessionId, gameSessions.id))
      .where(
        and(
          eq(gameSessions.userId, user),
          sql`${gameAttempts.createdAt} >= NOW() - INTERVAL '7 days'`,
        ),
      )
      .groupBy(sql`DATE(${gameAttempts.createdAt})`)
      .orderBy(desc(sql`DATE(${gameAttempts.createdAt})`))
      .execute();

    // Format the response
    const stats = overallStats[0];

    return NextResponse.json({
      totalAttempts: Number(stats?.totalAttempts || 0),
      averageScore: Number(stats?.averageScore || 0),
      bestScore: Number(stats?.bestScore || 0),
      worstScore: Number(stats?.worstScore || 0),
      totalTimePlayed: Number(stats?.totalTimePlayed || 0),
      gamesPlayed: Number(stats?.gamesPlayed || 0),
      dailyBestScores: dailyBestScores.map((day) => ({
        date: day.date,
        score: Number(day.score),
      })),
      recentActivity: recentActivity.map((day) => ({
        date: day.date,
        attempts: Number(day.attempts),
        bestScore: Number(day.bestScore),
      })),
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 },
    );
  }
}
