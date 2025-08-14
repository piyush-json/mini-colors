import { NextResponse } from "next/server";

// In-memory storage for demo purposes
// In production, you'd use a database
let leaderboard: Array<{
  id: string;
  name: string;
  score: number;
  date: string;
  timestamp: number;
}> = [];

export async function GET() {
  try {
    // Sort by score (highest first) and then by timestamp (earliest first for same scores)
    const sortedLeaderboard = [...leaderboard].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timestamp - b.timestamp;
    });

    return NextResponse.json({
      leaderboard: sortedLeaderboard.slice(0, 100), // Top 100 scores
      total: leaderboard.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get leaderboard" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, score, date } = await request.json();

    if (!name || typeof score !== "number" || !date) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 },
      );
    }

    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      score,
      date,
      timestamp: Date.now(),
    };

    leaderboard.push(newEntry);

    return NextResponse.json({
      message: "Score added to leaderboard",
      entry: newEntry,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add score to leaderboard" },
      { status: 500 },
    );
  }
}
