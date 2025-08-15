import { NextResponse } from "next/server";
import { getDailyColor } from "@/db/queries";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const dailyColor = await getDailyColor(today);

    return NextResponse.json({
      color: dailyColor,
      date: today,
      message: "Daily color retrieved successfully",
    });
  } catch (error) {
    console.error("Failed to get daily color:", error);
    return NextResponse.json(
      { error: "Failed to get daily color" },
      { status: 500 },
    );
  }
}
