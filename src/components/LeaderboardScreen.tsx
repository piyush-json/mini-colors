"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Crown, RefreshCw, AlertTriangle } from "lucide-react";
import { useMiniKitUser } from "@/lib/useMiniKitUser";
import { Rank1, Rank2, Rank3 } from "./icons";

interface LeaderboardEntry {
  rank: string;
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
  const { getUserId, isLoading: userLoading } = useMiniKitUser();
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<
    "all" | "color-mixing" | "finding"
  >("all");

  // Get user ID value to use in dependency array
  const userId = getUserId();

  // Fetch leaderboard data
  useEffect(() => {
    if (userLoading) return;

    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(
          `/api/leaderboard?date=${today}&userId=${encodeURIComponent(userId)}&gameType=${selectedGameType}`,
        );

        if (response.ok) {
          const data = (await response.json()) as LeaderboardData;
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
  }, [userId, userLoading, selectedGameType]);

  const handleBackToMenu = () => {
    window.location.href = "/";
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case "1":
        return (
          <div className="w-[50px] h-[50px] bg-white border-r border-black rounded-[5px]  flex items-center justify-center">
            <Rank1 />
          </div>
        );
      case "2":
        return (
          <div className="w-[50px] h-[50px] bg-white border-r border-black rounded-[5px]  flex items-center justify-center">
            <Rank2 />
          </div>
        );
      case "3":
        return (
          <div className="w-[50px] h-[50px] bg-white border-r border-black rounded-[5px]  flex items-center justify-center">
            <Rank3 />
          </div>
        );
      default:
        return (
          <div className="w-[50px] h-[50px] bg-white border-r border-black rounded-[5px]  flex items-center justify-center">
            <div className="w-[23px] h-[23px] rounded-full bg-black/10 flex items-center justify-center">
              <p className="text-[10px] font-hartone text-black opacity-45">
                {rank}
              </p>
            </div>
          </div>
        );
    }
  };

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
    <div className="w-full h-full bg-[#FFFFE7] flex flex-col">
      {/* Header */}
      <h1 className="font-hartone text-[39.2px] uppercase tracking-wide font-normal text-black leading-[42px] text-center w-full mb-4">
        LEADERBOARD
      </h1>

      {/* Tab Navigation */}
      <div className="w-full border-b border-[#DEDEC9]">
        <div className="flex">
          <button
            onClick={() => setSelectedGameType("all")}
            className={`flex-1 py-[10px] ${selectedGameType === "all" ? "border-b border-black" : ""}`}
          >
            <span
              className={`font-hartone font-extralight text-[16px] tracking-[7.5%] ${selectedGameType === "all" ? "text-black" : "text-[#A8A8A8]"}`}
            >
              All
            </span>
          </button>
          <button
            onClick={() => setSelectedGameType("color-mixing")}
            className={`flex-1 py-[10px] ${selectedGameType === "color-mixing" ? "border-b border-black" : ""}`}
          >
            <span
              className={`font-hartone font-extralight text-[16px] tracking-[7.5%] ${selectedGameType === "color-mixing" ? "text-black" : "text-[#A8A8A8]"}`}
            >
              Color mixing
            </span>
          </button>
          <button
            onClick={() => setSelectedGameType("finding")}
            className={`flex-1 py-[10px] ${selectedGameType === "finding" ? "border-b border-black" : ""}`}
          >
            <span
              className={`font-hartone font-extralight text-[16px] tracking-[7.5%] ${selectedGameType === "finding" ? "text-black" : "text-[#A8A8A8]"}`}
            >
              Finding colors
            </span>
          </button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className=" overflow-y-auto w-full pt-[16px]">
        {userLoading || isLoading ? (
          <div className="w-full mx-auto flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <h2 className="font-hartone text-xl uppercase tracking-wide mb-2 text-black">
                LOADING LEADERBOARD
              </h2>
              <p className="text-sm text-gray-600 tracking-wider font-sintony">
                Fetching rankings...
              </p>
            </div>
          </div>
        ) : !leaderboardData || leaderboardData.leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-black" />
            <h3 className="text-xl font-hartone  mb-2 text-black font-extralight">
              No Rankings Yet
            </h3>
            <p className="text-gray-600 mb-4 font-sintony">
              Be the first to play today and claim the top spot!
            </p>
          </div>
        ) : (
          <div className="space-y-4 w-full mx-auto">
            {leaderboardData.leaderboard.map((player) => (
              <div
                key={`${player.rank}-${player.userName}`}
                className="w-full h-[50px] bg-white/30 overflow-hidden border border-black rounded-[9px] flex items-center pr-4"
              >
                {getRankIcon(player.rank)}
                <div className="flex items-center grow justify-between pl-2">
                  <p className="font-sintony text-[12px] text-black tracking-[7.5%] ml-1">
                    {player.userName}
                  </p>

                  <p className="font-hartone text-[16px] text-black tracking-[7.5%] ml-auto">
                    {player.score}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="h-4"></div>
    </div>
  );
};
