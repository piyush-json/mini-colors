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
import {
  BarChart3,
  Trophy,
  Medal,
  Target,
  Gamepad2,
  TrendingUp,
  Skull,
  Award,
  Flame,
  Crown,
  FileText,
  Home,
  Clock,
  Star,
  Calendar,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface UserStats {
  totalAttempts: number;
  bestScore: number;
  averageScore: number;
  totalTimePlayed: number;
  gamesPlayed: number;
  dailyBestScores: Array<{
    date: string;
    score: number;
  }>;
  recentActivity: Array<{
    date: string;
    attempts: number;
    bestScore: number;
  }>;
}

export const StatsScreen = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user statistics
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch current daily stats
        const dailyResponse = await fetch("/api/daily/stats");
        const todayStats = dailyResponse.ok ? await dailyResponse.json() : null;

        // Fetch overall user stats from a new endpoint we'll need to create
        const overallResponse = await fetch("/api/user/stats");
        const overallStats = overallResponse.ok
          ? await overallResponse.json()
          : null;

        // Combine the data
        setStats({
          totalAttempts: todayStats?.totalAttempts || 0,
          bestScore: Math.max(
            todayStats?.bestScore || 0,
            overallStats?.bestScore || 0,
          ),
          averageScore: overallStats?.averageScore || 0,
          totalTimePlayed: overallStats?.totalTimePlayed || 0,
          gamesPlayed: overallStats?.gamesPlayed || 0,
          dailyBestScores: overallStats?.dailyBestScores || [],
          recentActivity: overallStats?.recentActivity || [],
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to load statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleBackToMenu = () => {
    window.location.href = "/";
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getScoreRank = (score: number) => {
    if (score >= 90)
      return { rank: "LEGENDARY", variant: "success" as const, icon: Trophy };
    if (score >= 80)
      return { rank: "MASTER", variant: "secondary" as const, icon: Medal };
    if (score >= 70)
      return { rank: "EXPERT", variant: "warning" as const, icon: Award };
    if (score >= 60)
      return { rank: "SKILLED", variant: "outline" as const, icon: Star };
    return { rank: "NOVICE", variant: "destructive" as const, icon: Target };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 font-mono flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <h2 className="font-black text-2xl uppercase tracking-tighter mb-2">
              LOADING STATS
            </h2>
            <p className="text-muted-foreground">
              Fetching your performance data...
            </p>
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

  if (!stats) {
    return (
      <div className="min-h-screen bg-background p-4 font-mono flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Target className="w-8 h-8 mx-auto mb-4" />
            <h2 className="font-black text-2xl uppercase tracking-tighter mb-2">
              NO DATA
            </h2>
            <p className="text-muted-foreground mb-4">
              Start playing to see your statistics!
            </p>
            <Button onClick={handleBackToMenu}>
              <Home className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const averageRank = getScoreRank(stats.averageScore);
  const bestRank = getScoreRank(stats.bestScore);

  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-black text-4xl uppercase tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              STATS
            </h1>
            <p className="text-muted-foreground">
              Your color guessing performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => (window.location.href = "/history")}
              variant="outline"
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button onClick={handleBackToMenu} size="sm">
              <Home className="w-4 h-4 mr-2" />
              Menu
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    Best Score
                  </p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-100">
                    {stats.bestScore}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Average Score
                  </p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-100">
                    {stats.averageScore.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Total Attempts
                  </p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-100">
                    {stats.totalAttempts}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    Time Played
                  </p>
                  <p className="text-2xl font-bold text-orange-800 dark:text-orange-100">
                    {formatPlayTime(stats.totalTimePlayed)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Overview
              </CardTitle>
              <CardDescription>
                Your gaming performance and rankings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Best Score Rank
                  </span>
                  <Badge variant={bestRank.variant} className="gap-1">
                    <bestRank.icon className="w-3 h-3" />
                    {bestRank.rank}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Average Score Rank
                  </span>
                  <Badge variant={averageRank.variant} className="gap-1">
                    <averageRank.icon className="w-3 h-3" />
                    {averageRank.rank}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Games Played
                  </span>
                  <span className="font-medium">{stats.gamesPlayed}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
              <CardDescription>Milestones you&apos;ve unlocked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {stats.bestScore >= 90 && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <Crown className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs font-medium">Perfectionist</span>
                  </div>
                )}
                {stats.averageScore >= 75 && (
                  <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <Flame className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium">Consistent</span>
                  </div>
                )}
                {stats.totalAttempts >= 50 && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Medal className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium">Dedicated</span>
                  </div>
                )}
                {stats.totalAttempts >= 100 && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                    <Trophy className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium">Champion</span>
                  </div>
                )}
                {stats.averageScore >= 50 && (
                  <div className="flex items-center gap-2 p-2 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-medium">Never Give Up</span>
                  </div>
                )}
                {stats.totalTimePlayed >= 7200 && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950 rounded-lg">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-medium">Time Master</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {stats.recentActivity.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your daily performance over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.recentActivity.slice(0, 7).map((day, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
                  >
                    <span className="text-sm font-medium">{day.date}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {day.attempts} attempts
                      </span>
                      <span className="text-sm font-medium">
                        Best: {day.bestScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
