"use client";

import { useState, useEffect } from "react";
import { useColorGame } from "@/lib/useColorGame";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";

export const GameHistoryScreen = () => {
  const { gameState } = useColorGame();
  const [filteredHistory, setFilteredHistory] = useState(gameState.gameHistory);
  const [sortBy, setSortBy] = useState<"date" | "score" | "time">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const sorted = [...gameState.gameHistory];

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
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
            📜 GAME
            <br />
            <span className="text-accent">HISTORY</span>
          </h1>
          <p className="text-xl font-bold uppercase tracking-wide">
            REVIEW YOUR COLOR HUNTING JOURNEY AND TRACK YOUR PROGRESS OVER TIME!
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/">
              <Button variant="secondary" size="default">
                ← BACK TO MENU
              </Button>
            </Link>
            <Link href="/stats">
              <Button variant="outline" size="default">
                📊 VIEW STATS
              </Button>
            </Link>
          </div>
        </div>

        {/* History Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📊 HISTORY SUMMARY</CardTitle>
            <CardDescription>DESTRUCTION STATISTICS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 border-4 border-foreground bg-muted shadow-[4px_4px_0px_hsl(var(--foreground))]">
                <Badge variant="outline" className="text-2xl mb-2">
                  {gameState.gameHistory.length}
                </Badge>
                <div className="text-sm font-black uppercase tracking-wide">
                  TOTAL GAMES
                </div>
              </div>
              <div className="p-4 border-4 border-foreground bg-muted shadow-[4px_4px_0px_hsl(var(--foreground))]">
                <Badge variant="success" className="text-2xl mb-2">
                  {gameState.gameHistory.length > 0
                    ? Math.round(
                        gameState.gameHistory.reduce(
                          (sum, game) => sum + game.finalScore,
                          0,
                        ) / gameState.gameHistory.length,
                      )
                    : 0}
                  %
                </Badge>
                <div className="text-sm font-black uppercase tracking-wide">
                  AVERAGE SCORE
                </div>
              </div>
              <div className="p-4 border-4 border-foreground bg-muted shadow-[4px_4px_0px_hsl(var(--foreground))]">
                <Badge variant="accent" className="text-2xl mb-2">
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
                  S
                </Badge>
                <div className="text-sm font-black uppercase tracking-wide">
                  AVERAGE TIME
                </div>
              </div>
              <div className="p-4 border-4 border-foreground bg-muted shadow-[4px_4px_0px_hsl(var(--foreground))]">
                <Badge variant="secondary" className="text-2xl mb-2">
                  {
                    gameState.gameHistory.filter(
                      (game) => game.finalScore >= 80,
                    ).length
                  }
                </Badge>
                <div className="text-sm font-black uppercase tracking-wide">
                  HIGH SCORES (80%+)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sort Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🔍 SORT & FILTER</CardTitle>
            <CardDescription>ORGANIZE YOUR DESTRUCTION HISTORY</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black uppercase tracking-wide">
                  SORT BY:
                </span>
                <div className="flex space-x-1">
                  {(["date", "score", "time"] as const).map((field) => (
                    <button
                      key={field}
                      onClick={() => handleSort(field)}
                      className={`px-3 py-1 border-2 border-foreground font-mono font-black uppercase tracking-wide text-sm transition-all ${
                        sortBy === field
                          ? "bg-foreground text-background shadow-[2px_2px_0px_hsl(var(--background))]"
                          : "bg-background text-foreground hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_hsl(var(--foreground))]"
                      }`}
                    >
                      {field === "date" && "📅 DATE"}
                      {field === "score" && "🎯 SCORE"}
                      {field === "time" && "⏰ TIME"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 py-1 bg-background border-2 border-foreground font-mono font-black uppercase tracking-wide text-sm hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_hsl(var(--foreground))] transition-all"
              >
                {sortOrder === "asc" ? "⬆️ ASCENDING" : "⬇️ DESCENDING"}
              </button>

              <Button onClick={clearHistory} variant="destructive" size="sm">
                🗑️ CLEAR HISTORY
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Game History List */}
        {filteredHistory.length === 0 ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>📝 NO GAMES YET</CardTitle>
              <CardDescription>
                YOUR DESTRUCTION HISTORY IS EMPTY
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl">🎮</div>
              <p className="text-lg font-bold uppercase tracking-wide">
                YOU HAVEN&apos;T PLAYED ANY GAMES YET!
              </p>
              <p className="text-sm font-bold uppercase tracking-wide">
                START PLAYING TO BUILD UP YOUR GAME HISTORY AND TRACK YOUR
                PROGRESS.
              </p>
              <div className="space-x-4">
                <Link href="/daily">
                  <Button variant="default" size="default">
                    🌟 DAILY CHALLENGE
                  </Button>
                </Link>
                <Link href="/practice">
                  <Button variant="secondary" size="default">
                    🎯 PRACTICE MODE
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
              <Button variant="default" size="default">
                🌟 DAILY CHALLENGE
              </Button>
            </Link>
            <Link href="/party">
              <Button variant="secondary" size="default">
                🎉 PARTY MODE
              </Button>
            </Link>
            <Link href="/mixing">
              <Button variant="secondary" size="default">
                🎨 COLOR MIXING
              </Button>
            </Link>
            <Link href="/practice">
              <Button variant="secondary" size="default">
                🎯 PRACTICE MODE
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-mono font-black uppercase tracking-wide">
                💡 <strong>TIP:</strong> USE THE SORT OPTIONS TO ANALYZE YOUR
                PERFORMANCE PATTERNS!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
