"use client";

import { useState, useEffect } from "react";
import {
  Gamepad2,
  RefreshCw,
  AlertTriangle,
  Trophy,
  Target,
  Clock,
} from "lucide-react";
import { useMiniKitUser } from "@/lib/useMiniKitUser";

interface GameHistory {
  id: string;
  score: number;
  timeTaken: number;
  targetColor: string;
  capturedColor: string;
  similarity: number;
  date: string;
  gameMode: string;
}

interface HistoryStats {
  totalGames: number;
  bestScore: number;
  averageScore: number;
}

export const GameHistoryScreen = () => {
  const { getUserId, getUserName, isLoading: userLoading } = useMiniKitUser();
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = getUserId();
  const userName = getUserName();

  // Fetch game history and stats
  useEffect(() => {
    if (userLoading) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/game/history?userId=${encodeURIComponent(userId)}`,
        );
        if (response.ok) {
          const data = (await response.json()) as any;
          setGameHistory(data.history || []);
          setStats(
            data.stats || {
              totalGames: 0,
              bestScore: 0,
              averageScore: 0,
            },
          );
        } else {
          throw new Error("Failed to fetch game history");
        }
      } catch (err) {
        console.error("Failed to fetch game history:", err);
        setError("Failed to load game history");
        setGameHistory([]);
        setStats({
          totalGames: 0,
          bestScore: 0,
          averageScore: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId, userLoading]);

  const handleBackToMenu = () => {
    window.location.href = "/";
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (userLoading || isLoading) {
    return (
      <div className="w-full mx-auto flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <h2 className="font-hartone text-xl uppercase tracking-wide mb-2 text-black">
            LOADING HISTORY
          </h2>
          <p className="text-sm text-gray-600 tracking-wider font-sintony">
            Fetching your game data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex-1 flex items-center justify-center px-8 py-4">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h2 className="font-black text-2xl uppercase tracking-tighter mb-2">
            ERROR
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 border border-black rounded hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 grow">
      {/* Header */}
      <div className="text-center flex flex-col gap-2">
        <h1 className="font-hartone text-[39px] uppercase tracking-wide font-normal text-black leading-[42px]">
          HISTORY
        </h1>
        <p className="text-sm text-black tracking-[7.5%] font-sintony">
          Check all your past submissions here
        </p>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="w-full border border-black rounded-[5px] bg-white p-2 shadow-[0px_1.5px_0px_0px_rgba(0,0,0,1)]">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <p className="font-bold text-lg text-black font-sintony">
                {stats.totalGames}
              </p>
              <div className="text-xs text-gray-600">Total Games</div>
            </div>
            <div className="flex flex-col items-center">
              <p className="font-bold text-lg text-black font-sintony">
                {stats.bestScore}%
              </p>
              <div className="text-xs text-gray-600">Best Score</div>
            </div>
            <div className="flex flex-col items-center">
              <p className="font-bold text-lg text-black font-sintony">
                {stats.averageScore.toFixed(0)}%
              </p>
              <div className="text-xs text-gray-600">Average Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Game History List */}
      <div className="flex-1 overflow-y-auto min-h-0 w-full">
        {gameHistory.length === 0 ? (
          <div className="text-center py-8">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-black" />
            <h3 className="text-xl font-hartone mb-2 text-black font-extralight">
              No Games Yet
            </h3>
            <p className="text-gray-600 mb-4 font-sintony">
              Start playing to build up your game history!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {gameHistory.map((game, index) => (
              <div key={game.id} className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Color Comparison */}
                    <div className="flex items-center gap-0 w-[90px] h-[64px] relative">
                      {/* Target Color (Background) */}
                      <div
                        className="absolute right-0 w-[64px] h-[64px] border-2 rotate-3 border-[#FFFFE7] rounded-[3px]"
                        style={{
                          backgroundColor: game.capturedColor || "#303C76",
                          rotate: "3deg",
                        }}
                      />
                      <div
                        className="absolute left-0 w-[58px] h-[58px] border-2 -rotate-3 border-[#FFFFE7] rounded-[3px] mt-1"
                        style={{
                          backgroundColor: game.targetColor || "#FF8B8B",
                          rotate: "-3deg",
                        }}
                      />
                    </div>

                    {/* Game Info */}
                    <div className="flex flex-col gap-1 w-[138px]">
                      <div className="font-sintony font-bold text-sm text-black tracking-[7.5%]">
                        {game.gameMode === "color-mixing"
                          ? "Mix the colours"
                          : "Upload the image"}
                      </div>
                      <div className="font-sintony text-xs text-[#616060] tracking-[7.5%]">
                        {new Date(game.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="font-hartone text-[26px] font-normal text-black leading-[42px]">
                      {game.score}%
                    </div>
                  </div>
                </div>

                {/* Divider line after each item except the last */}
                {index < gameHistory.length - 1 && (
                  <div className="w-full h-[2px] bg-black"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
