import { NextRequest, NextResponse } from "next/server";
import { getUserGameHistory } from "@/db/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const result = await getUserGameHistory(userId, 20);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching game history:", error);
    return NextResponse.json(
      { error: "Failed to fetch game history" },
      { status: 500 },
    );
  }
}
