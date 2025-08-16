"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FindColorGame } from "@/components/FindColorGame";
import { ColorMixingGame } from "@/components/ColorMixingGame";
import { GameProvider, useGameContext } from "@/lib/GameContext";
import { cn } from "@/lib/utils";

function GamePageContent() {
  const [gameMode, setGameMode] = useState<"upload" | "mixing">("upload");
  const [targetColor] = useState("#A6C598"); // Default target color
  const gameContext = useGameContext();
  const router = useRouter();

  const handleScoreSubmit = (score: number, timeTaken: number) => {
    console.log("Score submitted:", { score, timeTaken });

    const capturedColor = gameContext?.capturedColor || "#B8D4A6"; // Fallback color
    console.log("Captured color:", capturedColor);

    // Navigate to results page with game data
    const params = new URLSearchParams({
      targetColor,
      capturedColor,
      similarity: score.toString(),
    });

    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full justify-between grow pb-8">
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
          targetColor={targetColor}
          onScoreSubmit={handleScoreSubmit}
        />
      ) : (
        <ColorMixingGame
          targetColor={targetColor}
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
