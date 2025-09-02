import { NextResponse } from "next/server";
import { getLeaderboard } from "@/db/queries";
import type { LeaderboardApiResponse } from "@/lib/farcaster-share";

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

    const formattedLeaderboard = result.topScores.map((entry, index) => ({
      rank: (index + 1).toString(),
      userName: entry.userName,
      score: entry.score,
      isCurrentUser: result.userRanking?.userId === entry.userId,
    }));

    const response: LeaderboardApiResponse = {
      date: targetDate,
      gameType: gameType || "all",
      leaderboard: formattedLeaderboard,
      userRanking: result.userRanking
        ? {
            rank: result.userRanking.rank,
            score: result.userRanking.score,
            userName: result.userRanking.userName,
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
