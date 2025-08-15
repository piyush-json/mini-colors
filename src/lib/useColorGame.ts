import { useState, useRef, useCallback } from "react";
import { ColorSDK, ColorMatch, GameState } from "./color-sdk";
import Webcam from "react-webcam";

export const useColorGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    targetColor: "",
    startTime: 0,
    score: 0,
    gameHistory: [],
    practiceMode: false,
    dailyMode: false,
    attempts: 0,
    bestScore: 0,
  });

  const [currentColor, setCurrentColor] = useState("");
  const [lastResult, setLastResult] = useState<ColorMatch | null>(null);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webcamReady, setWebcamReady] = useState(false);
  const [dailyColor, setDailyColor] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer management
  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    // timerIntervalRef.current = setInterval(
    //   () => setTimer((prev) => prev + 1),
    //   1000,
    // );
  }, []);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Webcam handlers
  const handleWebcamReady = useCallback(() => {
    setWebcamReady(true);
    setError(null);
  }, []);

  const handleWebcamError = useCallback(
    (error: { name: string; message: string }) => {
      setWebcamReady(false);
      let message = "Camera initialization failed.";

      if (error.name === "NotAllowedError") {
        message =
          "Camera access denied. Please allow camera permissions and refresh the page.";
      } else if (error.name === "NotFoundError") {
        message = "No camera found on this device.";
      } else if (error.name === "NotReadableError") {
        message =
          "Camera is in use by another application. Please close other apps using the camera.";
      } else if (error.name === "OverconstrainedError") {
        message =
          "Camera doesn't support the required resolution. Please try a different camera.";
      } else if (error.name === "SecurityError") {
        message =
          "Camera access blocked for security reasons. Please check your browser settings.";
      }

      setError(message);
    },
    [],
  );

  const startGame = useCallback(() => {
    if (gameState.practiceMode) {
      const newColor = ColorSDK.generateRandomColor();
      setGameState((prev) => ({
        ...prev,
        isPlaying: true,
        targetColor: newColor,
        startTime: Date.now(),
        score: 0,
        attempts: 0,
        bestScore: 0,
      }));
      setCurrentColor("");
      setLastResult(null);
      setTimer(0);
      setError(null);
      setShowResult(false);
      startTimer();
      return;
    }

    if (gameState.dailyMode) {
      if (!dailyColor) {
        setError("Daily color not loaded. Please try again.");
        return;
      }
      setGameState((prev) => ({
        ...prev,
        isPlaying: true,
        targetColor: dailyColor,
        startTime: Date.now(),
        score: 0,
        attempts: prev.attempts + 1,
      }));
      setCurrentColor("");
      setLastResult(null);
      setTimer(0);
      setError(null);
      setShowResult(false);
      startTimer();
      return;
    }

    if (!webcamReady || !webcamRef.current) {
      setError("Camera not ready. Please wait for camera to initialize.");
      return;
    }

    const newColor = ColorSDK.generateRandomColor();
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      targetColor: newColor,
      startTime: Date.now(),
      score: 0,
      attempts: 0,
      bestScore: 0,
    }));
    setCurrentColor("");
    setLastResult(null);
    setTimer(0);
    setError(null);
    setShowResult(false);
    startTimer();
  }, [
    webcamReady,
    gameState.practiceMode,
    gameState.dailyMode,
    dailyColor,
    startTimer,
  ]);

  const endGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPlaying: false }));
    stopTimer();
  }, [stopTimer]);

  const captureColor = useCallback(async () => {
    if (!gameState.isPlaying) return;

    setIsLoading(true);
    setError(null);

    try {
      let capturedColor: string;

      if (gameState.practiceMode) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const targetRgb = ColorSDK.hexToRgb(gameState.targetColor);
        const match = targetRgb.match(/\d+/g);
        if (!match) throw new Error("Invalid target color");

        const [r, g, b] = match.map(Number);
        const variation = 30;
        const capturedR = Math.max(
          0,
          Math.min(255, r + (Math.random() - 0.5) * variation),
        );
        const capturedG = Math.max(
          0,
          Math.min(255, g + (Math.random() - 0.5) * variation),
        );
        const capturedB = Math.max(
          0,
          Math.min(255, b + (Math.random() - 0.5) * variation),
        );
        capturedColor = `rgb(${capturedR}, ${capturedG}, ${capturedB})`;
      } else {
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

        const pixels = [];
        const centerX = Math.floor(video.videoWidth / 2);
        const centerY = Math.floor(video.videoHeight / 2);
        for (let x = centerX - 5; x < centerX + 5; x += 1) {
          for (let y = centerY - 5; y < centerY + 5; y += 1) {
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            pixels.push(pixel);
          }
        }

        const pixel = pixels.reduce(
          (acc, pixel) => ({
            r: acc.r + pixel[0],
            g: acc.g + pixel[1],
            b: acc.b + pixel[2],
          }),
          { r: 0, g: 0, b: 0 },
        );

        capturedColor = `rgb(${pixel.r / pixels.length}, ${pixel.g / pixels.length}, ${pixel.b / pixels.length})`;
      }

      const hexColor = ColorSDK.rgbToHex(capturedColor);
      setCurrentColor(hexColor);

      const result = ColorSDK.calculateScore(
        gameState.targetColor,
        hexColor,
        gameState.startTime,
        Date.now(),
      );

      setLastResult(result);

      // Update best score if this attempt is better
      const newBestScore = Math.max(gameState.bestScore, result.finalScore);

      setGameState((prev) => ({
        ...prev,
        score: result.finalScore,
        gameHistory: [...prev.gameHistory, result],
        bestScore: newBestScore,
      }));

      // Show result for a moment before allowing another attempt
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        endGame();
      }, 3000);

      // If it's daily mode, save to database (which will auto-submit to leaderboard)
      if (gameState.dailyMode) {
        try {
          // First, save the game attempt to get an attemptId
          const attemptResponse = await fetch("/api/game/attempt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              gameMode: "daily",
              targetColor: gameState.targetColor,
              capturedColor: hexColor,
              similarity: result.similarity,
              timeTaken: result.timeTaken / 1000, // Convert to seconds
              timeScore: result.timeScore,
              finalScore: result.finalScore,
              date: new Date().toISOString().split("T")[0],
            }),
          });

          if (attemptResponse.ok) {
            const attemptData = await attemptResponse.json();

            // Update daily stats with the attemptId (this will auto-submit to leaderboard if new best)
            await fetch("/api/daily/stats", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                score: result.finalScore,
                date: new Date().toISOString().split("T")[0],
                timeTaken: result.timeTaken / 1000,
                attemptId: attemptData.attemptId,
              }),
            });
          }
        } catch (error) {
          console.error("Failed to save game attempt:", error);
        }
      }
    } catch (error) {
      console.error("Error capturing color:", error);
      setError("Failed to capture color. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [
    gameState.isPlaying,
    gameState.targetColor,
    gameState.startTime,
    gameState.practiceMode,
    gameState.dailyMode,
    gameState.bestScore,
    endGame,
  ]);

  const resetGame = useCallback(() => {
    setGameState({
      isPlaying: false,
      targetColor: "",
      startTime: 0,
      score: 0,
      gameHistory: [],
      practiceMode: false,
      dailyMode: false,
      attempts: 0,
      bestScore: 0,
    });
    setCurrentColor("");
    setLastResult(null);
    setTimer(0);
    setError(null);
    setShowResult(false);
    stopTimer();
  }, [stopTimer]);

  const setNewTargetColor = useCallback((color: string) => {
    setGameState((prev) => ({
      ...prev,
      targetColor: color,
      practiceMode: true,
    }));
  }, []);

  const startDailyMode = useCallback(async () => {
    try {
      const response = await fetch("/api/daily");
      const data = await response.json();

      if (data.color) {
        setDailyColor(data.color);
        setGameState((prev) => ({
          ...prev,
          dailyMode: true,
          practiceMode: false,
          targetColor: data.color,
          attempts: 0,
          bestScore: 0,
        }));
      } else {
        setError("Failed to load daily color");
      }
    } catch {
      setError("Failed to load daily color");
    }
  }, []);

  // Computed values
  const getAverageScore = useCallback(() => {
    if (gameState.gameHistory.length === 0) return 0;
    const total = gameState.gameHistory.reduce(
      (sum, result) => sum + result.finalScore,
      0,
    );
    return Math.round(total / gameState.gameHistory.length);
  }, [gameState.gameHistory]);

  const getBestScore = useCallback(() => {
    if (gameState.gameHistory.length === 0) return 0;
    return Math.max(
      ...gameState.gameHistory.map((result) => result.finalScore),
    );
  }, [gameState.gameHistory]);

  const getWorstScore = useCallback(() => {
    if (gameState.gameHistory.length === 0) return 0;
    return Math.min(
      ...gameState.gameHistory.map((result) => result.finalScore),
    );
  }, [gameState.gameHistory]);

  const getTotalGames = useCallback(
    () => gameState.gameHistory.length,
    [gameState.gameHistory],
  );

  const getTotalPlayTime = useCallback(() => {
    return gameState.gameHistory.reduce(
      (total, result) => total + result.timeTaken,
      0,
    );
  }, [gameState.gameHistory]);

  return {
    gameState,
    currentColor,
    lastResult,
    timer,
    isLoading,
    error,
    webcamReady,
    webcamRef,
    canvasRef,
    startGame,
    endGame,
    captureColor,
    resetGame,
    handleWebcamReady,
    handleWebcamError,
    setNewTargetColor,
    startDailyMode,
    showResult,
    dailyColor,
    getAverageScore,
    getBestScore,
    getWorstScore,
    getTotalGames,
    getTotalPlayTime,
  };
};
