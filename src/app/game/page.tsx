"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FindColorGame } from "@/components/FindColorGame";
import { ColorMixingGame } from "@/components/ColorMixingGame";
import { useGameContext } from "@/lib/GameContext";
import { useColorGame } from "@/lib/useColorGame";
import { useGameResults } from "@/lib/GameResultsContext";
import { cn } from "@/lib/utils";

export default function GamePageContent() {
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

  // Initialize the game mode based on the current mode set from homepage
  useEffect(() => {
    if (currentMode === "daily") {
      setDailyMode();
      if (!dailyColor && !isLoadingDailyColor) {
        loadDailyColor();
      }
    } else {
      setPracticeMode();
      generateNewPracticeColor();
    }
  }, [
    currentMode,
    setDailyMode,
    setPracticeMode,
    generateNewPracticeColor,
    dailyColor,
    isLoadingDailyColor,
    loadDailyColor,
  ]);

  useEffect(() => {
    if (currentMode === "daily" && !dailyColor && !isLoadingDailyColor) {
      loadDailyColor();
    }
  }, [currentMode, dailyColor, isLoadingDailyColor, loadDailyColor]);

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
      // For upload (FindColorGame), use the actualCapturedColor passed from the game
      if (actualCapturedColor) {
        capturedColor = actualCapturedColor;
      } else {
        // Fallback to context if not provided (for backward compatibility)
        const contextCapturedColor = gameContext?.capturedColor;
        if (!contextCapturedColor) {
          console.error("No captured color available for upload game");
          return;
        }
        capturedColor = contextCapturedColor;
      }
    } else {
      if (!actualCapturedColor) {
        console.error("No mixed color provided for mixing game");
        return;
      }
      capturedColor = actualCapturedColor;
    }

    console.log("Captured color:", capturedColor);

    const targetColorForResults = actualTargetColor || getTargetColor();

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
          mode={currentMode}
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
