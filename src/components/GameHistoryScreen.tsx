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

  // Fetch game history and stats
  useEffect(() => {
    if (userLoading) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const userId = getUserId();
        const response = await fetch(
          `/api/game/history?userId=${encodeURIComponent(userId)}`,
        );
        if (response.ok) {
          const data = await response.json();
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
  }, [getUserId, userLoading]);

  const handleBackToMenu = () => {
    window.location.href = "/";
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (userLoading || isLoading) {
    return (
      <div className="w-full flex-1 flex items-center justify-center px-8 py-4">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <h2 className="font-black text-2xl uppercase tracking-tighter mb-2">
            LOADING HISTORY
          </h2>
          <p className="text-gray-600">Fetching your game data...</p>
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
    <div className="w-full flex flex-col items-center gap-4 grow pb-6">
      {/* Header */}
      <div className="text-center flex flex-col">
        <h1 className="font-hartone text-4xl uppercase tracking-wide font-light text-black">
          HISTORY
        </h1>
        <p className="text-sm text-gray-600 tracking-wider font-sintony">
          Your recent game performance
        </p>
      </div>

      {/* Light Stats */}
      {stats && (
        <div className="w-full rounded-lg p-4 border border-black bg-gray-50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Gamepad2 className="w-5 h-5 text-blue-600 mb-1" />
              <div className="font-bold text-lg text-black font-sintony">
                {stats.totalGames}
              </div>
              <div className="text-xs text-gray-600">Total Games</div>
            </div>
            <div className="flex flex-col items-center">
              <Trophy className="w-5 h-5 text-yellow-600 mb-1" />
              <div className="font-bold text-lg text-black font-sintony">
                {stats.bestScore}%
              </div>
              <div className="text-xs text-gray-600">Best Score</div>
            </div>
            <div className="flex flex-col items-center">
              <Target className="w-5 h-5 text-green-600 mb-1" />
              <div className="font-bold text-lg text-black font-sintony">
                {stats.averageScore.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Average Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Game History List */}
      <div className="flex-1 overflow-y-auto min-h-0 w-full">
        {gameHistory.length === 0 ? (
          <div className="text-center py-8">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold mb-2">No Games Yet</h3>
            <p className="text-gray-600 mb-4">
              Start playing to build up your game history!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {gameHistory.map((game, index) => (
              <div
                key={game.id}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Target Color Display */}
                    <div className="relative">
                      <div
                        className="w-12 h-12 border-2 border-gray-300 rounded-lg shadow-sm"
                        style={{ backgroundColor: game.targetColor }}
                      />
                    </div>

                    {/* Game Info */}
                    <div className="flex flex-col gap-1">
                      <div className="font-semibold text-sm text-black capitalize">
                        {game.gameMode} Mode
                      </div>
                      <div className="text-xs text-gray-500">{game.date}</div>
                      <div className="text-xs text-gray-500">
                        {(game.timeTaken / 1000).toFixed(1)}s •{" "}
                        {game.similarity.toFixed(1)}% similarity
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-black">
                      {game.score}%
                    </div>
                    {game.score >= 80 && (
                      <div className="text-xs text-green-600 font-medium">
                        Great!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to Menu Button */}
      <div className="w-full pt-4">
        <button
          onClick={handleBackToMenu}
          className="w-full py-3 border border-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};
