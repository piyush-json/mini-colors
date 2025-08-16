"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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

  // Results state
  results: GameResults | null;

  // Actions
  setGameMode: (mode: "daily" | "practice") => void;
  setGameType: (type: "upload" | "mixing") => void;
  setResults: (results: GameResults) => void;
  clearResults: () => void;

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
    results,
    setGameMode,
    setGameType: setGameTypeValue,
    setResults: setResultsValue,
    clearResults,
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
