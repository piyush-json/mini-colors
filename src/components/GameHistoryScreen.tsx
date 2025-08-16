"use client";

import { useState, useEffect } from "react";
import { Gamepad2, RefreshCw, AlertTriangle } from "lucide-react";

interface GameHistory {
  id: string;
  sessionId: string;
  score: number;
  timeTaken: number;
  targetColor: string;
  capturedColor: string;
  similarity: number;
  createdAt: string;
  gameMode: string;
}

interface HistoryStats {
  totalGames: number;
  averageScore: number;
  averageTime: number;
  highScores: number;
}

export const GameHistoryScreen = () => {
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch game history and stats
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/game/history");
        if (response.ok) {
          const data = await response.json();
          setGameHistory(data.history || []);
          setStats(
            data.stats || {
              totalGames: 0,
              averageScore: 0,
              averageTime: 0,
              highScores: 0,
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
          averageScore: 0,
          averageTime: 0,
          highScores: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Sort game history by date (most recent first)
  const sortedHistory = [...gameHistory].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleBackToMenu = () => {
    window.location.href = "/";
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (isLoading) {
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
          Check all your past submissions here
        </p>
      </div>

      {stats && (
        <div className="w-full rounded-lg p-2 border border-black">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="font-bold text-sm text-black font-sintony">
                {stats.totalGames}
              </div>
              <div className="text-xs text-gray-600">Games</div>
            </div>
            <div>
              <div className="font-bold text-sm text-black font-sintony">
                {stats.averageScore.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Avg Score</div>
            </div>
            <div>
              <div className="font-bold text-sm text-black font-sintony">
                {(stats.averageTime / 1000).toFixed(0)}s
              </div>
              <div className="text-xs text-gray-600">Avg Time</div>
            </div>
            <div>
              <div className="font-bold text-sm text-black font-sintony">
                {stats.highScores}
              </div>
              <div className="text-xs text-gray-600">High 80%+</div>
            </div>
          </div>
        </div>
      )}

      {/* Game History List */}
      <div className="flex-1 overflow-y-auto min-h-0 w-full">
        {sortedHistory.length === 0 ? (
          <div className="text-center py-8">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold mb-2">No Games Yet</h3>
            <p className="text-gray-600 mb-4">
              Start playing to build up your game history!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {sortedHistory.map((game, index) => (
              <div key={game.id} className="border-b border-black pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Colors Display */}
                    <div className="relative">
                      {/* Target Color */}
                      <div
                        className="w-16 h-16 border-2 border-yellow-300 rounded transform rotate-12"
                        style={{ backgroundColor: game.targetColor }}
                      />
                      {/* Captured Color */}
                      <div
                        className="w-14 h-14 border-2 border-yellow-300 rounded absolute top-1 left-0 transform -rotate-6"
                        style={{ backgroundColor: game.capturedColor }}
                      />
                    </div>

                    {/* Game Info */}
                    <div className="flex flex-col gap-1">
                      <div className="font-bold text-sm text-black">
                        {game.gameMode === "daily"
                          ? "Upload the image"
                          : game.gameMode === "mixing"
                            ? "Mix the colours"
                            : game.gameMode}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(game.createdAt).toLocaleDateString("en-GB")}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-2xl font-black text-black">
                      {game.score}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
