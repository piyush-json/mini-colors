import { NextResponse } from "next/server";

// Generate a daily color based on the current date
function getDailyColor(): string {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  // Use the seed to generate a consistent color for the day
  const hue = seed % 360;
  const saturation = 70 + (seed % 30); // 70-100%
  const lightness = 40 + (seed % 20); // 40-60%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export async function GET() {
  try {
    const dailyColor = getDailyColor();

    return NextResponse.json({
      color: dailyColor,
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
      message: "Daily color retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get daily color" },
      { status: 500 },
    );
  }
}
