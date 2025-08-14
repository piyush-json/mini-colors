"use client";

import { useState, useEffect, useCallback } from "react";
import { useColorGame } from "@/lib/useColorGame";
import { ColorSDK } from "@/lib/color-sdk";
import { RetroButton, RetroCard, RetroColorSwatch, RetroTimer, RetroSpinner, RetroScoreDisplay } from "./RetroUI";
import Webcam from "react-webcam";
import Link from "next/link";

export const DailyChallengeScreen = () => {
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
    getAverageScore,
    getBestScore,
    getWorstScore,
    getTotalGames,
    getTotalPlayTime,
    handleWebcamReady,
    handleWebcamError,
    startDailyMode,
    showResult,
    dailyColor,
  } = useColorGame();

  const [isMobile, setIsMobile] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Start daily mode on component mount
  useEffect(() => {
    startDailyMode();
  }, [startDailyMode]);

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

  const handleUserMedia = () => {
    setCameraError(null);
    handleWebcamReady();
  };

  const handleUserMediaError = (error: any) => {
    let message = "Camera initialization failed.";
    
    if (error.name === "NotAllowedError") {
      message = "Camera access denied. Please allow camera permissions and refresh the page.";
    } else if (error.name === "NotFoundError") {
      message = "No camera found on this device.";
    } else if (error.name === "NotReadableError") {
      message = "Camera is in use by another application. Please close other apps using the camera.";
    } else if (error.name === "OverconstrainedError") {
      message = "Camera doesn't support the required resolution. Please try a different camera.";
    } else if (error.name === "SecurityError") {
      message = "Camera access blocked for security reasons. Please check your browser settings.";
    }
    
    setCameraError(message);
    handleWebcamError(error);
  };

  const getAccessibilityDescription = (color: string) => {
    const colorName = ColorSDK.getColorName(color);
    const rgb = ColorSDK.hexToRgb(color);
    return `${colorName} color (${rgb})`;
  };

  return (
    <div className="min-h-screen retro-bg-gradient p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 retro-text-gradient-primary">
            🌟 Daily Challenge
          </h1>
          <p className="text-xl text-foreground-muted">
            A new color every day! Challenge yourself and compete on the global leaderboard.
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

        {/* Daily Challenge Info */}
        <RetroCard title="🎯 Daily Challenge Info" className="mb-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">🌟</div>
            <h3 className="text-xl font-bold">Daily Color Hunt</h3>
            <p className="text-foreground-muted">
              Today's target color: <strong>{dailyColor || "Loading..."}</strong>
            </p>
            <p className="text-sm text-foreground-muted">
              Unlimited attempts to beat your best score for today!
            </p>
          </div>
        </RetroCard>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Target Color Card */}
          <RetroCard title="Target Color">
            <div className="text-center space-y-4">
              <RetroColorSwatch
                color={gameState.targetColor || dailyColor || "#ff0000"}
                size="lg"
                showHex
                className="mx-auto"
              />
              <div className="font-mono text-sm text-foreground-muted">
                {getAccessibilityDescription(gameState.targetColor || dailyColor || "#ff0000")}
              </div>

              {gameState.isPlaying && (
                <div className="space-y-2">
                  <div className="font-mono text-sm font-bold text-foreground-muted">
                    Time:
                  </div>
                  <RetroTimer seconds={timer} />
                </div>
              )}

              {gameState.isPlaying ? (
                <RetroButton
                  onClick={handleCaptureColor}
                  variant="success"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || !webcamReady}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <RetroSpinner className="mr-2" />
                      Capturing...
                    </span>
                  ) : !webcamReady ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">📷</span>
                      Camera Setting Up...
                    </span>
                  ) : (
                    "📸 CAPTURE COLOR"
                  )}
                </RetroButton>
              ) : (
                <RetroButton onClick={handleStartGame} variant="primary" size="lg" className="w-full">
                  🚀 Start Daily Challenge
                </RetroButton>
              )}

              {gameState.isPlaying && (
                <RetroButton onClick={handleResetGame} variant="secondary" size="md" className="w-full">
                  🔄 New Game
                </RetroButton>
              )}
            </div>
          </RetroCard>

          {/* Camera View Card */}
          <RetroCard title="Camera View">
            <div className="text-center space-y-4">
              {!webcamReady && !cameraError && (
                <div className="space-y-3">
                  <div className="text-4xl">📷</div>
                  <p className="font-mono text-sm text-foreground-muted">
                    Initializing camera...
                  </p>
                </div>
              )}

              {webcamReady && <div className="text-4xl">✅</div>}

              <div className="relative">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className={`w-full h-64 object-cover rounded-2xl border-2 shadow-lg ${
                    webcamReady
                      ? "border-green-500"
                      : "border-gray-300 opacity-50"
                  }`}
                  videoConstraints={{
                    width: { ideal: 640, min: 320 },
                    height: { ideal: 480, min: 240 },
                    frameRate: { ideal: 30, min: 15 },
                  }}
                  onUserMedia={handleUserMedia}
                  onUserMediaError={handleUserMediaError}
                />

                {webcamReady && (
                  <>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 border-4 border-white rounded-full pointer-events-none shadow-lg animate-pulse" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-red-500 rounded-full" />
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      LIVE
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                {webcamReady ? (
                  <>
                    <p className="font-mono text-sm text-green-600 font-bold">
                      Camera Ready!
                    </p>
                    <p className="font-mono text-sm text-foreground-muted">
                      Point the crosshair at the target color and capture!
                    </p>
                  </>
                ) : (
                  <p className="font-mono text-sm text-foreground-muted">
                    Setting up camera...
                  </p>
                )}
              </div>

              {cameraError && (
                <div className="space-y-3">
                  <div className="text-4xl">❌</div>
                  <p className="font-mono text-sm text-red-600 font-bold">
                    Camera Error
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-700">
                    <p>{cameraError}</p>
                  </div>
                  <p className="text-xs text-foreground-muted">
                    💡 You can still play in practice mode without a camera!
                  </p>
                </div>
              )}
            </div>
          </RetroCard>
        </div>

        {/* Result Overlay */}
        {showResult && lastResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">🎯 Your Result!</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Score:</span>
                  <span className={`text-2xl font-bold ${
                    lastResult.finalScore >= 80 ? 'text-green-600' :
                    lastResult.finalScore >= 60 ? 'text-yellow-600' :
                    lastResult.finalScore >= 40 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {lastResult.finalScore}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Time:</span>
                  <span>{Math.round(lastResult.timeTaken / 1000)}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Accuracy:</span>
                  <span>{Math.round(lastResult.colorAccuracy)}%</span>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">
                    {lastResult.finalScore > gameState.bestScore
                      ? "🎉 New best score! Sent to leaderboard!"
                      : "Keep trying to beat your best score!"
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    Attempt {gameState.attempts + 1} of unlimited
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <RetroButton
                  onClick={handleStartGame}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  🚀 Try Again
                </RetroButton>
              </div>
            </div>
          </div>
        )}

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

        {/* Hidden canvas for color capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Navigation */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
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
            <Link href="/practice">
              <RetroButton variant="secondary" size="md">
                🎯 Practice Mode
              </RetroButton>
            </Link>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <RetroCard title="⚠️ Error" className="mt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-sm text-foreground-muted">
                Don't worry! You can still play in practice mode without a camera.
              </p>
            </div>
          </RetroCard>
        )}
      </div>
    </div>
  );
};
