import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  createOrGetUser,
  createGameSession,
  saveGameAttempt,
} from "@/db/queries";

function getUserIdentifier(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return `${ip}-${userAgent}`;
}

export async function POST(request: NextRequest) {
  try {
    const {
      gameMode,
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
      !gameMode ||
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

    const userIdentifier = getUserIdentifier(request);
    const userId = await createOrGetUser(userIdentifier);

    // Create a game session
    const sessionId = await createGameSession(
      userId,
      gameMode,
      targetColor,
      gameMode === "daily" ? "" : undefined, // dailyColorId would be set elsewhere for daily mode
    );

    // Save the game attempt
    const attemptId = await saveGameAttempt(sessionId, userId, {
      attemptNumber: 1, // For now, each attempt is a separate session
      capturedColor,
      targetColor,
      similarity,
      timeTaken,
      timeScore,
      finalScore,
    });

    return NextResponse.json({
      success: true,
      attemptId,
      sessionId,
      message: "Game attempt saved successfully",
    });
  } catch (error) {
    console.error("Error saving game attempt:", error);
    return NextResponse.json(
      { error: "Failed to save game attempt" },
      { status: 500 },
    );
  }
}
