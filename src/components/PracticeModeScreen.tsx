"use client";

import { useColorGame } from "@/lib/useColorGame";
import { ColorSDK } from "@/lib/color-sdk";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
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

  // Mobile detection functionality removed as it's not currently used

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
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
            🎮 PRACTICE
            <br />
            <span className="text-accent">MODE</span>
          </h1>
          <p className="text-xl font-bold uppercase tracking-wide">
            PRACTICE YOUR COLOR MATCHING SKILLS WITHOUT A CAMERA!
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/">
              <Button variant="secondary" size="default">
                ← BACK TO MENU
              </Button>
            </Link>
            <Link href="/stats">
              <Button variant="outline" size="default">
                📊 VIEW STATS
              </Button>
            </Link>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🎯 PRACTICE GAME</CardTitle>
            <CardDescription>DESTRUCTION TRAINING ARENA</CardDescription>
          </CardHeader>
          <CardContent>
            {gameState.isPlaying ? (
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wide mb-4">
                    TARGET COLOR
                  </h2>
                  <div
                    className="w-32 h-32 mx-auto border-8 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))]"
                    style={{ backgroundColor: gameState.targetColor }}
                  />
                  <p className="font-mono text-sm mt-2 font-black uppercase tracking-wide">
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
                  <h2 className="text-xl font-black uppercase tracking-wide mb-4">
                    TARGET COLOR
                  </h2>
                  <div
                    className="w-32 h-32 mx-auto border-8 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))]"
                    style={{
                      backgroundColor: gameState.targetColor || "#ff0000",
                    }}
                  />
                  <p className="font-mono text-sm mt-2 font-black uppercase tracking-wide">
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
                    onClick={handleNewColor}
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

        {/* Stats Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>🏆 BEST SCORE</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="success"
                className="text-2xl w-full text-center p-4"
              >
                {getBestScore()}%
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>📊 AVERAGE SCORE</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="outline"
                className="text-2xl w-full text-center p-4"
              >
                {getAverageScore()}%
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>🎮 GAMES PLAYED</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="accent"
                className="text-2xl w-full text-center p-4"
              >
                {getTotalGames()}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/daily">
              <Button variant="default" size="default">
                🌟 DAILY CHALLENGE
              </Button>
            </Link>
            <Link href="/party">
              <Button variant="secondary" size="default">
                🎉 PARTY MODE
              </Button>
            </Link>
            <Link href="/mixing">
              <Button variant="secondary" size="default">
                🎨 COLOR MIXING
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
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
    </div>
  );
};
