import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dailyAttempts } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { saveDailyAttempt, submitToLeaderboard } from "@/db/queries";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      userName,
      targetColor,
      capturedColor,
      similarity,
      timeTaken,
      timeScore,
      finalScore,
      date,
      gameType,
    } = body as {
      userId: string;
      userName?: string;
      targetColor: string;
      capturedColor: string;
      similarity: number;
      timeTaken: number;
      timeScore: number;
      finalScore: number;
      date?: string;
      gameType?: string;
    };

    // Validate required fields
    if (
      !userId ||
      !targetColor ||
      !capturedColor ||
      typeof similarity !== "number" ||
      typeof timeTaken !== "number" ||
      typeof timeScore !== "number" ||
      typeof finalScore !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const attemptDate = date || new Date().toISOString().split("T")[0];

    // Check if user already has a daily attempt today
    const existingAttempt = await db
      .select({ id: dailyAttempts.id })
      .from(dailyAttempts)
      .where(
        and(
          eq(dailyAttempts.userId, userId),
          eq(dailyAttempts.date, attemptDate),
          eq(dailyAttempts.gameType, gameType || "color-mixing"),
        ),
      )
      .limit(1);

    if (existingAttempt.length > 0) {
      return NextResponse.json(
        {
          error:
            "Daily attempt already completed today. Only one attempt per day is allowed.",
        },
        { status: 429 },
      );
    }

    // Calculate streak: get yesterday's attempt
    const yesterday = new Date(attemptDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const yesterdayAttempt = await db
      .select({ streak: dailyAttempts.streak })
      .from(dailyAttempts)
      .where(
        and(
          eq(dailyAttempts.userId, userId),
          eq(dailyAttempts.date, yesterdayStr),
        ),
      )
      .limit(1);

    // If yesterday's attempt exists, increment streak by 1, otherwise start with 1
    const currentStreak =
      yesterdayAttempt.length > 0 ? yesterdayAttempt[0].streak + 1 : 1;

    // Save the daily attempt with calculated streak
    const attemptId = await saveDailyAttempt(
      userId,
      userName || "Anonymous",
      {
        targetColor,
        capturedColor,
        similarity,
        timeTaken,
        timeScore,
        finalScore,
        gameType: gameType || "color-mixing", // Provide default gameType
        streak: currentStreak,
      },
      attemptDate,
    );

    // Automatically submit to leaderboard
    let leaderboardResult = null;
    try {
      leaderboardResult = await submitToLeaderboard(
        userId,
        userName || "Anonymous",
        finalScore,
        gameType || "color-mixing", // Pass gameType to leaderboard
        attemptDate,
      );
    } catch (error) {
      console.error("Failed to submit to leaderboard:", error);
    }

    return NextResponse.json({
      success: true,
      attemptId,
      streak: currentStreak,
      leaderboardSubmitted: !!leaderboardResult,
      isNewBest: leaderboardResult?.updated || false,
      message: "Daily attempt saved successfully",
    });
  } catch (error) {
    console.error("Error saving daily attempt:", error);
    return NextResponse.json(
      { error: "Failed to save daily attempt" },
      { status: 500 },
    );
  }
}
