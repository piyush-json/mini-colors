"use client";

import { useState, useEffect } from "react";
import { useColorGame } from "@/lib/useColorGame";
import { RetroButton, RetroCard, RetroScoreDisplay } from "./RetroUI";
import Link from "next/link";

export const StatsScreen = () => {
  const {
    getAverageScore,
    getBestScore,
    getWorstScore,
    getTotalGames,
    getTotalPlayTime,
    gameState,
  } = useColorGame();

  const [stats, setStats] = useState({
    averageScore: 0,
    bestScore: 0,
    worstScore: 0,
    totalGames: 0,
    totalPlayTime: 0,
  });

  useEffect(() => {
    setStats({
      averageScore: getAverageScore(),
      bestScore: getBestScore(),
      worstScore: getWorstScore(),
      totalGames: getTotalGames(),
      totalPlayTime: getTotalPlayTime(),
    });
  }, [getAverageScore, getBestScore, getWorstScore, getTotalGames, getTotalPlayTime]);

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

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "text-green-600", emoji: "🎯" };
    if (score >= 80) return { grade: "A", color: "text-green-600", emoji: "🌟" };
    if (score >= 70) return { grade: "B", color: "text-blue-600", emoji: "👍" };
    if (score >= 60) return { grade: "C", color: "text-yellow-600", emoji: "😊" };
    if (score >= 50) return { grade: "D", color: "text-orange-600", emoji: "💪" };
    return { grade: "F", color: "text-red-600", emoji: "💪" };
  };

  const getPerformanceLevel = (averageScore: number) => {
    if (averageScore >= 90) return "Color Master";
    if (averageScore >= 80) return "Color Expert";
    if (averageScore >= 70) return "Color Pro";
    if (averageScore >= 60) return "Color Apprentice";
    if (averageScore >= 50) return "Color Beginner";
    return "Color Explorer";
  };

  const bestGrade = getScoreGrade(stats.bestScore);
  const averageGrade = getScoreGrade(stats.averageScore);
  const performanceLevel = getPerformanceLevel(stats.averageScore);

  return (
    <div className="min-h-screen retro-bg-gradient p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 retro-text-gradient-primary">
            📊 Your Statistics
          </h1>
          <p className="text-xl text-foreground-muted">
            Track your color hunting progress and achievements!
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/">
              <RetroButton variant="secondary" size="md">
                ← Back to Menu
              </RetroButton>
            </Link>
            <Link href="/daily">
              <RetroButton variant="primary" size="md">
                🌟 Daily Challenge
              </RetroButton>
            </Link>
          </div>
        </div>

        {/* Performance Overview */}
        <RetroCard title="🏆 Performance Overview" className="mb-6">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">{performanceLevel.includes("Master") ? "👑" : "🎯"}</div>
            <h2 className="text-2xl font-bold text-foreground">{performanceLevel}</h2>
            <p className="text-foreground-muted">
              Based on your average score of {stats.averageScore}%
            </p>
          </div>
        </RetroCard>

        {/* Score Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <RetroScoreDisplay
            label="Best Score"
            score={stats.bestScore}
            maxScore={100}
          />
          <RetroScoreDisplay
            label="Average Score"
            score={stats.averageScore}
            maxScore={100}
          />
          <RetroScoreDisplay
            label="Worst Score"
            score={stats.worstScore}
            maxScore={100}
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <RetroCard title="📈 Score Analysis">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Best Score</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-xl font-bold ${bestGrade.color}`}>
                    {stats.bestScore}%
                  </span>
                  <span className="text-2xl">{bestGrade.emoji}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Grade</span>
                <span className={`text-xl font-bold ${bestGrade.color}`}>
                  {bestGrade.grade}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Average Score</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-xl font-bold ${averageGrade.color}`}>
                    {stats.averageScore}%
                  </span>
                  <span className="text-2xl">{averageGrade.emoji}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Grade</span>
                <span className={`text-xl font-bold ${averageGrade.color}`}>
                  {averageGrade.grade}
                </span>
              </div>
            </div>
          </RetroCard>

          <RetroCard title="🎮 Game Statistics">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Total Games</span>
                <span className="text-xl font-bold text-blue-600">
                  {stats.totalGames}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Total Play Time</span>
                <span className="text-xl font-bold text-green-600">
                  {formatTime(stats.totalPlayTime)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Average Time/Game</span>
                <span className="text-xl font-bold text-purple-600">
                  {stats.totalGames > 0 ? formatTime(stats.totalPlayTime / stats.totalGames) : "0s"}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Success Rate</span>
                <span className="text-xl font-bold text-orange-600">
                  {stats.totalGames > 0 ? Math.round((stats.averageScore / 100) * 100) : 0}%
                </span>
              </div>
            </div>
          </RetroCard>
        </div>

        {/* Achievement Badges */}
        <RetroCard title="🏅 Achievements" className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`text-center p-4 rounded-lg ${
              stats.bestScore >= 90 ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-gray-100'
            }`}>
              <div className="text-3xl mb-2">
                {stats.bestScore >= 90 ? '🥇' : '🏃'}
              </div>
              <div className="text-sm font-bold">Perfect Score</div>
              <div className="text-xs text-gray-600">Score 90%+</div>
            </div>
            
            <div className={`text-center p-4 rounded-lg ${
              stats.totalGames >= 10 ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-100'
            }`}>
              <div className="text-3xl mb-2">
                {stats.totalGames >= 10 ? '🎯' : '🎮'}
              </div>
              <div className="text-sm font-bold">Dedicated Player</div>
              <div className="text-xs text-gray-600">Play 10+ games</div>
            </div>
            
            <div className={`text-center p-4 rounded-lg ${
              stats.averageScore >= 80 ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-100'
            }`}>
              <div className="text-3xl mb-2">
                {stats.averageScore >= 80 ? '🌟' : '⭐'}
              </div>
              <div className="text-sm font-bold">Consistent</div>
              <div className="text-xs text-gray-600">80%+ average</div>
            </div>
            
            <div className={`text-center p-4 rounded-lg ${
              stats.totalPlayTime >= 300000 ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-100'
            }`}>
              <div className="text-3xl mb-2">
                {stats.totalPlayTime >= 300000 ? '⏰' : '⌛'}
              </div>
              <div className="text-sm font-bold">Time Master</div>
              <div className="text-xs text-gray-600">5+ min total</div>
            </div>
          </div>
        </RetroCard>

        {/* Progress Tips */}
        <RetroCard title="💡 Tips to Improve" className="mb-6">
          <div className="space-y-3 text-sm">
            {stats.averageScore < 70 && (
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">💪</span>
                <p>Practice regularly to improve your color recognition skills</p>
              </div>
            )}
            {stats.averageScore < 80 && (
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">🎯</span>
                <p>Take your time to find the exact color match</p>
              </div>
            )}
            {stats.averageScore < 90 && (
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">🌟</span>
                <p>Good lighting conditions can significantly improve accuracy</p>
              </div>
            )}
            {stats.totalGames < 5 && (
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">🚀</span>
                <p>Play more games to build up your statistics</p>
              </div>
            )}
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 font-bold">📱</span>
              <p>Try the daily challenge for consistent practice</p>
            </div>
          </div>
        </RetroCard>

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
            💡 <strong>Tip:</strong> Your statistics are saved locally and will persist between sessions!
          </p>
        </div>
      </div>
    </div>
  );
};
