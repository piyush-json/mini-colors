"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Crown, RefreshCw, AlertTriangle } from "lucide-react";
import { useMiniKitUser } from "@/lib/useMiniKitUser";

interface LeaderboardEntry {
  rank: number;
  userName: string;
  score: number;
  isCurrentUser: boolean;
}

interface UserRanking {
  rank: number;
  score: number;
  userName: string;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  userRanking: UserRanking | null;
  date: string;
  total: number;
}

export const LeaderboardScreen = () => {
  const { getUserId, getUserName, isLoading: userLoading } = useMiniKitUser();
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard data
  useEffect(() => {
    if (userLoading) return;

    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userId = getUserId();
        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(
          `/api/leaderboard?date=${today}&userId=${encodeURIComponent(userId)}`,
        );

        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data);
        } else {
          throw new Error("Failed to fetch leaderboard");
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Failed to load leaderboard");
        setLeaderboardData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [getUserId, userLoading]);

  const handleBackToMenu = () => {
    window.location.href = "/";
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">
            {rank}
          </span>
        );
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="w-full flex-1 flex items-center justify-center px-8 py-4">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <h2 className="font-black text-2xl uppercase tracking-tighter mb-2">
            LOADING LEADERBOARD
          </h2>
          <p className="text-gray-600">Fetching rankings...</p>
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
          LEADERBOARD
        </h1>
        <p className="text-sm text-gray-600 tracking-wider font-sintony">
          Daily challenge leaderboard
        </p>
      </div>

      {/* User's Ranking */}
      {leaderboardData?.userRanking && (
        <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Your Daily Ranking
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getRankIcon(leaderboardData.userRanking.rank)}
              <div>
                <div className="font-semibold text-sm text-blue-900">
                  {leaderboardData.userRanking.userName}
                </div>
                <div className="text-xs text-blue-600">
                  Rank #{leaderboardData.userRanking.rank}
                </div>
              </div>
            </div>
            <div className="text-xl font-bold text-blue-900">
              {leaderboardData.userRanking.score}%
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto min-h-0 w-full">
        {!leaderboardData || leaderboardData.leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold mb-2">No Rankings Yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to play today and claim the top spot!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboardData.leaderboard.map((player) => (
              <div
                key={`${player.rank}-${player.userName}`}
                className={`border rounded-lg p-4 transition-colors ${
                  player.isCurrentUser
                    ? "bg-yellow-50 border-yellow-300"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getRankIcon(player.rank)}
                    <div>
                      <div
                        className={`font-semibold text-sm ${
                          player.isCurrentUser
                            ? "text-yellow-800"
                            : "text-black"
                        }`}
                      >
                        {player.userName}
                        {player.isCurrentUser && (
                          <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-xs ${
                          player.isCurrentUser
                            ? "text-yellow-600"
                            : "text-gray-500"
                        }`}
                      >
                        Rank #{player.rank}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      player.isCurrentUser ? "text-yellow-800" : "text-black"
                    }`}
                  >
                    {player.score}%
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
