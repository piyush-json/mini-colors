import { useState, useRef, useCallback, useEffect } from "react";
import { ColorSDK, ColorMatch, GameState } from "./color-sdk";
import { useMiniKitUser } from "./useMiniKitUser";
import Webcam from "react-webcam";

export interface UseColorGameReturn {
  // Core game state
  gameState: GameState;
  timer: number;
  isLoading: boolean;
  error: string | null;
  webcamReady: boolean;
  webcamRef: React.RefObject<Webcam>;
  canvasRef: React.RefObject<HTMLCanvasElement>;

  // Find Color Game specific state
  gameFinished: boolean;
  capturedImage: string | null;
  capturedColor: string | null;
  gameStage: "initial" | "camera" | "captured";
  cameraError: string | null;

  // Game mode management
  currentMode: "daily" | "practice";
  isLoadingDailyColor: boolean;
  dailyColor: string | null;

  // Find Color Game methods
  initializeGame: (targetColor: string, isMultiplayer?: boolean) => void;
  openCamera: () => void;
  captureColorPhoto: () => void;
  retakePhoto: () => void;
  submitResult: (
    onScoreSubmit: (
      score: number,
      timeTaken: number,
      actualTargetColor?: string,
      actualCapturedColor?: string,
    ) => void,
    mode?: "daily" | "practice",
  ) => void;
  resetFindColorGame: () => void;
  handleWebcamReady: () => void;
  handleWebcamError: (error: string | DOMException) => void;

  // Mode management methods
  setDailyMode: () => void;
  setPracticeMode: () => void;
  loadDailyColor: () => Promise<void>;
  generateNewPracticeColor: () => void;

  // Timer management
  startTimer: () => void;
  stopTimer: () => void;
  updateTimer: (newTime: number) => void;
}

interface UseColorGameOptions {
  initialMode?: "daily" | "practice";
}

