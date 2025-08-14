"use client";

import { useColorGame } from "@/lib/useColorGame";
import { ColorSDK } from "@/lib/color-sdk";
import { useState, useMemo } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { NormalGameScreen } from "./NormalGameScreen";
import { ResultsScreen } from "./ResultsScreen";
import { StatsScreen } from "./StatsScreen";
import { GameHistoryScreen } from "./GameHistoryScreen";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type GameFlowState =
  | "welcome"
  | "playing"
  | "results"
  | "stats"
  | "history"
  | "practice";

const ColorGame = () => {
  const {
    gameState,
    lastResult,
    isLoading,
    error,
    startGame,
    captureColor,
    resetGame,
    getAverageScore,
    getBestScore,
    getWorstScore,
    getTotalGames,
    getTotalPlayTime,
    setNewTargetColor,
    startDailyMode,
  } = useColorGame();

  const [practiceMode, setPracticeMode] = useState(false);
  const [overrideState, setOverrideState] = useState<GameFlowState | null>(
    null,
  );

  // Mobile detection functionality removed as it's not currently used

  // Compute game flow state
  const computedGameFlowState = useMemo((): GameFlowState => {
    if (gameState.isPlaying) return "playing";
    if (lastResult) return "results";
    return "welcome";
  }, [gameState.isPlaying, lastResult]);

  const gameFlowState = overrideState || computedGameFlowState;

  const handleStartGame = () => {
    startGame();
  };

  const handleStartGameFromWelcome = () => {
    startGame();
    setOverrideState("playing");
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
    setOverrideState(null);
  };

  const handlePracticeMode = () => {
    setPracticeMode(!practiceMode);
    if (practiceMode) {
      resetGame();
      setOverrideState(null);
    } else {
      setOverrideState("practice");
    }
  };

  const handleShowStats = () => setOverrideState("stats");
  const handleShowHistory = () => setOverrideState("history");
  const handleBackToWelcome = () => {
    resetGame();
    setOverrideState(null);
  };

  // Placeholder functions for navigation to other game modes
  const startPartyMode = () => {
    // This would navigate to party mode page
    console.log("Navigate to party mode");
  };

  const startMixMode = () => {
    // This would navigate to mix mode page
    console.log("Navigate to mix mode");
  };

  // Utility functions
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "🎯 Perfect Match!";
    if (score >= 80) return "🌟 Excellent!";
    if (score >= 70) return "👍 Great Job!";
    if (score >= 60) return "😊 Good!";
    if (score >= 40) return "🤔 Close!";
    return "💪 Keep Trying!";
  };

  const getDifficultyLevel = (score: number) => {
    if (score >= 80) return { level: "EXPERT", color: "success" as const };
    if (score >= 60) return { level: "ADVANCED", color: "info" as const };
    if (score >= 40)
      return { level: "INTERMEDIATE", color: "warning" as const };
    return { level: "BEGINNER", color: "error" as const };
  };

  const getAccessibilityDescription = (color: string) => {
    const colorName = ColorSDK.getColorName(color);
    const rgb = ColorSDK.hexToRgb(color);
    return `${colorName} color (${rgb})`;
  };

  // Render screens
  switch (gameFlowState) {
    case "welcome":
      return (
        <WelcomeScreen
          onStartGame={handleStartGameFromWelcome}
          onShowStats={handleShowStats}
          onPracticeMode={handlePracticeMode}
          error={error}
          onDailyMode={async () => {
            try {
              await startDailyMode();
              setOverrideState("playing");
            } catch (error) {
              console.error("Failed to start daily mode:", error);
            }
          }}
          onPartyMode={startPartyMode}
          onMixMode={startMixMode}
        />
      );

    case "playing":
      return <NormalGameScreen />;

    case "results":
      if (!lastResult) return null;
      return (
        <ResultsScreen
          lastResult={lastResult}
          onPlayAgain={handleStartGame}
          onResetGame={handleResetGame}
          onShowStats={handleShowStats}
          onShowHistory={handleShowHistory}
          onBackToMenu={handleBackToWelcome}
          getScoreColor={getScoreColor}
          getScoreMessage={getScoreMessage}
          getDifficultyLevel={getDifficultyLevel}
          getAccessibilityDescription={getAccessibilityDescription}
        />
      );

    case "stats":
      return (
        <StatsScreen
          onBackToMenu={handleBackToWelcome}
          getAverageScore={getAverageScore}
          getBestScore={getBestScore}
          getWorstScore={getWorstScore}
          getTotalGames={getTotalGames}
          getTotalPlayTime={getTotalPlayTime}
          onShowHistory={handleShowHistory}
        />
      );

    case "history":
      return <GameHistoryScreen />;

    case "practice":
      return (
        <div className="min-h-screen bg-background p-4 font-mono">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
                🎮 PRACTICE
                <br />
                <span className="text-accent">MODE</span>
              </h1>
              <p className="font-bold text-lg uppercase tracking-wide">
                PRACTICE YOUR COLOR MATCHING SKILLS WITHOUT A CAMERA!
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>🎯 PRACTICE ARENA</CardTitle>
                <CardDescription>
                  SHARPEN YOUR DESTRUCTION SKILLS
                </CardDescription>
              </CardHeader>
              <CardContent>
                {gameState.isPlaying ? (
                  <div className="text-center space-y-6">
                    <div>
                      <h2 className="font-black text-xl uppercase tracking-wide mb-4">
                        TARGET COLOR
                      </h2>
                      <div
                        className="w-32 h-32 mx-auto border-8 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))]"
                        style={{ backgroundColor: gameState.targetColor }}
                      />
                      <p className="font-mono text-sm mt-2 font-bold uppercase">
                        {gameState.targetColor}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Button
                        onClick={handleCaptureColor}
                        variant="default"
                        size="lg"
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "🎯 CAPTURING..." : "🎯 CAPTURE COLOR"}
                      </Button>

                      <Button
                        onClick={handleResetGame}
                        variant="secondary"
                        size="default"
                        className="w-full"
                      >
                        🔄 NEW GAME
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div>
                      <h2 className="font-black text-xl uppercase tracking-wide mb-4">
                        TARGET COLOR
                      </h2>
                      <div
                        className="w-32 h-32 mx-auto border-8 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))]"
                        style={{
                          backgroundColor: gameState.targetColor || "#ff0000",
                        }}
                      />
                      <p className="font-mono text-sm mt-2 font-bold uppercase">
                        {gameState.targetColor || "#ff0000"}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Button
                        onClick={handleStartGame}
                        variant="default"
                        size="lg"
                        className="w-full"
                      >
                        🚀 START PRACTICE GAME
                      </Button>

                      <Button
                        onClick={() =>
                          setNewTargetColor(ColorSDK.generateRandomColor())
                        }
                        variant="secondary"
                        size="default"
                        className="w-full"
                      >
                        🎲 NEW COLOR
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="text-center mb-6">
              <Button
                onClick={handleBackToWelcome}
                variant="secondary"
                size="default"
              >
                ← BACK TO WELCOME
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-sm space-y-2">
                  <p className="font-black uppercase tracking-wide">
                    💡 IN PRACTICE MODE, YOU CAN VISUALIZE COLORS AND PRACTICE
                    YOUR COLOR RECOGNITION SKILLS.
                  </p>
                  <p className="font-black uppercase tracking-wide">
                    🎯 CLICK &quot;START PRACTICE GAME&quot; TO BEGIN, THEN
                    &quot;CAPTURE COLOR&quot; TO SIMULATE FINDING THE TARGET
                    COLOR.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );

    default:
      return (
        <div className="min-h-screen bg-background p-4 font-mono flex items-center justify-center">
          <Card>
            <CardContent className="text-center p-8">
              <div className="text-4xl mb-4">❓</div>
              <p className="font-black text-lg uppercase tracking-wide mb-4">
                SOMETHING WENT WRONG WITH THE GAME FLOW
              </p>
              <Button onClick={handleBackToWelcome} variant="default" size="lg">
                BACK TO WELCOME
              </Button>
            </CardContent>
          </Card>
        </div>
      );
  }
};

export default ColorGame;
