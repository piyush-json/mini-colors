// Hook for Color Mixing Game functionality

import { useState, useEffect, useCallback, useRef } from "react";
import { ColorMixingSDK, ColorMixingState } from "./mix-sdk";

interface UseColorMixingGameOptions {
  isMultiplayer?: boolean;
  targetColor?: string; // Hex color for multiplayer mode
  onScoreSubmit?: (score: number, timeTaken: number) => void;
  autoSubmit?: boolean; // Auto submit when mixed for multiplayer
}

export const useColorMixingGame = (options: UseColorMixingGameOptions = {}) => {
  const {
    isMultiplayer = false,
    targetColor,
    onScoreSubmit,
    autoSubmit = false,
  } = options;

  // Create SDK instance
  const sdkRef = useRef<ColorMixingSDK | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  // Initialize SDK
  if (!sdkRef.current) {
    sdkRef.current = new ColorMixingSDK();
  }

  const sdk = sdkRef.current;

  // State from SDK
  const [state, setState] = useState<ColorMixingState>(sdk.getState());
  const [showHelp, setShowHelp] = useState(false);

  // Subscribe to SDK state changes
  useEffect(() => {
    const unsubscribe = sdk.subscribe(setState);
    return unsubscribe;
  }, [sdk]);

  // Setup timer
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

  // Initialize challenge only once
  useEffect(() => {
    if (initializedRef.current) return;

    if (isMultiplayer && targetColor) {
      sdk.loadChallenge(targetColor);
      initializedRef.current = true;
    } else if (!isMultiplayer) {
      sdk.startChallenge();
      initializedRef.current = true;
    }
  }, [isMultiplayer, targetColor, sdk]);

  // Auto-submit in multiplayer mode when results are shown
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

  // Action handlers
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

  const handleMix = useCallback(() => {
    const attempt = sdk.submitMix();

    // In multiplayer mode, submit score to server
    if (isMultiplayer && onScoreSubmit && attempt) {
      onScoreSubmit(attempt.matchPercentage, attempt.timeTaken);
    }

    return attempt;
  }, [sdk, isMultiplayer, onScoreSubmit]);

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

  // Computed values
  const targetColorHex = sdk.getTargetColorHex();
  const mixedColorHex = sdk.getMixedColorHex();
  const recentAttempts = sdk.getRecentAttempts(3);
  const stats = sdk.getStats();
  const scoreCategory = state.lastScore
    ? sdk.getScoreCategory(state.lastScore)
    : null;

  // Helper functions
  const getColorHex = useCallback((r: number, g: number, b: number) => {
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  return {
    // State
    state,
    showHelp,

    // Computed values
    targetColorHex,
    mixedColorHex,
    recentAttempts,
    stats,
    scoreCategory,

    // Actions
    handleSliderChange,
    handleShadingChange,
    handleMix,
    handleReset,
    handleNewChallenge,
    toggleHelp,

    // Utilities
    getColorHex,

    // SDK reference for advanced usage
    sdk,
  };
};