export const useColorGame = (
  options?: UseColorGameOptions,
): UseColorGameReturn => {
  const initialMode = options?.initialMode || "practice";
  const { getUserId, getUserName } = useMiniKitUser();

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    targetColor:
      initialMode === "practice" ? ColorSDK.getRandomPracticeColor() : "",
    startTime: 0,
    score: 0,
    gameHistory: [],
    practiceMode: initialMode === "practice",
    dailyMode: initialMode === "daily",
    attempts: 0,
    bestScore: 0,
    gameMode: initialMode,
  });

  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webcamReady, setWebcamReady] = useState(false);

  // Game mode specific state
  const [currentMode, setCurrentMode] = useState<"daily" | "practice">(
    initialMode,
  );
  const [isLoadingDailyColor, setIsLoadingDailyColor] = useState(false);
  const [dailyColor, setDailyColor] = useState<string | null>(null);

  // Find Color Game specific state
  const [gameFinished, setGameFinished] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedColor, setCapturedColor] = useState<string | null>(null);
  const [gameStage, setGameStage] = useState<"initial" | "camera" | "captured">(
    "initial",
  );
  const [cameraError, setCameraError] = useState<string | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer management - Updated to actually work
  useEffect(() => {
    if (gameState.isPlaying && !gameFinished) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [gameState.isPlaying, gameFinished]);

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimer(0);
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

  // Find Color Game specific methods
  const initializeGame = useCallback(
    (targetColor: string, isMultiplayer = false) => {
      setGameState((prev) => ({
        ...prev,
        targetColor,
        isPlaying: false,
        startTime: 0,
        score: 0,
      }));

      if (isMultiplayer) {
        setGameStage("camera");
        setGameState((prev) => ({
          ...prev,
          isPlaying: true,
          startTime: Date.now(),
        }));
        setTimer(0);
        setGameFinished(false);
        startTimer();
      } else {
        setGameStage("initial");
      }
    },
    [startTimer],
  );

  const openCamera = useCallback(() => {
    setGameStage("camera");
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      startTime: Date.now(),
    }));
    setTimer(0);
    setGameFinished(false);
    startTimer();
  }, [startTimer]);

  const captureColorPhoto = useCallback(async () => {
    if (!gameState.isPlaying || gameFinished || isLoading) return;

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

      // Capture the screenshot
      const screenshot = webcamRef.current.getScreenshot();
      setCapturedImage(screenshot);
      setGameStage("captured");
    } catch (error) {
      console.error("Color capture failed:", error);
      setCameraError("Failed to capture color. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [gameState.isPlaying, gameFinished, isLoading]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setGameStage("camera");
  }, []);

  const submitResult = useCallback(
    async (
      onScoreSubmit: (
        score: number,
        timeTaken: number,
        actualTargetColor?: string,
        actualCapturedColor?: string,
      ) => void,
      mode?: "daily" | "practice",
    ) => {
      if (!capturedImage) return;

      try {
        setIsLoading(true);
        const img = new globalThis.Image();
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!canvas || !ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Get color from center
          const centerX = Math.floor(canvas.width / 2);
          const centerY = Math.floor(canvas.height / 2);
          const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;
          const capturedColorRGB = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

          // Store the captured color
          setCapturedColor(capturedColorRGB);

          // Calculate score using ColorSDK
          const result = ColorSDK.calculateScore(
            gameState.targetColor,
            capturedColorRGB,
            gameState.startTime,
            Date.now(),
          );
          const score = Math.round(result.finalScore);
          const timeTakenMs = timer * 1000;

          setGameFinished(true);
          setGameState((prev) => ({ ...prev, score }));
          stopTimer();

          // Submit to API if in daily mode
          if (mode === "daily") {
            try {
              const userId = getUserId();
              const userName = getUserName();

              await fetch("/api/game/attempt", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId,
                  userName,
                  targetColor: gameState.targetColor,
                  capturedColor: capturedColorRGB,
                  similarity: result.similarity, // Send similarity percentage
                  timeTaken: timer, // Send time in seconds
                  timeScore: 0, // Will be calculated on server
                  date: new Date().toISOString().split("T")[0],
                  gameType: "finding",
                }),
              });
            } catch (error) {
              console.error("Failed to save daily finding attempt:", error);
            }
          }

          onScoreSubmit(
            score,
            timeTakenMs,
            gameState.targetColor,
            capturedColorRGB,
          );
          setIsLoading(false);
        };
        img.src = capturedImage;
      } catch (error) {
        console.error("Submit failed:", error);
        setIsLoading(false);
      }
    },
    [
      capturedImage,
      gameState.targetColor,
      gameState.startTime,
      timer,
      stopTimer,
      getUserId,
      getUserName,
    ],
  );

  const resetFindColorGame = useCallback(() => {
    setGameFinished(false);
    setTimer(0);
    setCapturedImage(null);
    setCapturedColor(null);
    setGameStage("initial");
    setCameraError(null);
    setError(null);
    stopTimer();
  }, [stopTimer]);

  // Fix existing method signatures
  const handleWebcamErrorFixed = useCallback((error: string | DOMException) => {
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

  const setNewTargetColorFixed = useCallback(() => {
    const colors = [
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#00FFFF",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setGameState((prev) => ({ ...prev, targetColor: randomColor }));
  }, []);

  // Mode management methods
  const setDailyMode = useCallback(() => {
    setCurrentMode("daily");
    setGameState((prev) => ({
      ...prev,
      gameMode: "daily",
      dailyMode: true,
      practiceMode: false,
    }));
  }, []);

  const setPracticeMode = useCallback(() => {
    setCurrentMode("practice");
    setGameState((prev) => ({
      ...prev,
      gameMode: "practice",
      dailyMode: false,
      practiceMode: true,
    }));
  }, []);

  const loadDailyColor = useCallback(async () => {
    try {
      setIsLoadingDailyColor(true);
      setError(null);
      const response = await ColorSDK.fetchDailyColor();
      setDailyColor(response.color);
      setGameState((prev) => ({ ...prev, targetColor: response.color }));
    } catch (error) {
      console.error("Failed to fetch daily color:", error);
      setError("Failed to load daily color");
    } finally {
      setIsLoadingDailyColor(false);
    }
  }, []);

  const generateNewPracticeColor = useCallback(() => {
    const newColor = ColorSDK.getRandomPracticeColor();
    setGameState((prev) => ({ ...prev, targetColor: newColor }));
  }, []);

  // Initialize with daily mode by default
  useEffect(() => {
    if (currentMode === "daily" && !dailyColor) {
      loadDailyColor();
    }
  }, [currentMode, dailyColor, loadDailyColor]);

  return {
    // Core game state
    gameState,
    timer,
    isLoading,
    error,
    webcamReady,
    webcamRef,
    canvasRef,

    // Find Color Game specific state
    gameFinished,
    capturedImage,
    capturedColor,
    gameStage,
    cameraError,

    // Game mode management
    currentMode,
    isLoadingDailyColor,
    dailyColor,

    // Find Color Game methods
    initializeGame,
    openCamera,
    captureColorPhoto,
    retakePhoto,
    submitResult,
    resetFindColorGame,

    // Webcam handlers
    handleWebcamReady,
    handleWebcamError,

    // Mode management methods
    setDailyMode,
    setPracticeMode,
    loadDailyColor,
    generateNewPracticeColor,

    // Timer management
    startTimer,
    stopTimer,
    updateTimer: setTimer,
  };
};
