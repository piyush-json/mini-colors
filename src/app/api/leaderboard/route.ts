import { NextResponse } from "next/server";
import {
  getLeaderboard,
  submitToLeaderboard,
  createOrGetUser,
  getUserKey,
} from "@/db/queries";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");

    const leaderboard = await getLeaderboard(date || undefined);

    return NextResponse.json({
      leaderboard,
      total: leaderboard.length,
    });
  } catch (error) {
    console.error("Failed to get leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to get leaderboard" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, score, date, attemptId } = await request.json();

    if (!name || typeof score !== "number" || !date || !attemptId) {
      return NextResponse.json(
        {
          error:
            "Invalid data provided. Name, score, date, and attemptId are required.",
        },
        { status: 400 },
      );
    }

    const userKey = getUserKey(request);

    // Create or get user
    const userId = await createOrGetUser(userKey, name.trim());

    // Submit to leaderboard (this handles checking for existing entries and updates)
    const result = await submitToLeaderboard(
      userId,
      name.trim(),
      score,
      date,
      attemptId, // Use the provided attemptId which should be a valid UUID
    );

    return NextResponse.json({
      message: result.updated
        ? "Score updated on leaderboard"
        : "Score added to leaderboard",
      entry: result.entry,
      updated: result.updated,
    });
  } catch (error) {
    console.error("Failed to add score to leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to add score to leaderboard" },
      { status: 500 },
    );
  }
}
