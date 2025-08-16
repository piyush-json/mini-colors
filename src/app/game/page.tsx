"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FindColorGame } from "@/components/FindColorGame";
import { ColorMixingGame } from "@/components/ColorMixingGame";
import { GameProvider, useGameContext } from "@/lib/GameContext";
import { useColorGame } from "@/lib/useColorGame";
import { cn } from "@/lib/utils";

function GamePageContent() {
  const [gameMode, setGameMode] = useState<"upload" | "mixing">("upload");
  const gameContext = useGameContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMode =
    searchParams.get("mode") === "daily" ? "daily" : "practice";

  const {
    gameState,
    currentMode,
    isLoadingDailyColor,
    dailyColor,
    setDailyMode,
    setPracticeMode,
    loadDailyColor,
    generateNewPracticeColor,
  } = useColorGame({ initialMode });
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "daily") {
      setDailyMode();
    } else {
      setPracticeMode();
    }
  }, [searchParams, setPracticeMode, setDailyMode]);

  useEffect(() => {
    if (currentMode === "daily") {
      loadDailyColor();
    }
  }, [currentMode, loadDailyColor]);

  const handleModeChange = (mode: "daily" | "practice") => {
    if (mode === "daily") {
      setDailyMode();
    } else {
      setPracticeMode();
      generateNewPracticeColor();
    }
  };

  const handleScoreSubmit = (score: number, timeTaken: number) => {
    console.log("Score submitted:", { score, timeTaken });

    const capturedColor = gameContext?.capturedColor || "#B8D4A6"; // Fallback color
    console.log("Captured color:", capturedColor);

    // Navigate to results page with game data including play mode
    const params = new URLSearchParams({
      targetColor: gameState.targetColor,
      capturedColor,
      similarity: score.toString(),
      mode: currentMode, // Include the play mode
    });

    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full justify-between grow pb-8">
      <div className="flex w-80 mb-4">
        <div
          className={cn(
            "flex-1 flex justify-center items-center px-6 py-2 border border-black cursor-pointer font-hartone text-sm tracking-[7.5%]",
            currentMode === "daily"
              ? "bg-black text-[#FFFFE7]"
              : "bg-[#FFFFE7] text-black",
          )}
          style={{
            borderRadius: "4px 0px 0px 4px",
            boxShadow:
              currentMode === "daily"
                ? "0px 1.5px 0px 0px rgba(0, 0, 0, 1)"
                : "none",
          }}
          onClick={() => handleModeChange("daily")}
        >
          DAILY
        </div>
        <div
          className={cn(
            "flex-1 flex justify-center items-center px-6 py-2 border border-black cursor-pointer font-hartone text-sm tracking-[7.5%]",
            currentMode === "practice"
              ? "bg-black text-[#FFFFE7]"
              : "bg-[#FFFFE7] text-black",
          )}
          style={{
            borderRadius: "0px 4px 4px 0px",
            boxShadow:
              currentMode === "practice"
                ? "0px 1.5px 0px 0px rgba(0, 0, 0, 1)"
                : "none",
          }}
          onClick={() => handleModeChange("practice")}
        >
          PRACTICE
        </div>
      </div>

      {/* Game Mode Selector */}
      <div className="flex w-64">
        <div
          className={cn(
            "flex-1 flex justify-center items-center px-8 py-3 border border-black cursor-pointer font-hartone text-base tracking-[7.5%]",
            gameMode === "upload"
              ? "bg-black text-[#FFFFE7]"
              : "bg-[#FFFFE7] text-black",
          )}
          style={{
            borderRadius: "4px 0px 0px 4px",
            boxShadow:
              gameMode === "upload"
                ? "0px 1.5px 0px 0px rgba(0, 0, 0, 1)"
                : "none",
          }}
          onClick={() => setGameMode("upload")}
        >
          UPLOAD
        </div>
        <div
          className={cn(
            "flex-1 flex justify-center items-center px-8 py-3 border border-black cursor-pointer font-hartone text-base tracking-[7.5%]",
            gameMode === "mixing"
              ? "bg-black text-[#FFFFE7]"
              : "bg-[#FFFFE7] text-black",
          )}
          style={{
            borderRadius: "0px 4px 4px 0px",
            boxShadow:
              gameMode === "mixing"
                ? "0px 1.5px 0px 0px rgba(0, 0, 0, 1)"
                : "none",
          }}
          onClick={() => setGameMode("mixing")}
        >
          MIX
        </div>
      </div>

      {gameMode === "upload" ? (
        <FindColorGame
          targetColor={
            isLoadingDailyColor && currentMode === "daily"
              ? undefined
              : gameState.targetColor
          }
          onScoreSubmit={handleScoreSubmit}
        />
      ) : (
        <ColorMixingGame
          targetColor={
            isLoadingDailyColor && currentMode === "daily"
              ? undefined
              : gameState.targetColor
          }
          onScoreSubmit={handleScoreSubmit}
        />
      )}
    </div>
  );
}

export default function GamePage() {
  return (
    <GameProvider>
      <GamePageContent />
    </GameProvider>
  );
}
