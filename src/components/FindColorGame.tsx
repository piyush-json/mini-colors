import { useState, useEffect, useRef, useCallback } from "react";
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
import { ColorSDK } from "@/lib/color-sdk";

interface FindColorGameProps {
  targetColor: string;
  onScoreSubmit: (score: number, timeTaken: number) => void;
  isMultiplayer?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FindColorGame = ({
  targetColor,
  onScoreSubmit,
  isMultiplayer = false,
  disabled = false,
  className = "",
}: FindColorGameProps) => {
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [webcamReady, setWebcamReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Timer management
  useEffect(() => {
    if (gameStarted && !gameFinished && !disabled) {
      timerInterval.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [gameStarted, gameFinished, disabled]);

  // Auto-start for multiplayer mode
  useEffect(() => {
    if (isMultiplayer && !disabled) {
      setGameStarted(true);
      setTimer(0);
      setGameFinished(false);
      setLastScore(null);
    }
  }, [isMultiplayer, disabled, targetColor]);

  const handleWebcamReady = useCallback(() => {
    setWebcamReady(true);
    setCameraError(null);
  }, []);

  const handleWebcamError = useCallback((error: string | DOMException) => {
    let message = "Camera initialization failed.";

    if (typeof error === "object" && error.name === "NotAllowedError") {
      message =
        "Camera access denied. Please allow camera permissions and refresh the page.";
    } else if (typeof error === "object" && error.name === "NotFoundError") {
      message = "No camera found on this device.";
    } else if (typeof error === "object" && error.name === "NotReadableError") {
      message =
        "Camera is in use by another application. Please close other apps using the camera.";
    } else if (
      typeof error === "object" &&
      error.name === "OverconstrainedError"
    ) {
      message =
        "Camera doesn't support the required resolution. Please try a different camera.";
    } else if (typeof error === "object" && error.name === "SecurityError") {
      message =
        "Camera access blocked for security reasons. Please check your browser settings.";
    }

    setCameraError(message);
    setWebcamReady(false);
  }, []);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setTimer(0);
    setGameFinished(false);
    setLastScore(null);
  }, []);

  const captureColor = useCallback(async () => {
    if (!gameStarted || gameFinished || isLoading || disabled) return;

    setIsLoading(true);

    try {
      if (!webcamRef.current || !canvasRef.current) {
        throw new Error("Camera not available");
      }

      const video = webcamRef.current.video as HTMLVideoElement;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx || !video.videoWidth || !video.videoHeight) {
        throw new Error("Video not ready");
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      // Get color from center of the image
      const centerX = Math.floor(canvas.width / 2);
      const centerY = Math.floor(canvas.height / 2);
      const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;
      const capturedColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

      // Calculate score using ColorSDK
      const result = ColorSDK.calculateScore(
        targetColor,
        capturedColor,
        Date.now() - timer * 1000,
        Date.now(),
      );
      const score = Math.round(result.finalScore);

      setLastScore(score);
      setGameFinished(true);

      // Submit score
      onScoreSubmit(score, timer * 1000);
    } catch (error) {
      console.error("Color capture failed:", error);
      setCameraError("Failed to capture color. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [
    gameStarted,
    gameFinished,
    isLoading,
    disabled,
    targetColor,
    timer,
    onScoreSubmit,
  ]);

  const resetGame = useCallback(() => {
    setGameStarted(false);
    setGameFinished(false);
    setTimer(0);
    setLastScore(null);
    setCameraError(null);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Target Color Display */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 TARGET COLOR</CardTitle>
          <CardDescription>LOCATE AND DESTROY THIS COLOR</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div
            className="w-32 h-32 mx-auto border-8 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))]"
            style={{ backgroundColor: targetColor }}
          />
          <p className="text-sm font-mono font-black uppercase tracking-wide">
            {targetColor}
          </p>
          <p className="text-sm font-bold uppercase tracking-wide">
            FIND THIS COLOR IN YOUR SURROUNDINGS AND CAPTURE IT!
          </p>

          {gameStarted && !gameFinished && (
            <Badge variant="outline" className="text-lg">
              TIME: {timer}S
            </Badge>
          )}

          {lastScore !== null && (
            <Badge
              variant={
                lastScore >= 80
                  ? "success"
                  : lastScore >= 60
                    ? "accent"
                    : lastScore >= 40
                      ? "secondary"
                      : "destructive"
              }
              className="text-xl"
            >
              SCORE: {lastScore}%
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Camera View */}
      <Card>
        <CardHeader>
          <CardTitle>📷 CAMERA VIEW</CardTitle>
          <CardDescription>DESTRUCTION TARGETING SYSTEM</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className={`w-full h-64 object-cover border-8 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))] ${
                webcamReady ? "border-success" : "border-foreground opacity-50"
              }`}
              videoConstraints={{
                facingMode: "user",
                width: { ideal: 640, min: 320 },
                height: { ideal: 480, min: 240 },
                frameRate: { ideal: 30, min: 15 },
              }}
              onUserMedia={handleWebcamReady}
              onUserMediaError={handleWebcamError}
            />

            {webcamReady && gameStarted && !gameFinished && (
              <>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 border-4 border-white rounded-full pointer-events-none shadow-lg animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-red-500 rounded-full" />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="success" className="font-black tracking-wide">
                    LIVE
                  </Badge>
                </div>
              </>
            )}
          </div>

          {cameraError && (
            <div className="p-3 border-4 border-destructive bg-destructive/10 shadow-[4px_4px_0px_hsl(var(--destructive))]">
              <p className="text-destructive font-mono font-black uppercase tracking-wide text-sm">
                {cameraError}
              </p>
            </div>
          )}

          {/* Game Controls */}
          <div className="space-y-2">
            {!gameStarted && !isMultiplayer && (
              <Button
                onClick={startGame}
                variant="default"
                size="lg"
                className="w-full"
                disabled={!webcamReady || disabled}
              >
                🚀 START GAME
              </Button>
            )}

            {gameStarted && !gameFinished && (
              <Button
                onClick={captureColor}
                variant="default"
                size="lg"
                className="w-full"
                disabled={isLoading || !webcamReady || disabled}
              >
                {isLoading ? "📸 CAPTURING..." : "📸 CAPTURE COLOR"}
              </Button>
            )}

            {gameFinished && !isMultiplayer && (
              <div className="space-y-2">
                <Button
                  onClick={resetGame}
                  variant="default"
                  size="lg"
                  className="w-full"
                >
                  🔄 PLAY AGAIN
                </Button>
              </div>
            )}
          </div>

          {webcamReady ? (
            <div className="p-2 border-2 border-success bg-success/10">
              <p className="text-success font-mono font-black uppercase tracking-wide text-sm text-center">
                CAMERA READY! POINT THE CROSSHAIR AT THE TARGET COLOR AND
                CAPTURE.
              </p>
            </div>
          ) : (
            <div className="p-2 border-2 border-foreground bg-muted">
              <p className="font-mono font-black uppercase tracking-wide text-sm text-center">
                SETTING UP CAMERA...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
