import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface StatsScreenProps {
  onBackToMenu: () => void;
  getAverageScore: () => number;
  getBestScore: () => number;
  getWorstScore: () => number;
  getTotalGames: () => number;
  getTotalPlayTime: () => number;
  onShowHistory: () => void;
}

export const StatsScreen = ({
  onBackToMenu,
  getAverageScore,
  getBestScore,
  getWorstScore,
  getTotalGames,
  getTotalPlayTime,
  onShowHistory,
}: StatsScreenProps) => {
  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getScoreRank = (score: number) => {
    if (score >= 90) return { rank: "LEGENDARY", variant: "success", emoji: "🏆" };
    if (score >= 80) return { rank: "MASTER", variant: "secondary", emoji: "🥇" };
    if (score >= 70) return { rank: "EXPERT", variant: "warning", emoji: "🥈" };
    if (score >= 60) return { rank: "SKILLED", variant: "info", emoji: "🥉" };
    return { rank: "NOVICE", variant: "outline", emoji: "🎯" };
  };

  const averageRank = getScoreRank(getAverageScore());
  const bestRank = getScoreRank(getBestScore());

  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
            📊 STATISTICS
          </h1>
          <p className="font-bold text-lg uppercase tracking-wide text-muted-foreground">
            YOUR COLOR HUNTING PERFORMANCE DATA
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Total Games */}
          <Card className="hover:translate-x-2 hover:translate-y-2 transition-transform duration-75">
            <CardHeader>
              <CardTitle>🎮 TOTAL GAMES</CardTitle>
              <CardDescription>HUNTING SESSIONS COMPLETED</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="font-black text-6xl uppercase tracking-tighter leading-none mb-4">
                {getTotalGames()}
              </div>
              <Badge variant="outline" className="text-lg">
                SESSIONS PLAYED
              </Badge>
            </CardContent>
          </Card>

          {/* Best Score */}
          <Card className="hover:translate-x-2 hover:translate-y-2 transition-transform duration-75">
            <CardHeader>
              <CardTitle>🏆 BEST SCORE</CardTitle>
              <CardDescription>YOUR HIGHEST ACHIEVEMENT</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="font-black text-6xl uppercase tracking-tighter leading-none">
                {getBestScore()}
              </div>
              <Badge 
                variant={bestRank.variant as any}
                className="text-lg"
              >
                {bestRank.emoji} {bestRank.rank}
              </Badge>
            </CardContent>
          </Card>

          {/* Average Score */}
          <Card className="hover:translate-x-2 hover:translate-y-2 transition-transform duration-75">
            <CardHeader>
              <CardTitle>📈 AVERAGE SCORE</CardTitle>
              <CardDescription>CONSISTENT PERFORMANCE</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="font-black text-6xl uppercase tracking-tighter leading-none">
                {getAverageScore()}
              </div>
              <Badge 
                variant={averageRank.variant as any}
                className="text-lg"
              >
                {averageRank.emoji} {averageRank.rank}
              </Badge>
            </CardContent>
          </Card>

          {/* Worst Score */}
          <Card className="hover:translate-x-2 hover:translate-y-2 transition-transform duration-75">
            <CardHeader>
              <CardTitle>💀 WORST SCORE</CardTitle>
              <CardDescription>ROOM FOR IMPROVEMENT</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="font-black text-6xl uppercase tracking-tighter leading-none mb-4">
                {getWorstScore()}
              </div>
              <Badge variant="destructive" className="text-lg">
                NEEDS WORK
              </Badge>
            </CardContent>
          </Card>

          {/* Play Time */}
          <Card className="hover:translate-x-2 hover:translate-y-2 transition-transform duration-75">
            <CardHeader>
              <CardTitle>⏱️ PLAY TIME</CardTitle>
              <CardDescription>TOTAL TIME INVESTED</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="font-black text-4xl uppercase tracking-tighter leading-none mb-4">
                {formatPlayTime(getTotalPlayTime())}
              </div>
              <Badge variant="info" className="text-lg">
                TIME SPENT HUNTING
              </Badge>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card className="hover:translate-x-2 hover:translate-y-2 transition-transform duration-75">
            <CardHeader>
              <CardTitle>🎯 PERFORMANCE</CardTitle>
              <CardDescription>SKILL ASSESSMENT</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <div className="font-bold text-lg uppercase tracking-wide">
                  SKILL LEVEL:
                </div>
                <Badge 
                  variant={averageRank.variant as any}
                  className="text-2xl px-6 py-2"
                >
                  {averageRank.emoji} {averageRank.rank}
                </Badge>
              </div>
              
              <div className="pt-4 border-t-2 border-foreground">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-bold uppercase tracking-wide">
                    AVG: {getAverageScore()}
                  </div>
                  <div className="font-bold uppercase tracking-wide">
                    BEST: {getBestScore()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🏅 ACHIEVEMENTS UNLOCKED</CardTitle>
            <CardDescription>MILESTONES REACHED</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {getTotalGames() >= 1 && (
                <Badge variant="success" className="p-3 text-center">
                  🎮 FIRST GAME
                </Badge>
              )}
              
              {getTotalGames() >= 10 && (
                <Badge variant="success" className="p-3 text-center">
                  🔥 10 GAMES
                </Badge>
              )}
              
              {getBestScore() >= 80 && (
                <Badge variant="success" className="p-3 text-center">
                  🥇 HIGH SCORER
                </Badge>
              )}
              
              {getBestScore() >= 95 && (
                <Badge variant="success" className="p-3 text-center">
                  🏆 PERFECTIONIST
                </Badge>
              )}
              
              {getAverageScore() >= 70 && (
                <Badge variant="success" className="p-3 text-center">
                  📈 CONSISTENT
                </Badge>
              )}
              
              {getTotalPlayTime() >= 30 && (
                <Badge variant="success" className="p-3 text-center">
                  ⏰ DEDICATED
                </Badge>
              )}
              
              {getTotalGames() >= 50 && (
                <Badge variant="success" className="p-3 text-center">
                  🎯 VETERAN
                </Badge>
              )}
              
              {getTotalGames() >= 100 && (
                <Badge variant="success" className="p-3 text-center">
                  👑 LEGEND
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            onClick={onShowHistory}
            variant="accent"
            size="lg"
          >
            📜 VIEW GAME HISTORY
          </Button>
          
          <Button
            onClick={onBackToMenu}
            variant="secondary"
            size="lg"
          >
            🏠 BACK TO MENU
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center border-t-4 border-foreground pt-8">
          <p className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
            STATS TRACKED SINCE FIRST PLAY SESSION
          </p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <Badge variant="outline">BRUTALIST STATS</Badge>
            <Badge variant="outline">NO FLUFF</Badge>
            <Badge variant="outline">PURE DATA</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
