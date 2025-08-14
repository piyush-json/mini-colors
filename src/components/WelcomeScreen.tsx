import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

interface WelcomeScreenProps {
  onStartGame: () => void;
  onShowStats: () => void;
  onPracticeMode: () => void;
  onDailyMode: () => void;
  onPartyMode: () => void;
  onMixMode: () => void;
  error: string | null;
}

export const WelcomeScreen = ({
  onStartGame,
  onShowStats,
  onPracticeMode,
  onDailyMode,
  onPartyMode,
  onMixMode,
  error,
}: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-black text-8xl md:text-9xl lg:text-[12rem] uppercase tracking-tighter leading-none mb-8 text-foreground transform hover:scale-105 transition-transform duration-300">
            COLOR
            <br />
            <span className="text-accent animate-pulse">HUNTER</span>
          </h1>
          <div className="max-w-4xl mx-auto mb-12">
            <p className="font-black text-2xl md:text-3xl uppercase tracking-wide text-muted-foreground leading-tight">
              HYPER BRUTALIST COLOR PERCEPTION DESTRUCTION SYSTEM
            </p>
          </div>
          <Badge
            variant="accent"
            className="text-2xl px-12 py-4 shadow-[16px_16px_0px_hsl(var(--foreground))]"
          >
            🎯 MAXIMUM DIFFICULTY MODE
          </Badge>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 bg-destructive border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive-foreground">
                ⚠️ CAMERA ERROR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold text-destructive-foreground uppercase tracking-wide mb-4">
                {error}
              </p>
              <p className="font-bold text-sm text-destructive-foreground uppercase tracking-wide opacity-80">
                NO WORRIES! PRACTICE MODE STILL WORKS WITHOUT CAMERA.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Game Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Classic Mode */}
          <Card className="hover:translate-x-4 hover:translate-y-4 hover:shadow-[24px_24px_0px_hsl(var(--foreground))] transition-all duration-150 hover:scale-105">
            <CardHeader>
              <CardTitle>🎯 CLASSIC DESTRUCTION</CardTitle>
              <CardDescription>ANNIHILATE TARGET COLORS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-4 font-black text-sm uppercase tracking-wider">
                <div className="flex items-start space-x-4">
                  <span className="text-accent text-2xl">→</span>
                  <span>BRUTALLY POINT CAMERA AT OBJECTS</span>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-accent text-2xl">→</span>
                  <span>VIOLENTLY MATCH TARGET COLOR</span>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-accent text-2xl">→</span>
                  <span>AGGRESSIVELY SCORE MAXIMUM POINTS</span>
                </div>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={onStartGame}
                  variant="accent"
                  size="lg"
                  className="w-full text-xl"
                >
                  💀 DESTROY COLORS
                </Button>
                <Button
                  onClick={onPracticeMode}
                  variant="outline"
                  size="lg"
                  className="w-full text-xl"
                >
                  🔥 PRACTICE BRUTALITY
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Daily Challenge */}
          <Card className="hover:translate-x-4 hover:translate-y-4 hover:shadow-[24px_24px_0px_hsl(var(--foreground))] transition-all duration-150 hover:scale-105">
            <CardHeader>
              <CardTitle>📅 DAILY ANNIHILATION</CardTitle>
              <CardDescription>GLOBAL DOMINATION MODE</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-4 font-black text-sm uppercase tracking-wider">
                <div className="flex items-start space-x-4">
                  <span className="text-secondary text-2xl">→</span>
                  <span>ONE BRUTAL CHALLENGE PER DAY</span>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-secondary text-2xl">→</span>
                  <span>CRUSHING GLOBAL LEADERBOARD</span>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-secondary text-2xl">→</span>
                  <span>MERCILESS DAILY STREAKS</span>
                </div>
              </div>
              <Button
                onClick={onDailyMode}
                variant="secondary"
                size="lg"
                className="w-full text-xl"
              >
                ⚡ TODAY&apos;S DESTRUCTION
              </Button>
            </CardContent>
          </Card>

          {/* Color Mixing */}
          <Card className="hover:translate-x-4 hover:translate-y-4 hover:shadow-[24px_24px_0px_hsl(var(--foreground))] transition-all duration-150 hover:scale-105">
            <CardHeader>
              <CardTitle>🎨 COLOR WARFARE</CardTitle>
              <CardDescription>MIXING MAYHEM MODE</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-4 font-black text-sm uppercase tracking-wider">
                <div className="flex items-start space-x-4">
                  <span className="text-info text-2xl">→</span>
                  <span>VIOLENTLY BLEND RGB VALUES</span>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-info text-2xl">→</span>
                  <span>AGGRESSIVELY MATCH TARGET SHADE</span>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-info text-2xl">→</span>
                  <span>BRUTALLY LEARN COLOR THEORY</span>
                </div>
              </div>
              <Button
                onClick={onMixMode}
                variant="default"
                size="lg"
                className="w-full bg-info border-info text-info-foreground text-xl"
              >
                🧪 START MIXING CHAOS
              </Button>
            </CardContent>
          </Card>

          {/* Party Mode */}
          <Card className="hover:translate-x-4 hover:translate-y-4 hover:shadow-[24px_24px_0px_hsl(var(--foreground))] transition-all duration-150 hover:scale-105">
            <CardHeader>
              <CardTitle>🎉 PARTY DESTRUCTION</CardTitle>
              <CardDescription>MULTIPLAYER APOCALYPSE</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-4 font-black text-sm uppercase tracking-wider">
                <div className="flex items-start space-x-4">
                  <span className="text-success text-2xl">→</span>
                  <span>REAL-TIME MULTIPLAYER CHAOS</span>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-success text-2xl">→</span>
                  <span>BRUTALLY COMPETE WITH FRIENDS</span>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-success text-2xl">→</span>
                  <span>INSTANT DESTRUCTION MATCHING</span>
                </div>
              </div>
              <Button
                onClick={onPartyMode}
                variant="success"
                size="lg"
                className="w-full text-xl"
              >
                💥 JOIN THE CARNAGE
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-12">
          <Button
            onClick={onShowStats}
            variant="ghost"
            size="lg"
            className="font-black text-3xl uppercase tracking-wider hover:scale-110 transition-transform duration-200"
          >
            📊 DEMOLISH STATS
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center border-t-8 border-foreground pt-12 bg-muted">
          <p className="font-black text-xl uppercase tracking-wide text-foreground mb-8">
            HYPER BRUTALIST COLOR PERCEPTION ANNIHILATION SYSTEM
          </p>
          <div className="flex justify-center items-center space-x-6 mt-8">
            <Badge variant="outline" className="text-lg">
              V3.0 ULTRA
            </Badge>
            <Badge variant="destructive" className="text-lg">
              HYPER BRUTALIST
            </Badge>
            <Badge variant="accent" className="text-lg">
              MAXIMUM CHAOS
            </Badge>
            <Badge variant="success" className="text-lg">
              ZERO MERCY
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
