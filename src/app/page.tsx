"use client";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
            COLOR
            <br />
            <span className="text-accent">HUNTER</span>
          </h1>
          <p className="text-xl font-bold uppercase tracking-wide max-w-2xl mx-auto">
            TEST YOUR COLOR PERCEPTION SKILLS! CHOOSE FROM 4 EXCITING MINI-GAMES
            TO CHALLENGE YOUR COLOR MATCHING ABILITIES.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>🎯 HOW TO PLAY</CardTitle>
              <CardDescription>DESTRUCTION INSTRUCTIONS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    size="sm"
                    className="min-w-6 text-center"
                  >
                    1
                  </Badge>
                  <p className="font-black uppercase tracking-wide">
                    CHOOSE YOUR FAVORITE MINI-GAME
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    size="sm"
                    className="min-w-6 text-center"
                  >
                    2
                  </Badge>
                  <p className="font-black uppercase tracking-wide">
                    ALLOW CAMERA ACCESS WHEN PROMPTED
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    size="sm"
                    className="min-w-6 text-center"
                  >
                    3
                  </Badge>
                  <p className="font-black uppercase tracking-wide">
                    POINT YOUR CAMERA AT AN OBJECT WITH THE TARGET COLOR
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    size="sm"
                    className="min-w-6 text-center"
                  >
                    4
                  </Badge>
                  <p className="font-black uppercase tracking-wide">
                    CAPTURE THE COLOR AND SEE YOUR SCORE!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🏆 SCORING SYSTEM</CardTitle>
              <CardDescription>DESTRUCTION METRICS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex items-center justify-between p-2 border-2 border-foreground bg-muted">
                  <span className="font-black uppercase">90-100%</span>
                  <Badge variant="success">🎯 PERFECT MATCH!</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border-2 border-foreground bg-muted">
                  <span className="font-black uppercase">80-89%</span>
                  <Badge variant="success">🌟 EXCELLENT!</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border-2 border-foreground bg-muted">
                  <span className="font-black uppercase">70-79%</span>
                  <Badge variant="outline">👍 GREAT JOB!</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border-2 border-foreground bg-muted">
                  <span className="font-black uppercase">60-69%</span>
                  <Badge variant="accent">😊 GOOD!</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border-2 border-foreground bg-muted">
                  <span className="font-black uppercase">Below 60%</span>
                  <Badge variant="secondary">💪 KEEP TRYING!</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>🌟 DAILY CHALLENGE</CardTitle>
              <CardDescription>DAILY DESTRUCTION QUOTA</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl">🌟</div>
              <h3 className="font-mono text-lg font-black uppercase tracking-tighter">
                DAILY COLOR HUNT
              </h3>
              <p className="text-sm font-mono font-bold uppercase tracking-wide">
                A NEW COLOR EVERY DAY! CHALLENGE YOURSELF AND COMPETE ON THE
                GLOBAL LEADERBOARD. UNLIMITED ATTEMPTS TO BEAT YOUR BEST SCORE.
              </p>
              <Link href="/daily">
                <Button variant="default" size="lg" className="w-full">
                  🚀 START DAILY CHALLENGE
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎉 PARTY MODE</CardTitle>
              <CardDescription>LOCAL DESTRUCTION GATHERING</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl">🎉</div>
              <h3 className="font-mono text-lg font-black uppercase tracking-tighter">
                LOCAL PARTY GAME
              </h3>
              <p className="text-sm font-mono font-bold uppercase tracking-wide">
                HOST A PARTY! ONE PERSON GIVES A COLOR, OTHERS HUNT FOR IT.
                PERFECT FOR GROUP FUN AND FRIENDLY COMPETITION.
              </p>
              <Link href="/party">
                <Button variant="secondary" size="lg" className="w-full">
                  🎮 START PARTY MODE
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎨 COLOR MIXING</CardTitle>
              <CardDescription>BLEND DESTRUCTION METHOD</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl">🎨</div>
              <h3 className="font-mono text-lg font-black uppercase tracking-tighter">
                MIX TWO COLORS
              </h3>
              <p className="text-sm font-mono font-bold uppercase tracking-wide">
                BLEND COLORS IN PERFECT PROPORTIONS! MIX TWO COLORS TO CREATE
                THE TARGET COLOR. TEST YOUR COLOR THEORY KNOWLEDGE.
              </p>
              <Link href="/mixing">
                <Button variant="secondary" size="lg" className="w-full">
                  🎨 START MIXING
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔮 COMING SOON</CardTitle>
              <CardDescription>FUTURE DESTRUCTION</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl">🔮</div>
              <h3 className="font-mono text-lg font-black uppercase tracking-tighter">
                MYSTERY GAME
              </h3>
              <p className="text-sm font-mono font-bold uppercase tracking-wide">
                A BRAND NEW COLOR CHALLENGE IS IN DEVELOPMENT! STAY TUNED FOR
                EXCITING UPDATES AND NEW GAMEPLAY MODES.
              </p>
              <Button
                onClick={() => {}}
                disabled
                variant="secondary"
                size="lg"
                className="w-full opacity-50"
              >
                🔒 COMING SOON
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <Link href="/practice">
            <Button variant="secondary" size="lg" className="max-w-xs">
              🎯 PRACTICE MODE (NO CAMERA)
            </Button>
          </Link>
          <div className="space-x-4">
            <Link href="/stats">
              <Button variant="secondary" size="default">
                📊 VIEW STATISTICS
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="secondary" size="default">
                📜 VIEW HISTORY
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="p-4 border-4 border-foreground bg-muted shadow-[8px_8px_0px_hsl(var(--foreground))]">
            <p className="text-sm font-mono font-black uppercase tracking-wide">
              💡 <strong>TIP:</strong> GOOD LIGHTING AND A STEADY HAND WILL
              IMPROVE YOUR COLOR ACCURACY!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
