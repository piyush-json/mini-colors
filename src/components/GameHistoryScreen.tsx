"use client";

import { useState, useEffect } from "react";
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
import {
  Calendar,
  Clock,
  Trophy,
  Target,
  BarChart3,
  TrendingUp,
  SortAsc,
  SortDesc,
  Trash2,
  Gamepad2,
  RefreshCw,
  AlertTriangle,
  Home,
  Star,
} from "lucide-react";

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
  const [sortBy, setSortBy] = useState<"date" | "score" | "time">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  // Sort game history
  const sortedHistory = [...gameHistory].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "score":
        comparison = a.score - b.score;
        break;
      case "time":
        comparison = a.timeTaken - b.timeTaken;
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
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

  const handleBackToMenu = () => {
    window.location.href = "/";
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 font-mono flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <h2 className="font-black text-2xl uppercase tracking-tighter mb-2">
              LOADING HISTORY
            </h2>
            <p className="text-muted-foreground">Fetching your game data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 font-mono flex items-center justify-center">
        <Card className="w-full max-w-md border-destructive">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-4" />
            <h2 className="font-black text-2xl uppercase tracking-tighter mb-2">
              ERROR
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-black text-4xl uppercase tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              GAME HISTORY
            </h1>
            <p className="text-muted-foreground">
              Your complete gaming journey
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => (window.location.href = "/stats")}
              variant="outline"
              size="sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Stats
            </Button>
            <Button onClick={handleBackToMenu} size="sm">
              <Home className="w-4 h-4 mr-2" />
              Menu
            </Button>
          </div>
        </div>

        {/* History Summary */}
        {stats && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Summary Statistics
              </CardTitle>
              <CardDescription>
                Overview of your gaming performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{stats.totalGames}</div>
                  <div className="text-sm text-muted-foreground">
                    Total Games
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {stats.averageScore.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Score
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {(stats.averageTime / 1000).toFixed(1)}s
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Time
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{stats.highScores}</div>
                  <div className="text-sm text-muted-foreground">
                    High Scores (80%+)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sort Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sort & Filter
            </CardTitle>
            <CardDescription>Organize your game history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Sort by:</span>
                <div className="flex space-x-1">
                  {(["date", "score", "time"] as const).map((field) => (
                    <Button
                      key={field}
                      onClick={() => handleSort(field)}
                      variant={sortBy === field ? "default" : "outline"}
                      size="sm"
                    >
                      {field === "date" && (
                        <Calendar className="w-4 h-4 mr-1" />
                      )}
                      {field === "score" && <Target className="w-4 h-4 mr-1" />}
                      {field === "time" && <Clock className="w-4 h-4 mr-1" />}
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                variant="outline"
                size="sm"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="w-4 h-4 mr-2" />
                ) : (
                  <SortDesc className="w-4 h-4 mr-2" />
                )}
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Game History List */}
        {sortedHistory.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No Games Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start playing to build up your game history!
              </p>
              <div className="space-x-4">
                <Link href="/daily">
                  <Button>
                    <Star className="w-4 h-4 mr-2" />
                    Daily Challenge
                  </Button>
                </Link>
                <Link href="/practice">
                  <Button variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Practice Mode
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedHistory.map((game, index) => (
              <Card key={game.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Game Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Date:</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(game.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Mode:</span>
                        <Badge variant="outline">{game.gameMode}</Badge>
                      </div>
                    </div>

                    {/* Target Color */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Target Color:</div>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-8 h-8 border-2 border-gray-300 rounded"
                          style={{ backgroundColor: game.targetColor }}
                        />
                        <span className="text-sm font-mono text-muted-foreground">
                          {game.targetColor}
                        </span>
                      </div>
                    </div>

                    {/* Captured Color */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Captured Color:</div>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-8 h-8 border-2 border-gray-300 rounded"
                          style={{ backgroundColor: game.capturedColor }}
                        />
                        <span className="text-sm font-mono text-muted-foreground">
                          {game.capturedColor}
                        </span>
                      </div>
                    </div>

                    {/* Score & Time */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Score:</span>
                        <span
                          className={`text-lg font-bold ${getScoreColor(game.score)}`}
                        >
                          {getScoreEmoji(game.score)} {game.score}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Time:</span>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(game.timeTaken)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Similarity:</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(game.similarity)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Performance:
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            game.score >= 90
                              ? "bg-green-500"
                              : game.score >= 80
                                ? "bg-green-400"
                                : game.score >= 70
                                  ? "bg-blue-500"
                                  : game.score >= 60
                                    ? "bg-yellow-500"
                                    : game.score >= 50
                                      ? "bg-orange-500"
                                      : "bg-red-500"
                          }`}
                          style={{ width: `${game.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {game.score}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/daily">
              <Button>
                <Star className="w-4 h-4 mr-2" />
                Daily Challenge
              </Button>
            </Link>
            <Link href="/party">
              <Button variant="outline">🎉 Party Mode</Button>
            </Link>
            <Link href="/mixing">
              <Button variant="outline">🎨 Color Mixing</Button>
            </Link>
            <Link href="/practice">
              <Button variant="outline">
                <Target className="w-4 h-4 mr-2" />
                Practice Mode
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
