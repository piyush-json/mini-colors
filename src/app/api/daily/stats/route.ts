import { NextResponse } from "next/server";
import {
  createOrGetUser,
  getDailyStats,
  updateDailyStats,
  getUserKey,
  submitToLeaderboard,
} from "@/db/queries";
import { db } from "@/db";
import { gameAttempts, gameSessions, users } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";

// Helper function to get today's date key
function getTodayKey(): string {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
}

export async function GET(request: Request) {
  try {
    const userKey = getUserKey(request);
    const todayKey = getTodayKey();

    // Create or get user
    const userId = await createOrGetUser(userKey);

    // Get daily stats
    const stats = await getDailyStats(userId, todayKey);

    if (stats) {
      // Find the attempt ID that achieved the best score for today
      const bestAttempt = await db
        .select({ id: gameAttempts.id })
        .from(gameAttempts)
        .innerJoin(gameSessions, eq(gameAttempts.sessionId, gameSessions.id))
        .where(
          and(
            eq(gameSessions.userId, userId),
            eq(gameSessions.gameMode, "daily"),
            eq(gameAttempts.finalScore, stats.bestScore),
          ),
        )
        .orderBy(desc(gameAttempts.createdAt))
        .limit(1);

      return NextResponse.json({
        totalAttempts: stats.totalAttempts,
        bestScore: stats.bestScore,
        currentScore: 0, // We don't store current score separately
        isNewBest: false,
        bestAttemptId: bestAttempt[0]?.id || null,
      });
    } else {
      return NextResponse.json({
        totalAttempts: 0,
        bestScore: 0,
        currentScore: 0,
        isNewBest: false,
        bestAttemptId: null,
      });
    }
  } catch (error) {
    console.error("Failed to get daily stats:", error);
    return NextResponse.json(
      { error: "Failed to get daily stats" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { score, date, timeTaken = 0, attemptId } = await request.json();

    if (typeof score !== "number" || !date) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 },
      );
    }

    const userKey = getUserKey(request);

    // Create or get user
    const userId = await createOrGetUser(userKey);

    // Update daily stats
    const updatedStats = await updateDailyStats(userId, date, score, timeTaken);

    // If this is a new best score and we have an attemptId, automatically submit to leaderboard
    if (updatedStats.isNewBest && attemptId) {
      try {
        // Get user name from database
        const user = await db
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        const userName = user[0]?.name || "Anonymous Player";

        // Automatically submit to leaderboard
        await submitToLeaderboard(userId, userName, score, date, attemptId);

        console.log(
          `Auto-submitted new best score ${score} to leaderboard for ${userName}`,
        );
      } catch (leaderboardError) {
        console.error(
          "Failed to auto-submit to leaderboard:",
          leaderboardError,
        );
        // Don't fail the entire request if leaderboard submission fails
      }
    }

    return NextResponse.json({
      ...updatedStats,
      autoSubmittedToLeaderboard: updatedStats.isNewBest && !!attemptId,
    });
  } catch (error) {
    console.error("Failed to update daily stats:", error);
    return NextResponse.json(
      { error: "Failed to update daily stats" },
      { status: 500 },
    );
  }
}
