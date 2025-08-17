import { NextResponse } from "next/server";
import { getLeaderboard } from "@/db/queries";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date"); // YYYY-MM-DD format, defaults to today
    const userId = url.searchParams.get("userId"); // to get user's ranking

    const targetDate = date || new Date().toISOString().split("T")[0];

    const result = await getLeaderboard(targetDate, userId || undefined);

    return NextResponse.json({
      date: targetDate,
      leaderboard: result.topScores,
      userRanking: result.userRanking,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
