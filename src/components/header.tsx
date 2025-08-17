"use client";

import { Clock, Fire } from "@/components/icons";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGameContext } from "@/lib/GameContext";
import { useGameResults } from "@/lib/GameResultsContext";
import { useEffect } from "react";

export const BackButton = () => {
  return (
    <div
      className="w-[41px] h-[41px] bg-white border border-black rounded-[5px] flex items-center justify-center"
      style={{ boxShadow: "0px 1.5px 0px 0px rgba(0, 0, 0, 1)" }}
    >
      <ChevronLeft className="w-6 h-6 text-black" />
    </div>
  );
};

export const GameTimer = () => {
  const gameContext = useGameContext();
  const timer = gameContext?.timer || 0;

  // Format timer as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (timer <= 0) return null;

  return (
    <div
      className="w-[41px] h-[41px] bg-white border border-black rounded-[5px] flex items-center justify-center"
      style={{ boxShadow: "0px 1.5px 0px 0px rgba(0, 0, 0, 1)" }}
    >
      <span className="font-sintony text-xs font-bold text-black">
        {formatTime(timer)}
      </span>
    </div>
  );
};

export const HistoryButton = () => {
  return (
    <Link
      href="/history"
      className="w-[41px] h-[41px] bg-white border border-black rounded-[5px] flex items-center justify-center"
      style={{ boxShadow: "0px 1.5px 0px 0px rgba(0, 0, 0, 1)" }}
    >
      <Clock />
    </Link>
  );
};

export const UserProfile = () => {
  return (
    <div className="bg-transparent border border-black rounded-[7px] px-1  h-[41px] flex gap-2 items-center">
      <div className="w-[31px] h-[31px] bg-[#EEBDBD] border border-black rounded-[3px] flex items-center justify-center">
        {/* Profile image placeholder */}
      </div>
      <span className="text-[12px] leading-4 text-center text-black font-normal font-sintony">
        0x8h...9e3
      </span>
    </div>
  );
};

export const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const showTimer = pathname === "/game" || pathname === "/results";
  const gameContext = useGameContext();
  const { clearResults } = useGameResults();

  // Reset game state when navigating to home page
  useEffect(() => {
    if (isHomePage) {
      // Reset all game state when user goes back to home
      if (gameContext) {
        // Reset timer and game state
        gameContext.updateTimer(0);
        gameContext.stopTimer();
        gameContext.resetFindColorGame();
      }
      // Clear any results
      clearResults();
    }
  }, [isHomePage, gameContext, clearResults]);

  return (
    <div className="flex justify-between items-center border-b-2 border-black pb-5 pt-7 w-full">
      {isHomePage ? (
        <Fire />
      ) : (
        <Link href="/" className="flex items-center">
          <BackButton />
        </Link>
      )}
      <div className="flex items-center gap-1">
        {showTimer && <GameTimer />}
        <HistoryButton />
        <UserProfile />
      </div>
    </div>
  );
};
