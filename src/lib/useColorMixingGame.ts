import { useState, useEffect, useCallback, useRef } from "react";
import { ColorMixingSDK, ColorMixingState } from "./mix-sdk";
import { useMiniKitUser } from "./useMiniKitUser";

interface UseColorMixingGameOptions {
  isMultiplayer?: boolean;
  targetColor?: string;
  onScoreSubmit?: (score: number, timeTaken: number) => void;
  autoSubmit?: boolean;
  mode?: "daily" | "practice";
}

export const useColorMixingGame = (options: UseColorMixingGameOptions = {}) => {
  const { getUserId, getUserName } = useMiniKitUser();
  const {
    isMultiplayer = false,
    targetColor,
    onScoreSubmit,
    autoSubmit = false,
    mode = "practice",
  } = options;

  const sdkRef = useRef<ColorMixingSDK | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  if (!sdkRef.current) {
    sdkRef.current = new ColorMixingSDK();
  }

  const sdk = sdkRef.current;

  const [state, setState] = useState<ColorMixingState>(sdk.getState());
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const unsubscribe = sdk.subscribe(setState);
    return unsubscribe;
  }, [sdk]);

  useEffect(() => {
    if (state.isPlaying && !timerRef.current) {
      timerRef.current = setInterval(() => {
        sdk.updateTimer();
      }, 1000);
    } else if (!state.isPlaying && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.isPlaying, sdk]);

  const initializeGame = useCallback(
    (targetColor?: string, isMultiplayer?: boolean) => {
      initializedRef.current = false;

      if (targetColor) {
        sdk.loadChallenge(targetColor);
        initializedRef.current = true;
      } else if (!isMultiplayer) {
        sdk.startChallenge();
        initializedRef.current = true;
      }
    },
    [sdk],
  );

  useEffect(() => {
    if (
      isMultiplayer &&
      autoSubmit &&
      state.showResults &&
      state.lastScore !== null &&
      onScoreSubmit
    ) {
      const timeTaken = state.startTime
        ? Math.floor((Date.now() - state.startTime) / 1000)
        : 0;
      onScoreSubmit(state.lastScore, timeTaken);
    }
  }, [
    isMultiplayer,
    autoSubmit,
    state.showResults,
    state.lastScore,
    state.startTime,
    onScoreSubmit,
  ]);

  const handleSliderChange = useCallback(
    (colorType: "color1" | "color2" | "distractor", value: number) => {
      sdk.updateColorPercentage(colorType, value);
    },
    [sdk],
  );

  const handleShadingChange = useCallback(
    (shadingType: "white" | "black", value: number) => {
      sdk.updateShadingPercentage(shadingType, value);
    },
    [sdk],
  );

  const handleMix = useCallback(async () => {
    console.log("Handling mix...");
    const attempt = sdk.submitMix();

    if (isMultiplayer && onScoreSubmit && attempt) {
      onScoreSubmit(attempt.matchPercentage, attempt.timeTaken);
    }

    // Save attempt to database (only for daily mode)
    if (!isMultiplayer && attempt && mode === "daily") {
      try {
        const userId = getUserId();
        const userName = getUserName();
        const targetColorHex = `#${attempt.targetColor.r.toString(16).padStart(2, "0")}${attempt.targetColor.g.toString(16).padStart(2, "0")}${attempt.targetColor.b.toString(16).padStart(2, "0")}`;
        const mixedColorHex = `#${attempt.mixedColor.r.toString(16).padStart(2, "0")}${attempt.mixedColor.g.toString(16).padStart(2, "0")}${attempt.mixedColor.b.toString(16).padStart(2, "0")}`;

        await fetch("/api/game/attempt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            userName,
            targetColor: targetColorHex,
            capturedColor: mixedColorHex,
            similarity: attempt.matchPercentage,
            timeTaken: attempt.timeTaken,
            timeScore: 0,
            finalScore: attempt.matchPercentage,
            date: new Date().toISOString().split("T")[0],
          }),
        });
      } catch (error) {
        console.error("Failed to save daily mixing attempt:", error);
      }
    }

    return attempt;
  }, [sdk, isMultiplayer, onScoreSubmit, getUserId, getUserName, mode]);

  const handleReset = useCallback(() => {
    sdk.resetChallenge();
  }, [sdk]);

  const handleNewChallenge = useCallback(() => {
    if (!isMultiplayer) {
      sdk.startChallenge();
    }
  }, [sdk, isMultiplayer]);

  const toggleHelp = useCallback(() => {
    setShowHelp((prev) => !prev);
  }, []);

  const targetColorHex = sdk.getTargetColorHex();
  const mixedColorHex = sdk.getMixedColorHex();
  const recentAttempts = sdk.getRecentAttempts(3);
  const stats = sdk.getStats();
  const scoreCategory = state.lastScore
    ? sdk.getScoreCategory(state.lastScore)
    : null;

  const getColorHex = useCallback((r: number, g: number, b: number) => {
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  return {
    state,
    showHelp,

    targetColorHex,
    mixedColorHex,
    recentAttempts,
    stats,
    scoreCategory,

    handleSliderChange,
    handleShadingChange,
    handleMix,
    handleReset,
    handleNewChallenge,
    toggleHelp,
    initializeGame,

    getColorHex,

    sdk,
  };
};
