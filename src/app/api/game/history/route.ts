import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameAttempts, gameSessions, users, dailyColors } from "@/db/schema";
import { and, desc, eq, avg, count, sql } from "drizzle-orm";
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
    const userId = await createOrGetUser(userIdentifier);

    // Get user's game history with session details
    const gameHistory = await db
      .select({
        id: gameAttempts.id,
        sessionId: gameAttempts.sessionId,
        score: gameAttempts.finalScore,
        timeTaken: gameAttempts.timeTaken,
        targetColor: sql<string>`COALESCE(${dailyColors.color}, ${gameSessions.targetColor})`,
        capturedColor: gameAttempts.capturedColor,
        similarity: gameAttempts.similarity,
        createdAt: gameAttempts.createdAt,
        gameMode: sql<string>`CASE 
          WHEN ${gameSessions.gameMode} = 'daily' THEN 'Daily Challenge'
          WHEN ${gameSessions.gameMode} = 'practice' THEN 'Practice'
          WHEN ${gameSessions.gameMode} = 'party' THEN 'Party'
          WHEN ${gameSessions.gameMode} = 'mixing' THEN 'Color Mixing'
          ELSE 'Unknown'
        END`,
      })
      .from(gameAttempts)
      .innerJoin(gameSessions, eq(gameAttempts.sessionId, gameSessions.id))
      .leftJoin(dailyColors, eq(gameSessions.dailyColorId, dailyColors.id))
      .where(eq(gameSessions.userId, userId))
      .orderBy(desc(gameAttempts.createdAt))
      .limit(100) // Limit to last 100 games
      .execute();

    // Calculate summary statistics
    const stats = await db
      .select({
        totalGames: count(gameAttempts.id),
        averageScore: avg(gameAttempts.finalScore),
        averageTime: avg(gameAttempts.timeTaken),
        highScores: sql<number>`COUNT(CASE WHEN ${gameAttempts.finalScore} >= 80 THEN 1 END)`,
      })
      .from(gameAttempts)
      .innerJoin(gameSessions, eq(gameAttempts.sessionId, gameSessions.id))
      .where(eq(gameSessions.userId, userId))
      .execute();

    const summaryStats = stats[0];

    return NextResponse.json({
      history: gameHistory.map((game) => ({
        id: game.id,
        sessionId: game.sessionId,
        score: Number(game.score),
        timeTaken: Number(game.timeTaken),
        targetColor: game.targetColor || "#000000",
        capturedColor: game.capturedColor,
        similarity: Number(game.similarity),
        createdAt: game.createdAt.toISOString(),
        gameMode: game.gameMode,
      })),
      stats: {
        totalGames: Number(summaryStats?.totalGames || 0),
        averageScore: Number(summaryStats?.averageScore || 0),
        averageTime: Number(summaryStats?.averageTime || 0),
        highScores: Number(summaryStats?.highScores || 0),
      },
    });
  } catch (error) {
    console.error("Error fetching game history:", error);
    return NextResponse.json(
      { error: "Failed to fetch game history" },
      { status: 500 },
    );
  }
}
