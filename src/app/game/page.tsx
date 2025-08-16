"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FindColorGame } from "@/components/FindColorGame";
import { ColorMixingGame } from "@/components/ColorMixingGame";
import { GameProvider, useGameContext } from "@/lib/GameContext";
import { useColorGame } from "@/lib/useColorGame";
import { useGameResults } from "@/lib/GameResultsContext";
import { cn } from "@/lib/utils";

function GamePageContent() {
  const router = useRouter();
  const gameContext = useGameContext();
  const {
    currentMode,
    gameType,
    results,
    dailyColor,
    isLoadingDailyColor,
    setGameMode,
    setGameType,
    setResults,
    clearResults,
    loadDailyColor,
  } = useGameResults();

  const { gameState, setDailyMode, setPracticeMode, generateNewPracticeColor } =
    useColorGame({ initialMode: currentMode });

  useEffect(() => {
    if (currentMode === "daily" && !dailyColor && !isLoadingDailyColor) {
      loadDailyColor();
    }
  }, [currentMode, dailyColor, isLoadingDailyColor, loadDailyColor]);

  const handleModeChange = (mode: "daily" | "practice") => {
    if (mode === "practice") {
      setPracticeMode();
      generateNewPracticeColor();
    } else {
      setDailyMode();
      if (!dailyColor && !isLoadingDailyColor) {
        loadDailyColor();
      }
    }
    setGameMode(mode);
  };

  const getTargetColor = () => {
    if (currentMode === "daily") {
      return isLoadingDailyColor ? undefined : dailyColor;
    }
    return gameState.targetColor;
  };

  const handleScoreSubmit = (
    score: number,
    timeTaken: number,
    actualTargetColor?: string,
    actualCapturedColor?: string,
  ) => {
    console.log("Score submitted:", {
      score,
      timeTaken,
      actualTargetColor,
      actualCapturedColor,
    });

    let capturedColor: string;
    if (gameType === "upload") {
      const contextCapturedColor = gameContext?.capturedColor;
      if (!contextCapturedColor) {
        console.error("No captured color available for upload game");
        return;
      }
      capturedColor = contextCapturedColor;
    } else {
      if (!actualCapturedColor) {
        console.error("No mixed color provided for mixing game");
        return;
      }
      capturedColor = actualCapturedColor;
    }

    console.log("Captured color:", capturedColor);

    const targetColorForResults = actualTargetColor || getTargetColor();
    console.log("Target color for results:", targetColorForResults);

    if (!targetColorForResults) {
      console.error("No target color available for results");
      return;
    }

    setResults({
      targetColor: targetColorForResults,
      capturedColor,
      similarity: score,
      timeTaken,
      mode: currentMode,
      gameType,
    });

    router.push("/results");
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full justify-between grow pb-8">
      <div className="flex flex-col items-center gap-1 w-full">
        <div className="flex w-80">
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
        <div className="flex w-80">
          <div
            className={cn(
              "flex-1 flex justify-center items-center px-8 py-3 border border-black cursor-pointer font-hartone text-base tracking-[7.5%]",
              gameType === "upload"
                ? "bg-black text-[#FFFFE7]"
                : "bg-[#FFFFE7] text-black",
            )}
            style={{
              borderRadius: "4px 0px 0px 4px",
              boxShadow:
                gameType === "upload"
                  ? "0px 1.5px 0px 0px rgba(0, 0, 0, 1)"
                  : "none",
            }}
            onClick={() => setGameType("upload")}
          >
            UPLOAD
          </div>
          <div
            className={cn(
              "flex-1 flex justify-center items-center px-8 py-3 border border-black cursor-pointer font-hartone text-base tracking-[7.5%]",
              gameType === "mixing"
                ? "bg-black text-[#FFFFE7]"
                : "bg-[#FFFFE7] text-black",
            )}
            style={{
              borderRadius: "0px 4px 4px 0px",
              boxShadow:
                gameType === "mixing"
                  ? "0px 1.5px 0px 0px rgba(0, 0, 0, 1)"
                  : "none",
            }}
            onClick={() => setGameType("mixing")}
          >
            MIX
          </div>
        </div>
      </div>

      {gameType === "upload" ? (
        <FindColorGame
          key={`find-${currentMode}-${getTargetColor()}`}
          targetColor={getTargetColor()}
          onScoreSubmit={handleScoreSubmit}
        />
      ) : (
        <ColorMixingGame
          key={`mix-${currentMode}-${getTargetColor()}`}
          targetColor={getTargetColor()}
          onScoreSubmit={handleScoreSubmit}
          mode={currentMode}
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
