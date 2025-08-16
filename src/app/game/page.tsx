"use client";

import React, { useState, useEffect } from "react";
import { FindColorGame } from "@/components/FindColorGame";
import { ColorMixingGame } from "@/components/ColorMixingGame";
import { ShareMintScreen } from "@/components/ShareMintScreen";
import { GameProvider, useGameContext } from "@/lib/GameContext";
import { useColorGame } from "@/lib/useColorGame";
import { useGameResults } from "@/lib/GameResultsContext";
import { cn } from "@/lib/utils";

function GamePageContent() {
  const gameContext = useGameContext();
  const {
    currentMode,
    gameType,
    results,
    setGameMode,
    setGameType,
    setResults,
    clearResults,
  } = useGameResults();

  const {
    gameState,
    isLoadingDailyColor,
    setDailyMode,
    setPracticeMode,
    loadDailyColor,
    generateNewPracticeColor,
  } = useColorGame({ initialMode: currentMode });

  useEffect(() => {
    if (currentMode === "daily") {
      loadDailyColor();
    }
  }, [currentMode, loadDailyColor]);

  const handleModeChange = (mode: "daily" | "practice") => {
    setGameMode(mode);
    if (mode === "daily") {
      setDailyMode();
    } else {
      setPracticeMode();
      generateNewPracticeColor();
    }
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

    // Get captured color based on game type
    let capturedColor: string;
    if (gameType === "upload") {
      // For upload game, get from camera context
      const contextCapturedColor = gameContext?.capturedColor;
      if (!contextCapturedColor) {
        console.error("No captured color available for upload game");
        return;
      }
      capturedColor = contextCapturedColor;
    } else {
      // For mixing game, use the mixed color passed from component
      if (!actualCapturedColor) {
        console.error("No mixed color provided for mixing game");
        return;
      }
      capturedColor = actualCapturedColor;
    }

    console.log("Captured color:", capturedColor);

    // Use the actual target color passed from the game component, or fall back to gameState
    const targetColorForResults = actualTargetColor || gameState.targetColor;
    console.log("Target color for results:", targetColorForResults);

    // Set results in context instead of navigating with URL params
    setResults({
      targetColor: targetColorForResults,
      capturedColor,
      similarity: score,
      timeTaken,
      mode: currentMode,
      gameType,
    });
  };

  // If there are results, show the results screen
  if (results) {
    const handleShare = () => {
      console.log("Share button clicked");
      const shareText = `I just scored ${results.similarity}% in the Color Finding Game! 🎯`;
      if (navigator.share) {
        navigator.share({
          title: "Color Game Results",
          text: shareText,
          url: window.location.href,
        });
      } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareText);
        alert("Results copied to clipboard!");
      }
    };

    const handleMint = () => {
      console.log("Mint button clicked");
      alert("Mint functionality coming soon!");
    };

    const handleContinue = () => {
      clearResults();
    };

    const handleAttemptAgain = () => {
      clearResults();
      setGameMode("practice");
    };

    return (
      <ShareMintScreen
        targetColor={results.targetColor}
        capturedColor={results.capturedColor}
        similarity={results.similarity}
        timeTaken={results.timeTaken}
        mode={results.mode}
        gameType={results.gameType}
        onShare={handleShare}
        onMint={handleMint}
        onContinue={handleContinue}
        onAttemptAgain={handleAttemptAgain}
      />
    );
  }

  // Render game interface
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
