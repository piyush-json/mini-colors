import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import Webcam from "react-webcam";
import { useState } from "react";

interface GamePlayingScreenProps {
  targetColor: string;
  timer: number;
  isLoading: boolean;
  onCaptureColor: () => void;
  onBackToMenu: () => void;
  webcamRef: React.RefObject<Webcam>;
  canvasRef: any;
  isMobile: boolean;
  getAccessibilityDescription: (color: string) => string;
  webcamReady: boolean;
  handleWebcamReady: () => void;
  handleWebcamError: (error: any) => void;
  onStartGame: () => void;
  practiceMode: boolean;
  onPracticeMode: () => void;
  onShowStats: () => void;
  onShowHistory: () => void;
  getBestScore: () => number;
  getAverageScore: () => number;
  getTotalGames: () => number;
  showResult: boolean;
  lastResult: any;
  dailyMode: boolean;
  attempts: number;
  bestScore: number;
}

export const GamePlayingScreen = ({
  targetColor,
  timer,
  isLoading,
  onCaptureColor,
  onBackToMenu,
  webcamRef,
  canvasRef,
  isMobile,
  getAccessibilityDescription,
  webcamReady,
  handleWebcamReady,
  handleWebcamError,
  onStartGame,
  practiceMode,
  onPracticeMode,
  onShowStats,
  onShowHistory,
  getBestScore,
  getAverageScore,
  getTotalGames,
  showResult,
  lastResult,
  dailyMode,
  attempts,
  bestScore,
}: GamePlayingScreenProps) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header with Timer and Stats */}
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-4">
            <Button
              onClick={onBackToMenu}
              variant="outline"
              size="sm"
              className="font-black"
            >
              ← BACK TO MENU
            </Button>
            
            {practiceMode && (
              <Badge variant="info" className="text-lg">
                PRACTICE MODE
              </Badge>
            )}
            
            {dailyMode && (
              <Badge variant="secondary" className="text-lg">
                DAILY CHALLENGE
              </Badge>
            )}
          </div>

          <div className="text-right space-y-4">
            {/* Timer */}
            <Card className="inline-block">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="font-black text-4xl md:text-6xl uppercase tracking-tighter leading-none">
                    {formatTime(timer)}
                  </div>
                  <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                    TIME LEFT
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="flex space-x-2">
              <Badge variant="outline">
                BEST: {getBestScore()}
              </Badge>
              <Badge variant="outline">
                AVG: {getAverageScore()}
              </Badge>
              <Badge variant="outline">
                GAMES: {getTotalGames()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Target Color Display */}
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle>🎯 TARGET COLOR</CardTitle>
              <CardDescription>FIND THIS EXACT COLOR</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Swatch */}
              <div className="relative">
                <div
                  className="w-full h-48 border-4 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))]"
                  style={{ backgroundColor: targetColor }}
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-background/90">
                    {targetColor}
                  </Badge>
                </div>
              </div>

              {/* Color Info */}
              <div className="space-y-2">
                <div className="font-bold text-sm uppercase tracking-wide">
                  COLOR DESCRIPTION:
                </div>
                <div className="font-mono text-sm p-3 bg-muted border-2 border-foreground">
                  {getAccessibilityDescription(targetColor)}
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
                  <div className="space-y-2 font-bold text-xs uppercase tracking-wide">
                    <div className="flex items-start space-x-2">
                      <span className="text-accent">1.</span>
                      <span>POINT YOUR CAMERA AT OBJECTS</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-accent">2.</span>
                      <span>FIND THE MATCHING COLOR</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-accent">3.</span>
                      <span>CLICK CAPTURE WHEN READY</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-accent">4.</span>
                      <span>GET SCORED ON ACCURACY</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Camera Feed */}
          <Card className="order-1 lg:order-2">
            <CardHeader>
              <CardTitle>📹 CAMERA FEED</CardTitle>
              <CardDescription>HUNT FOR COLORS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Webcam Component */}
                <div className="relative border-4 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))] overflow-hidden">
                  {webcamReady ? (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      className="w-full h-64 md:h-80 object-cover"
                      onUserMedia={handleWebcamReady}
                      onUserMediaError={handleWebcamError}
                      videoConstraints={{
                        width: isMobile ? 640 : 1280,
                        height: isMobile ? 480 : 720,
                        facingMode: isMobile ? "environment" : "user"
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 md:h-80 flex items-center justify-center bg-muted">
                      <div className="text-center space-y-4">
                        <div className="font-black text-2xl uppercase tracking-wide">
                          CAMERA LOADING...
                        </div>
                        <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                          ALLOW CAMERA ACCESS
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Crosshair overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 border-4 border-accent">
                      <div className="w-full h-full border-2 border-background"></div>
                    </div>
                  </div>
                </div>

                {/* Capture Button */}
                <div className="mt-6 text-center">
                  <Button
                    onClick={onCaptureColor}
                    disabled={!webcamReady || isLoading}
                    variant="accent"
                    size="lg"
                    className="text-xl px-12 py-6"
                  >
                    {isLoading ? "ANALYZING..." : "🎯 CAPTURE COLOR"}
                  </Button>
                </div>

                {/* Canvas for color analysis (hidden) */}
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

        {/* Bottom Action Bar */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button onClick={onShowStats} variant="ghost">
            📊 STATS
          </Button>
          <Button onClick={onShowHistory} variant="ghost">
            📜 HISTORY
          </Button>
          <Button onClick={onPracticeMode} variant="ghost">
            {practiceMode ? "EXIT PRACTICE" : "PRACTICE MODE"}
          </Button>
          <Button onClick={onStartGame} variant="secondary">
            🔄 NEW GAME
          </Button>
        </div>
      </div>
    </div>
  );
};
