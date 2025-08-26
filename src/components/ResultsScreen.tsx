import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ColorSDK } from "@/lib/color-sdk";

interface ColorMatch {
  targetColor: string;
  capturedColor: string;
  finalScore: number;
  similarity: number;
  timeScore: number;
  timeTaken: number;
}

interface ResultsScreenProps {
  lastResult: ColorMatch;
  onPlayAgain: () => void;
  onResetGame: () => void;
  onShowStats: () => void;
  onShowHistory: () => void;
  onBackToMenu: () => void;
  getScoreColor: (score: number) => string;
  getScoreMessage: (score: number) => string;
  getDifficultyLevel: (score: number) => { level: string; color: string };
  getAccessibilityDescription: (color: string) => string;
}

export const ResultsScreen = ({
  lastResult,
  onPlayAgain,
  onResetGame,
  onShowStats,
  onShowHistory,
  onBackToMenu,
  getScoreColor,
  getScoreMessage,
  getDifficultyLevel,
  getAccessibilityDescription,
}: ResultsScreenProps) => {
  const scoreLevel = getDifficultyLevel(lastResult.finalScore);
  const formatTime = (seconds: number) => {
    return `${seconds.toFixed(1)}s`;
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🏆";
    if (score >= 80) return "🥇";
    if (score >= 70) return "🥈";
    if (score >= 60) return "🥉";
    return "💀";
  };

  const getScoreVariant = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 70) return "secondary";
    if (score >= 50) return "warning";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
            {getScoreEmoji(lastResult.finalScore)} RESULTS
          </h1>
          <Badge 
            variant={getScoreVariant(lastResult.finalScore) as any}
            className="text-2xl px-8 py-3"
          >
            {getScoreMessage(lastResult.finalScore)}
          </Badge>
        </div>

        {/* Main Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>📊 SCORE BREAKDOWN</CardTitle>
              <CardDescription>PERFORMANCE ANALYSIS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Final Score */}
              <div className="text-center p-6 border-4 border-foreground bg-muted">
                <div className="font-black text-6xl uppercase tracking-tighter leading-none mb-2">
                  {lastResult.finalScore}
                </div>
                <div className="font-bold text-lg uppercase tracking-wide">
                  FINAL SCORE
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  85% Color Accuracy + 15% Time Factor
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border-2 border-foreground">
                  <span className="font-bold uppercase tracking-wide">COLOR ACCURACY:</span>
                  <Badge variant="outline">{lastResult.similarity.toFixed(1)}%</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 border-2 border-foreground">
                  <span className="font-bold uppercase tracking-wide">TIME FACTOR:</span>
                  <Badge variant="outline">{Math.round((lastResult.finalScore - (lastResult.similarity * 0.85)) * 100) / 100}</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 border-2 border-foreground">
                  <span className="font-bold uppercase tracking-wide">TIME TAKEN:</span>
                  <Badge variant="outline">{formatTime(lastResult.timeTaken)}</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 border-2 border-foreground">
                  <span className="font-bold uppercase tracking-wide">SKILL LEVEL:</span>
                  <Badge variant="accent">{scoreLevel.level}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>🎨 COLOR COMPARISON</CardTitle>
              <CardDescription>TARGET VS CAPTURED</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Target Color */}
              <div>
                <div className="font-bold text-sm uppercase tracking-wide mb-2">
                  TARGET COLOR:
                </div>
                <div className="relative">
                  <div
                    className="w-full h-24 border-4 border-foreground shadow-[4px_4px_0px_hsl(var(--foreground))]"
                    style={{ backgroundColor: lastResult.targetColor }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-background/90 text-xs">
                      {lastResult.targetColor}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Captured Color */}
              <div>
                <div className="font-bold text-sm uppercase tracking-wide mb-2">
                  CAPTURED COLOR:
                </div>
                <div className="relative">
                  <div
                    className="w-full h-24 border-4 border-foreground shadow-[4px_4px_0px_hsl(var(--foreground))]"
                    style={{ backgroundColor: lastResult.capturedColor }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-background/90 text-xs">
                      {lastResult.capturedColor}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Color Difference Analysis */}
              <div className="p-4 bg-muted border-2 border-foreground">
                <div className="font-bold text-sm uppercase tracking-wide mb-2">
                  ANALYSIS:
                </div>
                <div className="font-mono text-sm">
                  Target: {getAccessibilityDescription(lastResult.targetColor)}
                </div>
                <div className="font-mono text-sm mt-1">
                  Captured: {getAccessibilityDescription(lastResult.capturedColor)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={onPlayAgain}
            variant="accent"
            size="lg"
            className="w-full"
          >
            🎯 PLAY AGAIN
          </Button>
          
          <Button
            onClick={onResetGame}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            🔄 NEW GAME
          </Button>
          
          <Button
            onClick={onShowStats}
            variant="outline"
            size="lg"
            className="w-full"
          >
            📊 VIEW STATS
          </Button>
          
          <Button
            onClick={onShowHistory}
            variant="outline"
            size="lg"
            className="w-full"
          >
            📜 HISTORY
          </Button>
        </div>

        {/* Back to Menu */}
        <div className="text-center">
          <Button
            onClick={onBackToMenu}
            variant="ghost"
            size="lg"
            className="font-black text-xl uppercase tracking-wider"
          >
            ← BACK TO MENU
          </Button>
        </div>
      </div>
    </div>
  );
};
