"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import Webcam from "react-webcam";
import { useState, useEffect } from "react";
import { useColorGame } from "@/lib/useColorGame";
import { ColorSDK } from "@/lib/color-sdk";

export const NormalGameScreen = () => {
  const {
    gameState,
    lastResult,
    timer,
    isLoading,
    error,
    webcamReady,
    webcamRef,
    canvasRef,
    startGame,
    captureColor,
    resetGame,
    handleWebcamReady,
    handleWebcamError,
    showResult,
    setNewTargetColor,
    getAverageScore,
    getBestScore,
    getTotalGames,
  } = useColorGame();

  const [isMobile, setIsMobile] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize with random color
  useEffect(() => {
    const generateNewColor = () => {
      const newColor = ColorSDK.generateRandomColor();
      setNewTargetColor(newColor);
    };
    generateNewColor();
  }, [setNewTargetColor]);

  // Update score when result changes
  useEffect(() => {
    if (lastResult) {
      setCurrentScore(lastResult.finalScore);
      setAttempts((prev) => prev + 1);
    }
  }, [lastResult]);

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  const generateNewColor = () => {
    const newColor = ColorSDK.generateRandomColor();
    setNewTargetColor(newColor);
  };

  const handleBackToMenu = () => {
    window.location.href = "/";
  };

  const handleNewGame = () => {
    resetGame();
    generateNewColor();
    startGame();
  };

  const handleCaptureAndNewColor = () => {
    captureColor();
    // Generate new color for next attempt
    setTimeout(() => {
      generateNewColor();
    }, 100);
  };

  const getAccessibilityDescription = (color: string) => {
    const colorName = ColorSDK.getColorName(color);
    const rgb = ColorSDK.hexToRgb(color);
    return `${colorName} color (${rgb})`;
  };

  const getScoreCategory = (score: number) => {
    if (score >= 90) return { text: "PERFECT", variant: "success" as const };
    if (score >= 80) return { text: "EXCELLENT", variant: "success" as const };
    if (score >= 70) return { text: "GREAT", variant: "accent" as const };
    if (score >= 60) return { text: "GOOD", variant: "secondary" as const };
    if (score >= 40) return { text: "OKAY", variant: "warning" as const };
    return { text: "KEEP TRYING", variant: "destructive" as const };
  };

  // Results screen after each capture
  if (lastResult && showResult) {
    const scoreCategory = getScoreCategory(lastResult.finalScore);

    return (
      <div className="min-h-screen bg-background p-4 font-mono">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
              🎯 RESULT
              <br />
              <span className="text-accent">#{attempts}</span>
            </h1>
            <Badge
              variant={scoreCategory.variant}
              className="text-xl px-8 py-3"
            >
              {scoreCategory.text}
            </Badge>
          </div>

          {/* Score Display */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>💥 SCORE BREAKDOWN</CardTitle>
              <CardDescription>YOUR COLOR HUNTING RESULTS</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="p-8 border-4 border-foreground bg-muted">
                <div className="font-black text-8xl uppercase tracking-tighter leading-none mb-4">
                  {lastResult.finalScore}
                </div>
                <Badge variant="accent" className="text-2xl px-8 py-3">
                  ACCURACY POINTS
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border-2 border-foreground">
                  <div className="font-black text-2xl">
                    {lastResult.similarity?.toFixed(1) || 0}%
                  </div>
                  <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                    COLOR MATCH
                  </div>
                </div>
                <div className="p-4 border-2 border-foreground">
                  <div className="font-black text-2xl">
                    {lastResult.timeScore || 0}
                  </div>
                  <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                    TIME BONUS
                  </div>
                </div>
                <div className="p-4 border-2 border-foreground">
                  <div className="font-black text-2xl">
                    {lastResult.timeTaken?.toFixed(1) || 0}s
                  </div>
                  <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                    TIME TAKEN
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>🎨 COLOR COMPARISON</CardTitle>
              <CardDescription>TARGET VS CAPTURED</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-black text-lg uppercase tracking-wide mb-2">
                  TARGET:
                </div>
                <div
                  className="w-full h-32 border-4 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))]"
                  style={{ backgroundColor: lastResult.targetColor }}
                />
                <Badge variant="outline" className="mt-2">
                  {lastResult.targetColor}
                </Badge>
              </div>
              <div>
                <div className="font-black text-lg uppercase tracking-wide mb-2">
                  CAPTURED:
                </div>
                <div
                  className="w-full h-32 border-4 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))]"
                  style={{ backgroundColor: lastResult.capturedColor }}
                />
                <Badge variant="outline" className="mt-2">
                  {lastResult.capturedColor}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                generateNewColor();
                startGame();
              }}
              variant="accent"
              size="lg"
              className="text-xl"
            >
              🎲 NEW COLOR
            </Button>

            <Button
              onClick={handleNewGame}
              variant="secondary"
              size="lg"
              className="text-xl"
            >
              🔄 RESTART
            </Button>

            <Button
              onClick={handleBackToMenu}
              variant="outline"
              size="lg"
              className="text-xl"
            >
              ← BACK TO MENU
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
            🎮 COLOR
            <br />
            <span className="text-accent">HUNTER</span>
          </h1>
          <p className="font-black text-xl uppercase tracking-wide text-muted-foreground mb-4">
            ENDLESS RANDOM COLOR CHALLENGE
          </p>
          <Badge variant="accent" className="text-lg px-6 py-2">
            NEW COLOR EVERY ATTEMPT
          </Badge>
        </div>

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <Button onClick={handleBackToMenu} variant="outline" size="sm">
            ← BACK TO MENU
          </Button>

          {/* Stats */}
          <div className="flex space-x-2">
            <Badge variant="outline">BEST: {getBestScore()}</Badge>
            <Badge variant="outline">AVG: {getAverageScore()}</Badge>
            <Badge variant="outline">GAMES: {getTotalGames()}</Badge>
          </div>

          {/* Timer */}
          <Card className="inline-block">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="font-black text-3xl uppercase tracking-tighter leading-none">
                  {formatTime(timer)}
                </div>
                <div className="font-bold text-xs uppercase tracking-wide text-muted-foreground">
                  TIME LEFT
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {(error || cameraError) && (
          <Card className="mb-8 bg-destructive border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive-foreground">
                ⚠️ SYSTEM ERROR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold text-destructive-foreground uppercase tracking-wide">
                {error || cameraError}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Target Color */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 RANDOM TARGET</CardTitle>
              <CardDescription>HUNT THIS COLOR NOW</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <div
                  className="w-full h-64 border-8 border-foreground shadow-[16px_16px_0px_hsl(var(--foreground))]"
                  style={{
                    backgroundColor: gameState.targetColor || "#ff0000",
                  }}
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-background/90">
                    {gameState.targetColor || "LOADING..."}
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-muted border-4 border-foreground">
                <div className="font-black text-sm uppercase tracking-wide mb-2">
                  COLOR DESCRIPTION:
                </div>
                <div className="font-mono text-sm">
                  {gameState.targetColor
                    ? getAccessibilityDescription(gameState.targetColor)
                    : "Loading color info..."}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <Button
                  onClick={() => setShowInstructions(!showInstructions)}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  {showInstructions ? "HIDE" : "SHOW"} INSTRUCTIONS
                </Button>

                {showInstructions && (
                  <div className="space-y-2 font-bold text-xs uppercase tracking-wide p-4 bg-muted border-2 border-foreground">
                    <div className="flex items-start space-x-2">
                      <span className="text-accent">1.</span>
                      <span>POINT CAMERA AT TARGET COLOR</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-accent">2.</span>
                      <span>CAPTURE WHEN YOU FIND IT</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-accent">3.</span>
                      <span>GET NEW RANDOM COLOR</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-accent">4.</span>
                      <span>REPEAT ENDLESSLY!</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={generateNewColor}
                  variant="secondary"
                  size="sm"
                  className="text-sm"
                >
                  🎲 NEW COLOR
                </Button>
                <Button
                  onClick={handleNewGame}
                  variant="outline"
                  size="sm"
                  className="text-sm"
                >
                  🔄 RESTART
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Camera Feed */}
          <Card>
            <CardHeader>
              <CardTitle>📹 HUNTING CAMERA</CardTitle>
              <CardDescription>FIND THE RANDOM TARGET</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="relative border-8 border-foreground shadow-[16px_16px_0px_hsl(var(--foreground))] overflow-hidden">
                  {webcamReady ? (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      className="w-full h-64 md:h-80 object-cover"
                      onUserMedia={handleWebcamReady}
                      onUserMediaError={(error) => {
                        handleWebcamError(error);
                        setCameraError("Camera access denied or unavailable");
                      }}
                      videoConstraints={{
                        width: isMobile ? 640 : 1280,
                        height: isMobile ? 480 : 720,
                        facingMode: isMobile ? "environment" : "user",
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 md:h-80 flex items-center justify-center bg-muted">
                      <div className="text-center space-y-4">
                        <div className="font-black text-2xl uppercase tracking-wide">
                          CAMERA INITIALIZING...
                        </div>
                        <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                          ALLOW CAMERA ACCESS
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Targeting crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 border-8 border-accent animate-pulse">
                      <div className="w-full h-full border-4 border-background"></div>
                    </div>
                  </div>
                </div>

                {/* Capture Button */}
                <div className="mt-8 text-center">
                  <Button
                    onClick={handleCaptureAndNewColor}
                    disabled={!webcamReady || isLoading || !gameState.isPlaying}
                    variant="accent"
                    size="lg"
                    className="text-2xl px-16 py-8"
                  >
                    {isLoading ? "ANALYZING..." : "🎯 CAPTURE & HUNT NEXT"}
                  </Button>
                </div>

                {/* Game Status */}
                {gameState.isPlaying ? (
                  <div className="mt-4 text-center">
                    <Badge variant="success" className="text-lg px-6 py-2">
                      ✅ HUNTING IN PROGRESS
                    </Badge>
                  </div>
                ) : (
                  <div className="mt-4 text-center">
                    <Button
                      onClick={() => {
                        generateNewColor();
                        startGame();
                      }}
                      variant="secondary"
                      size="lg"
                    >
                      🚀 START HUNTING
                    </Button>
                  </div>
                )}

                {/* Hidden canvas for color analysis */}
                <canvas
                  ref={canvasRef}
                  style={{ display: "none" }}
                  width={320}
                  height={240}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📊 SESSION STATS</CardTitle>
            <CardDescription>YOUR HUNTING PERFORMANCE</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border-2 border-foreground">
                <div className="font-black text-3xl">{attempts}</div>
                <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                  ATTEMPTS
                </div>
              </div>
              <div className="text-center p-4 border-2 border-foreground">
                <div className="font-black text-3xl">{currentScore}</div>
                <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                  LAST SCORE
                </div>
              </div>
              <div className="text-center p-4 border-2 border-foreground">
                <div className="font-black text-3xl">{getBestScore()}</div>
                <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                  BEST EVER
                </div>
              </div>
              <div className="text-center p-4 border-2 border-foreground">
                <div className="font-black text-3xl">{getAverageScore()}</div>
                <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                  AVERAGE
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
