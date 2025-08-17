import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dailyAttempts } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { saveDailyAttempt, submitToLeaderboard } from "@/db/queries";

export async function POST(request: NextRequest) {
  try {
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
    } = await request.json();

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

    // Save the daily attempt
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
        attemptDate,
      );
    } catch (error) {
      console.error("Failed to submit to leaderboard:", error);
    }

    return NextResponse.json({
      success: true,
      attemptId,
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
