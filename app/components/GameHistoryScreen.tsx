"use client";

import { useState, useEffect } from "react";
import { useColorGame } from "@/lib/useColorGame";
import { RetroButton, RetroCard, RetroColorSwatch } from "./RetroUI";
import Link from "next/link";

export const GameHistoryScreen = () => {
  const { gameState } = useColorGame();
  const [filteredHistory, setFilteredHistory] = useState(gameState.gameHistory);
  const [sortBy, setSortBy] = useState<"date" | "score" | "time">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    let sorted = [...gameState.gameHistory];

    switch (sortBy) {
      case "date":
        // Since ColorMatch doesn't have timestamp, we'll use array index as proxy for date
        sorted.sort((a, b) => {
          const indexA = gameState.gameHistory.indexOf(a);
          const indexB = gameState.gameHistory.indexOf(b);
          return sortOrder === "asc" ? indexA - indexB : indexB - indexA;
        });
        break;
      case "score":
        sorted.sort((a, b) => {
          return sortOrder === "asc"
            ? a.finalScore - b.finalScore
            : b.finalScore - a.finalScore;
        });
        break;
      case "time":
        sorted.sort((a, b) => {
          return sortOrder === "asc"
            ? a.timeTaken - b.timeTaken
            : b.timeTaken - a.timeTaken;
        });
        break;
    }

    setFilteredHistory(sorted);
  }, [gameState.gameHistory, sortBy, sortOrder]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatDate = (index: number) => {
    // Since ColorMatch doesn't have timestamp, we'll use the index as a proxy
    const now = new Date();
    const gameDate = new Date(
      now.getTime() - (gameState.gameHistory.length - index - 1) * 60000,
    ); // 1 min per game
    return gameDate.toLocaleDateString() + " " + gameDate.toLocaleTimeString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🎯";
    if (score >= 80) return "🌟";
    if (score >= 70) return "👍";
    if (score >= 60) return "😊";
    if (score >= 50) return "💪";
    return "💪";
  };

  const handleSort = (field: "date" | "score" | "time") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const clearHistory = () => {
    // This would need to be implemented in the useColorGame hook
    console.log("Clear history functionality would go here");
  };

  return (
    <div className="min-h-screen retro-bg-gradient p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 retro-text-gradient-primary">
            📜 Game History
          </h1>
          <p className="text-xl text-foreground-muted">
            Review your color hunting journey and track your progress over time!
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/">
              <RetroButton variant="secondary" size="md">
                ← Back to Menu
              </RetroButton>
            </Link>
            <Link href="/stats">
              <RetroButton variant="info" size="md">
                📊 View Stats
              </RetroButton>
            </Link>
          </div>
        </div>

        {/* History Summary */}
        <RetroCard title="📊 History Summary" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {gameState.gameHistory.length}
              </div>
              <div className="text-sm text-blue-800">Total Games</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {gameState.gameHistory.length > 0
                  ? Math.round(
                      gameState.gameHistory.reduce(
                        (sum, game) => sum + game.finalScore,
                        0,
                      ) / gameState.gameHistory.length,
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-green-800">Average Score</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {gameState.gameHistory.length > 0
                  ? Math.round(
                      gameState.gameHistory.reduce(
                        (sum, game) => sum + game.timeTaken,
                        0,
                      ) /
                        gameState.gameHistory.length /
                        1000,
                    )
                  : 0}
                s
              </div>
              <div className="text-sm text-purple-800">Average Time</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {
                  gameState.gameHistory.filter((game) => game.finalScore >= 80)
                    .length
                }
              </div>
              <div className="text-sm text-orange-800">High Scores (80%+)</div>
            </div>
          </div>
        </RetroCard>

        {/* Sort Controls */}
        <RetroCard title="🔍 Sort & Filter" className="mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Sort by:</span>
              <div className="flex space-x-1">
                {(["date", "score", "time"] as const).map((field) => (
                  <button
                    key={field}
                    onClick={() => handleSort(field)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      sortBy === field
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {field === "date" && "📅 Date"}
                    {field === "score" && "🎯 Score"}
                    {field === "time" && "⏰ Time"}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              {sortOrder === "asc" ? "⬆️ Ascending" : "⬇️ Descending"}
            </button>

            <RetroButton
              onClick={clearHistory}
              variant="secondary"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              🗑️ Clear History
            </RetroButton>
          </div>
        </RetroCard>

        {/* Game History List */}
        {filteredHistory.length === 0 ? (
          <RetroCard title="📝 No Games Yet" className="mb-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎮</div>
              <p className="text-lg text-foreground-muted">
                You haven't played any games yet!
              </p>
              <p className="text-sm text-foreground-muted">
                Start playing to build up your game history and track your
                progress.
              </p>
              <div className="space-x-4">
                <Link href="/daily">
                  <RetroButton variant="primary" size="md">
                    🌟 Daily Challenge
                  </RetroButton>
                </Link>
                <Link href="/practice">
                  <RetroButton variant="secondary" size="md">
                    🎯 Practice Mode
                  </RetroButton>
                </Link>
              </div>
            </div>
          </RetroCard>
        ) : (
          <div className="space-y-4 mb-6">
            {filteredHistory.map((game, index) => (
              <RetroCard
                key={index}
                title={`Game #${filteredHistory.length - index}`}
                className="mb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Game Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Date:</span>
                      <span className="text-sm text-foreground-muted">
                        {formatDate(index)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Mode:</span>
                      <span className="text-sm text-foreground-muted">
                        {gameState.practiceMode ? "🎯 Practice" : "🌟 Daily"}
                      </span>
                    </div>
                  </div>

                  {/* Target Color */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Target Color:</div>
                    <div className="flex items-center space-x-2">
                      <RetroColorSwatch color={game.targetColor} size="sm" />
                      <span className="text-sm font-mono text-foreground-muted">
                        {game.targetColor}
                      </span>
                    </div>
                  </div>

                  {/* Captured Color */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Captured Color:</div>
                    <div className="flex items-center space-x-2">
                      <RetroColorSwatch color={game.capturedColor} size="sm" />
                      <span className="text-sm font-mono text-foreground-muted">
                        {game.capturedColor}
                      </span>
                    </div>
                  </div>

                  {/* Score & Time */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Score:</span>
                      <span
                        className={`text-lg font-bold ${getScoreColor(game.finalScore)}`}
                      >
                        {getScoreEmoji(game.finalScore)} {game.finalScore}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Time:</span>
                      <span className="text-sm text-foreground-muted">
                        {formatTime(game.timeTaken)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Accuracy:</span>
                      <span className="text-sm text-foreground-muted">
                        {Math.round(game.similarity)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-foreground-muted">
                      Performance:
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          game.finalScore >= 90
                            ? "bg-green-500"
                            : game.finalScore >= 80
                              ? "bg-green-400"
                              : game.finalScore >= 70
                                ? "bg-blue-500"
                                : game.finalScore >= 60
                                  ? "bg-yellow-500"
                                  : game.finalScore >= 50
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                        }`}
                        style={{ width: `${game.finalScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground-muted">
                      {game.finalScore}%
                    </span>
                  </div>
                </div>
              </RetroCard>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/daily">
              <RetroButton variant="primary" size="md">
                🌟 Daily Challenge
              </RetroButton>
            </Link>
            <Link href="/party">
              <RetroButton variant="secondary" size="md">
                🎉 Party Mode
              </RetroButton>
            </Link>
            <Link href="/mixing">
              <RetroButton variant="secondary" size="md">
                🎨 Color Mixing
              </RetroButton>
            </Link>
            <Link href="/practice">
              <RetroButton variant="secondary" size="md">
                🎯 Practice Mode
              </RetroButton>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-foreground-muted">
          <p>
            💡 <strong>Tip:</strong> Use the sort options to analyze your
            performance patterns!
          </p>
        </div>
      </div>
    </div>
  );
};
