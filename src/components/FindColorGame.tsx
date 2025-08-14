import { useState, useEffect, useRef, useCallback } from "react";
import {
  RetroButton,
  RetroCard,
  RetroColorSwatch,
  RetroSpinner,
} from "./RetroUI";
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
      <RetroCard title="🎯 Target Color">
        <div className="text-center space-y-4">
          <RetroColorSwatch
            color={targetColor}
            size="lg"
            showHex
            className="mx-auto"
          />
          <p className="text-sm text-gray-600">
            Find this color in your surroundings and capture it!
          </p>

          {gameStarted && !gameFinished && (
            <div className="text-lg font-mono font-bold">Time: {timer}s</div>
          )}

          {lastScore !== null && (
            <div className="text-xl font-bold text-green-600">
              Score: {lastScore}%
            </div>
          )}
        </div>
      </RetroCard>

      {/* Camera View */}
      <RetroCard title="📷 Camera View">
        <div className="space-y-4">
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className={`w-full h-64 object-cover rounded-lg border-2 ${
                webcamReady ? "border-green-500" : "border-gray-300 opacity-50"
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
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  LIVE
                </div>
              </>
            )}
          </div>

          {cameraError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {cameraError}
            </div>
          )}

          {/* Game Controls */}
          <div className="space-y-2">
            {!gameStarted && !isMultiplayer && (
              <RetroButton
                onClick={startGame}
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!webcamReady || disabled}
              >
                🚀 Start Game
              </RetroButton>
            )}

            {gameStarted && !gameFinished && (
              <RetroButton
                onClick={captureColor}
                variant="success"
                size="lg"
                className="w-full"
                disabled={isLoading || !webcamReady || disabled}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <RetroSpinner className="mr-2" />
                    Capturing...
                  </span>
                ) : (
                  "📸 CAPTURE COLOR"
                )}
              </RetroButton>
            )}

            {gameFinished && !isMultiplayer && (
              <div className="space-y-2">
                <RetroButton
                  onClick={resetGame}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  🔄 Play Again
                </RetroButton>
              </div>
            )}
          </div>

          {webcamReady ? (
            <p className="text-sm text-green-600 font-medium text-center">
              Camera Ready! Point the crosshair at the target color and capture.
            </p>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              Setting up camera...
            </p>
          )}
        </div>
      </RetroCard>
    </div>
  );
};
