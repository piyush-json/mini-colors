"use client";

import React, { createContext, useContext } from "react";
import { useColorGame, UseColorGameReturn } from "./useColorGame";

const GameContext = createContext<UseColorGameReturn | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const gameHook = useColorGame();

  return (
    <GameContext.Provider value={gameHook}>{children}</GameContext.Provider>
  );
};

export const useGameContext = (): UseColorGameReturn | null => {
  const context = useContext(GameContext);
  return context;
};

export const useGameContextRequired = (): UseColorGameReturn => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error(
      "useGameContextRequired must be used within a GameProvider",
    );
  }
  return context;
};
