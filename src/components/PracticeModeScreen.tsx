"use client";

import { useState, useEffect } from "react";
import { useColorGame } from "@/lib/useColorGame";
import { ColorSDK } from "@/lib/color-sdk";
import { RetroButton, RetroCard, RetroColorSwatch, RetroSpinner } from "./RetroUI";
import Link from "next/link";

export const PracticeModeScreen = () => {
  const {
    gameState,
    isLoading,
    startGame,
    captureColor,
    resetGame,
    setNewTargetColor,
    getAverageScore,
    getBestScore,
    getTotalGames,
  } = useColorGame();

  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleStartGame = () => {
    startGame();
  };

  const handleCaptureColor = () => {
    try {
      captureColor();
    } catch (error) {
      console.error("Error capturing color:", error);
    }
  };

  const handleResetGame = () => {
    resetGame();
  };

  const handleNewColor = () => {
    setNewTargetColor(ColorSDK.generateRandomColor());
  };

  return (
    <div className="min-h-screen retro-bg-gradient-alt p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 retro-text-gradient-secondary">
            🎮 Practice Mode
          </h1>
          <p className="text-xl text-foreground-muted">
            Practice your color matching skills without a camera!
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/">
              <RetroButton variant="secondary" size="md">
                ← Back to Menu
              </RetroButton>
            </Link>
            <Link href="/stats">
              <RetroButton variant="info" size="md">
                📊 View Stats
              </RetroButton>
            </Link>
          </div>
        </div>

        <RetroCard title="🎯 Practice Game" className="mb-6">
          {gameState.isPlaying ? (
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Target Color</h2>
                <RetroColorSwatch
                  color={gameState.targetColor}
                  size="lg"
                  showHex
                  className="mx-auto"
                />
                <p className="font-mono text-sm mt-2">
                  {gameState.targetColor}
                </p>
              </div>

              <div className="space-y-4">
                <RetroButton
                  onClick={handleCaptureColor}
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <RetroSpinner className="mr-2" />
                      Capturing...
                    </span>
                  ) : (
                    "🎯 Capture Color"
                  )}
                </RetroButton>

                <RetroButton
                  onClick={handleResetGame}
                  variant="secondary"
                  size="md"
                >
                  🔄 New Game
                </RetroButton>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Target Color</h2>
                <RetroColorSwatch
                  color={gameState.targetColor || "#ff0000"}
                  size="lg"
                  showHex
                  className="mx-auto"
                />
                <p className="font-mono text-sm mt-2">
                  {gameState.targetColor || "#ff0000"}
                </p>
              </div>

              <div className="space-y-4">
                <RetroButton
                  onClick={handleStartGame}
                  variant="primary"
                  size="lg"
                >
                  🚀 Start Practice Game
                </RetroButton>

                <RetroButton
                  onClick={handleNewColor}
                  variant="secondary"
                  size="md"
                >
                  🎲 New Color
                </RetroButton>
              </div>
            </div>
          )}
        </RetroCard>

        {/* Stats Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <RetroScoreDisplay
            label="Best Score"
            score={getBestScore()}
            maxScore={100}
          />
          <RetroScoreDisplay
            label="Average Score"
            score={getAverageScore()}
            maxScore={100}
          />
          <RetroScoreDisplay
            label="Games Played"
            score={getTotalGames()}
            maxScore={getTotalGames()}
          />
        </div>

        {/* Navigation */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/daily">
              <RetroButton variant="primary" size="md">
                🌟 Daily Challenge
              </RetroButton>
            </Link>
            <Link href="/party">
              <RetroButton variant="secondary" size="md">
                🎉 Party Mode
              </RetroButton>
            </Link>
            <Link href="/mixing">
              <RetroButton variant="secondary" size="md">
                🎨 Color Mixing
              </RetroButton>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-foreground-muted">
          <p>
            💡 In practice mode, you can visualize colors and practice your
            color recognition skills.
          </p>
          <p>
            🎯 Click "Start Practice Game" to begin, then "Capture Color" to
            simulate finding the target color.
          </p>
        </div>
      </div>
    </div>
  );
};
