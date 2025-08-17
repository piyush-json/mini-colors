import { NextRequest, NextResponse } from "next/server";
import { getUserStreak } from "@/db/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const streak = await getUserStreak(userId);

    return NextResponse.json({ streak });
  } catch (error) {
    console.error("Error fetching user streak:", error);
    return NextResponse.json(
      { error: "Failed to fetch streak" },
      { status: 500 },
    );
  }
}
