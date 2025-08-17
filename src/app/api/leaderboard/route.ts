import { NextResponse } from "next/server";
import { getLeaderboard } from "@/db/queries";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date"); // YYYY-MM-DD format, defaults to today
    const userId = url.searchParams.get("userId"); // to get user's ranking
    const gameType = url.searchParams.get("gameType"); // "color-mixing" or "finding" or "all"

    const targetDate = date || new Date().toISOString().split("T")[0];

    const result = await getLeaderboard(
      targetDate,
      userId || undefined,
      gameType || "all",
    );

    return NextResponse.json({
      date: targetDate,
      gameType: gameType || "all",
      leaderboard: result.topScores,
      userRanking: result.userRanking,
      total: result.total,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
