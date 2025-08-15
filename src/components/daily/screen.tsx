// Types
interface ColorMatch {
  finalScore: number;
  similarity: number;
  timeScore: number;
  timeTaken: number;
  targetColor: string;
  capturedColor: string;
}

interface DailyStats {
  totalAttempts: number;
  bestScore: number;
  currentScore: number;
  isNewBest: boolean;
}

// Header Component
interface DailyHeaderProps {
  dailyColorInfo: { color: string; date: string } | null;
}

const DailyHeader: React.FC<DailyHeaderProps> = ({ dailyColorInfo }) => (
  <div className="text-center mb-8">
    <h1 className="font-black text-4xl sm:text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4 flex items-center justify-center gap-3">
      <Calendar className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden />
      DAILY
      <br />
      <span className="text-secondary">CHALLENGE</span>
    </h1>
    <p className="font-black text-sm sm:text-xl uppercase tracking-wide text-muted-foreground mb-4">
      {dailyColorInfo?.date
        ? new Date(dailyColorInfo.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "LOADING DATE..."}
    </p>
    <Badge
      variant="secondary"
      className="text-sm sm:text-lg px-4 sm:px-6 py-1.5 sm:py-2 inline-flex items-center gap-2"
    >
      <Target className="w-4 h-4" aria-hidden />
      UNLIMITED ATTEMPTS
    </Badge>
  </div>
);

// Stats Display Component
interface StatsDisplayProps {
  dailyStats: DailyStats;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ dailyStats }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Trophy className="w-5 h-5" aria-hidden />
        TODAY&apos;S PROGRESS
      </CardTitle>
      <CardDescription>YOUR DAILY CHALLENGE STATS</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 border-2 border-foreground">
          <div className="font-black text-3xl">{dailyStats.totalAttempts}</div>
          <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
            ATTEMPTS
          </div>
        </div>
        <div className="text-center p-4 border-2 border-foreground">
          <div className="font-black text-3xl">{dailyStats.bestScore}</div>
          <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
            BEST SCORE
          </div>
        </div>
        <div className="text-center p-4 border-2 border-foreground">
          <div className="font-black text-3xl">{dailyStats.currentScore}</div>
          <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
            LAST SCORE
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Results Screen Component
interface ResultsScreenProps {
  lastResult: ColorMatch;
  dailyStats: DailyStats;
  onShowLeaderboard: () => void;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  lastResult,
  dailyStats,
  onShowLeaderboard,
  onPlayAgain,
  onBackToMenu,
}) => (
  <div className="min-h-screen bg-background p-4 font-mono">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4 flex items-center justify-center gap-3">
          <Trophy className="w-10 h-10" aria-hidden />
          ATTEMPT
          <br />
          <span className="text-accent">COMPLETE</span>
        </h1>
        {dailyStats.isNewBest ? (
          <Badge
            variant="success"
            className="text-xl px-8 py-3 inline-flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" aria-hidden />
            NEW PERSONAL BEST!
          </Badge>
        ) : (
          <Badge
            variant="accent"
            className="text-xl px-8 py-3 inline-flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" aria-hidden />
            ATTEMPT #{dailyStats.totalAttempts}
          </Badge>
        )}
      </div>

      {/* Score Display */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            DESTRUCTION RESULTS
          </CardTitle>
          <CardDescription>YOUR ATTEMPT REPORT</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="p-8 border-4 border-foreground bg-muted">
            <div className="font-black text-8xl uppercase tracking-tighter leading-none mb-4">
              {lastResult.finalScore}
            </div>
            <Badge variant="success" className="text-2xl px-8 py-3">
              DESTRUCTION POINTS
            </Badge>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border-2 border-foreground">
              <div className="font-black text-2xl">
                {lastResult.similarity.toFixed(1)}%
              </div>
              <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                ACCURACY
              </div>
            </div>
            <div className="p-4 border-2 border-foreground">
              <div className="font-black text-2xl">{lastResult.timeScore}</div>
              <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                TIME BONUS
              </div>
            </div>
            <div className="p-4 border-2 border-foreground">
              <div className="font-black text-2xl">
                {lastResult.timeTaken.toFixed(1)}s
              </div>
              <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                TIME TAKEN
              </div>
            </div>
          </div>

          {/* Daily Stats */}
          <div className="p-4 border-2 border-secondary bg-secondary/10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-black text-xl">
                  #{dailyStats.totalAttempts}
                </div>
                <div className="font-bold text-xs uppercase tracking-wide text-muted-foreground">
                  ATTEMPTS TODAY
                </div>
              </div>
              <div>
                <div className="font-black text-xl">{dailyStats.bestScore}</div>
                <div className="font-bold text-xs uppercase tracking-wide text-muted-foreground">
                  DAILY BEST
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Comparison */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" aria-hidden /> COLOR ANNIHILATION
          </CardTitle>
          <CardDescription>TARGET VS CAPTURED DESTRUCTION</CardDescription>
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
          onClick={onShowLeaderboard}
          variant="accent"
          size="lg"
          className="text-xl inline-flex items-center gap-2"
        >
          <Trophy className="w-5 h-5" aria-hidden />
          VIEW LEADERBOARD
        </Button>

        <Button
          onClick={onPlayAgain}
          variant="secondary"
          size="lg"
          className="text-xl inline-flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" aria-hidden />
          TRY AGAIN
        </Button>

        <Button
          onClick={onBackToMenu}
          variant="outline"
          size="lg"
          className="text-xl inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden />
          BACK TO MENU
        </Button>
      </div>
    </div>
  </div>
);

// Target Color Component
interface TargetColorDisplayProps {
  dailyColor: string;
  dailyColorInfo: { color: string; date: string } | null;
  getAccessibilityDescription: (color: string) => string;
}

const TargetColorDisplay: React.FC<TargetColorDisplayProps> = ({
  dailyColor,
  dailyColorInfo,
  getAccessibilityDescription,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Target className="w-5 h-5" aria-hidden /> TODAY&apos;S TARGET
      </CardTitle>
      <CardDescription>DESTROY THIS EXACT COLOR</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="relative">
        <div
          className="w-full h-24 sm:h-64 md:h-72 border-4 md:border-8 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))] md:shadow-[16px_16px_0px_hsl(var(--foreground))]"
          style={{
            backgroundColor: dailyColor || dailyColorInfo?.color || "#000000",
          }}
        />
      </div>

      <div className="text-center">
        <Badge
          variant="warning"
          className="text-sm sm:text-lg px-4 sm:px-6 py-1.5 sm:py-2 inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" aria-hidden />
          UNLIMITED ATTEMPTS
        </Badge>
      </div>
    </CardContent>
  </Card>
);

// Camera Feed Component
interface CameraFeedProps {
  webcamRef: React.RefObject<any>;
  webcamReady: boolean;
  isLoading: boolean;
  gameState: { isPlaying: boolean };
  isMobile: boolean;
  handleWebcamReady: () => void;
  handleWebcamError: (error: any) => void;
  setCameraError: (error: string) => void;
  captureColor: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CameraFeed: React.FC<CameraFeedProps> = ({
  webcamRef,
  webcamReady,
  isLoading,
  gameState,
  isMobile,
  handleWebcamReady,
  handleWebcamError,
  setCameraError,
  captureColor,
  canvasRef,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Camera className="w-5 h-5" aria-hidden /> DESTRUCTION CAMERA
      </CardTitle>
      <CardDescription>FIND AND DESTROY THE TARGET</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="relative">
        <div className="relative border-8 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))] sm:shadow-[16px_16px_0px_hsl(var(--foreground))] overflow-hidden">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full h-40 sm:h-64 md:h-80 object-cover"
            onUserMedia={handleWebcamReady}
            onUserMediaError={(err: unknown) => {
              let errObj = {
                name: "CameraError",
                message: String(err),
              };
              if (typeof err === "string") {
                errObj = { name: "CameraError", message: err };
              } else if (err && typeof err === "object") {
                const maybe = err as {
                  name?: string;
                  message?: string;
                };
                if (maybe.message || maybe.name) {
                  errObj = {
                    name: maybe.name ?? "CameraError",
                    message: maybe.message ?? String(err),
                  };
                }
              }
              handleWebcamError(errObj);
              setCameraError("Camera access denied or unavailable");
            }}
            videoConstraints={{
              width: isMobile ? 640 : 1280,
              height: isMobile ? 480 : 720,
              facingMode: isMobile ? "environment" : "user",
            }}
          />

          {/* Overlay shown while webcam isn't ready */}
          {!webcamReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/90">
              <div className="text-center space-y-4 px-4">
                <div className="font-black text-lg sm:text-2xl uppercase tracking-wide">
                  CAMERA INITIALIZING...
                </div>
                <div className="font-bold text-xs sm:text-sm uppercase tracking-wide text-muted-foreground">
                  ALLOW CAMERA ACCESS FOR DESTRUCTION
                </div>
              </div>
            </div>
          )}

          {/* Targeting crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 border-8 border-destructive">
              <div className="w-full h-full border-4 border-background"></div>
            </div>
          </div>
        </div>

        {/* Capture Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={captureColor}
            disabled={!webcamReady || isLoading || !gameState.isPlaying}
            variant="destructive"
            size="lg"
            className="text-base md:text-2xl px-6 md:px-16 py-3 md:py-8 inline-flex items-center gap-3 justify-center"
          >
            {isLoading ? (
              "ANALYZING DESTRUCTION..."
            ) : (
              <>
                <Camera className="w-5 h-5 md:w-6 md:h-6" aria-hidden />
                CAPTURE & DESTROY
              </>
            )}
          </Button>
        </div>

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
);

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Webcam from "react-webcam";
import { useState, useEffect } from "react";
import { useColorGame } from "@/lib/useColorGame";
import { DailyLeaderboard } from "./leaderboard";
import {
  Trophy,
  Camera,
  Target,
  Clock,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Calendar,
  Palette,
} from "lucide-react";

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
    captureColor,
    resetGame,
    handleWebcamReady,
    handleWebcamError,
    startDailyMode,
    startGame,
    showResult,
    dailyColor,
  } = useColorGame();

  const [isMobile, setIsMobile] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDailyResult, setShowDailyResult] = useState(false);
  const [dailyColorInfo, setDailyColorInfo] = useState<{
    color: string;
    date: string;
  } | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    totalAttempts: 0,
    bestScore: 0,
    currentScore: 0,
    isNewBest: false,
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch daily color and stats
  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const [dailyResponse, statsResponse] = await Promise.all([
          fetch("/api/daily"),
          fetch("/api/daily/stats"),
        ]);

        if (dailyResponse.ok) {
          const dailyData = await dailyResponse.json();
          setDailyColorInfo(dailyData);
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setDailyStats(statsData);
        }
      } catch (error) {
        console.error("Failed to fetch daily data:", error);
      }
    };

    fetchDailyData();
  }, []);

  // Start daily mode when daily color is available
  useEffect(() => {
    if (dailyColorInfo) {
      startDailyMode();
      if (!gameState.isPlaying) {
        startGame();
      }
    }
  }, [dailyColorInfo, startDailyMode, startGame, gameState.isPlaying]);

  // Update stats when game completes
  useEffect(() => {
    if (lastResult) {
      const updateDailyStats = async () => {
        try {
          const response = await fetch("/api/daily/stats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              score: lastResult.finalScore,
              date:
                dailyColorInfo?.date || new Date().toISOString().split("T")[0],
            }),
          });

          if (response.ok) {
            const updatedStats = await response.json();
            setDailyStats(updatedStats);
            // Show the daily result screen and hide the default game result
            setShowDailyResult(true);
          }
        } catch (error) {
          console.error("Failed to update daily stats:", error);
        }
      };

      updateDailyStats();
    }
  }, [lastResult, dailyColorInfo?.date]);

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  const handleBackToMenu = () => {
    window.location.href = "/";
  };

  const handlePlayAgain = () => {
    setShowDailyResult(false);
    resetGame();
    startDailyMode();
    startGame();
  };

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
  };

  const handleSubmitScore = async (name: string) => {
    if (dailyStats.bestScore > 0) {
      try {
        await fetch("/api/leaderboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            score: dailyStats.bestScore,
            date:
              dailyColorInfo?.date || new Date().toISOString().split("T")[0],
          }),
        });
      } catch (error) {
        console.error("Failed to submit score:", error);
      }
    }
  };

  const getAccessibilityDescription = (color: string) => {
    return `Color: ${color}`;
  };

  if (showLeaderboard) {
    return (
      <DailyLeaderboard
        onClose={handleCloseLeaderboard}
        currentDate={
          dailyColorInfo?.date || new Date().toISOString().split("T")[0]
        }
        currentScore={dailyStats.bestScore || undefined}
      />
    );
  }

  // Results screen
  if (lastResult && showDailyResult) {
    return (
      <ResultsScreen
        lastResult={lastResult}
        dailyStats={dailyStats}
        onShowLeaderboard={handleShowLeaderboard}
        onPlayAgain={handlePlayAgain}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  // Main game screen
  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-4xl md:max-w-6xl mx-auto">
        {/* Header */}
        <DailyHeader dailyColorInfo={dailyColorInfo} />

        {/* Daily Stats */}
        <StatsDisplay dailyStats={dailyStats} />

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-3">
          <Button
            onClick={handleBackToMenu}
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            BACK TO MENU
          </Button>

          <Button
            onClick={handleShowLeaderboard}
            variant="ghost"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" aria-hidden />
            LEADERBOARD
          </Button>

          {/* Timer */}
          <Card className="inline-block">
            <CardContent className="p-2 sm:p-4">
              <div className="text-center">
                <div className="font-black text-2xl sm:text-3xl uppercase tracking-tighter leading-none flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" aria-hidden />
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
              <CardTitle className="text-destructive-foreground inline-flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" aria-hidden />
                SYSTEM ERROR
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Target Color */}
          <TargetColorDisplay
            dailyColor={dailyColor}
            dailyColorInfo={dailyColorInfo}
            getAccessibilityDescription={getAccessibilityDescription}
          />

          {/* Camera Feed */}
          <CameraFeed
            webcamRef={webcamRef}
            webcamReady={webcamReady}
            isLoading={isLoading}
            gameState={gameState}
            isMobile={isMobile}
            handleWebcamReady={handleWebcamReady}
            handleWebcamError={handleWebcamError}
            setCameraError={setCameraError}
            captureColor={captureColor}
            canvasRef={canvasRef}
          />
        </div>
      </div>
    </div>
  );
};
