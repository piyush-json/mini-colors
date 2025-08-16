"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getDailyColorFromDate } from "./utils";

export interface GameResults {
  targetColor: string;
  capturedColor: string;
  similarity: number;
  timeTaken: number;
  mode: "daily" | "practice";
  gameType: "upload" | "mixing";
}

interface GameResultsContextType {
  // Game mode state
  currentMode: "daily" | "practice";
  gameType: "upload" | "mixing";

  // Daily color state
  dailyColor: string | null;
  isLoadingDailyColor: boolean;
  dailyColorError: string | null;

  // Results state
  results: GameResults | null;

  // Actions
  setGameMode: (mode: "daily" | "practice") => void;
  setGameType: (type: "upload" | "mixing") => void;
  setResults: (results: GameResults) => void;
  clearResults: () => void;
  loadDailyColor: () => Promise<void>;
  refreshDailyColor: () => Promise<void>;

  // Navigation
  navigateToResults: () => void;
  navigateToGame: () => void;
  navigateToPractice: () => void;
}

const GameResultsContext = createContext<GameResultsContextType | null>(null);

interface GameResultsProviderProps {
  children: ReactNode;
}

export const GameResultsProvider = ({ children }: GameResultsProviderProps) => {
  const [currentMode, setCurrentMode] = useState<"daily" | "practice">(
    "practice",
  );
  const [gameType, setGameType] = useState<"upload" | "mixing">("upload");
  const [results, setResults] = useState<GameResults | null>(null);

  // Daily color state
  const [dailyColor, setDailyColor] = useState<string | null>(null);
  const [isLoadingDailyColor, setIsLoadingDailyColor] = useState(false);
  const [dailyColorError, setDailyColorError] = useState<string | null>(null);

  const setGameMode = (mode: "daily" | "practice") => {
    setCurrentMode(mode);
  };

  const setGameTypeValue = (type: "upload" | "mixing") => {
    setGameType(type);
  };

  const setResultsValue = (newResults: GameResults) => {
    setResults(newResults);
  };

  const clearResults = () => {
    setResults(null);
  };

  const loadDailyColor = async () => {
    try {
      setIsLoadingDailyColor(true);
      setDailyColorError(null);

      const { color } = getDailyColorFromDate();
      setDailyColor(color);
    } catch (error) {
      console.error("Failed to get daily color:", error);
      setDailyColorError("Failed to load daily color");
    } finally {
      setIsLoadingDailyColor(false);
    }
  };

  const refreshDailyColor = async () => {
    // Force refresh daily color
    await loadDailyColor();
  };

  // Load daily color on mount if not already loaded
  useEffect(() => {
    if (!dailyColor && !isLoadingDailyColor) {
      loadDailyColor();
    }
  }, [dailyColor, isLoadingDailyColor]);

  const navigateToResults = () => {
    // This will be handled by the components checking if results exist
    // No router navigation needed
  };

  const navigateToGame = () => {
    clearResults();
    // Components will automatically show game screen when results are null
  };

  const navigateToPractice = () => {
    clearResults();
    setGameMode("practice");
  };

  const value: GameResultsContextType = {
    currentMode,
    gameType,
    dailyColor,
    isLoadingDailyColor,
    dailyColorError,
    results,
    setGameMode,
    setGameType: setGameTypeValue,
    setResults: setResultsValue,
    clearResults,
    loadDailyColor,
    refreshDailyColor,
    navigateToResults,
    navigateToGame,
    navigateToPractice,
  };

  return (
    <GameResultsContext.Provider value={value}>
      {children}
    </GameResultsContext.Provider>
  );
};

export const useGameResults = (): GameResultsContextType => {
  const context = useContext(GameResultsContext);
  if (!context) {
    throw new Error("useGameResults must be used within a GameResultsProvider");
  }
  return context;
};

export const useGameResultsOptional = (): GameResultsContextType | null => {
  return useContext(GameResultsContext);
};

// Hook specifically for daily color functionality
export const useDailyColor = () => {
  const context = useGameResults();
  return {
    dailyColor: context.dailyColor,
    isLoadingDailyColor: context.isLoadingDailyColor,
    dailyColorError: context.dailyColorError,
    loadDailyColor: context.loadDailyColor,
    refreshDailyColor: context.refreshDailyColor,
  };
};
