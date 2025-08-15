import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { useState, useEffect } from "react";

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  date: string;
  timestamp: number;
}

interface DailyLeaderboardProps {
  onClose: () => void;
  currentDate: string;
  currentScore?: number;
}

export const DailyLeaderboard = ({
  onClose,
  currentDate,
  currentScore,
}: DailyLeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/leaderboard");
        if (!response.ok) throw new Error("Failed to fetch leaderboard");

        const data = await response.json();
        // Filter for today's entries
        const todaysEntries = data.leaderboard.filter(
          (entry: LeaderboardEntry) => entry.date === currentDate,
        );
        setLeaderboard(todaysEntries);
      } catch (err) {
        setError("Failed to load leaderboard");
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentDate]);

  const getRankSuffix = (rank: number) => {
    if (rank === 1) return "ST";
    if (rank === 2) return "ND";
    if (rank === 3) return "RD";
    return "TH";
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "success";
    if (rank === 2) return "secondary";
    if (rank === 3) return "warning";
    return "outline";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
            🏆 DAILY
            <br />
            <span className="text-accent">LEADERBOARD</span>
          </h1>
          <p className="font-black text-xl uppercase tracking-wide text-muted-foreground mb-4">
            {formatDate(currentDate)}
          </p>
          <Badge variant="accent" className="text-lg px-6 py-2">
            TODAY&apos;S BRUTAL RANKINGS
          </Badge>
        </div>

        {/* Leaderboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>👑 TOP DESTROYERS</CardTitle>
            <CardDescription>
              TODAY&apos;S MOST BRUTAL PERFORMERS
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="font-black text-2xl uppercase tracking-wide animate-pulse">
                  LOADING DESTRUCTION DATA...
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="font-black text-xl uppercase tracking-wide text-destructive">
                  {error}
                </div>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <div className="font-black text-2xl uppercase tracking-wide text-muted-foreground">
                  NO SCORES YET TODAY
                </div>
                <div className="font-bold text-lg uppercase tracking-wide text-muted-foreground mt-2">
                  BE THE FIRST TO SUBMIT!
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const isTopThree = rank <= 3;

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-6 border-4 border-foreground ${
                        isTopThree
                          ? "bg-muted shadow-[8px_8px_0px_hsl(var(--foreground))]"
                          : "bg-card shadow-[4px_4px_0px_hsl(var(--foreground))]"
                      } ${isTopThree ? "hover:translate-x-2 hover:translate-y-2 transition-transform duration-75" : ""}`}
                    >
                      <div className="flex items-center space-x-6">
                        <Badge
                          variant={getRankColor(rank) as any}
                          className={`text-lg px-4 py-2 ${isTopThree ? "text-xl px-6 py-3" : ""}`}
                        >
                          {rank}
                          {getRankSuffix(rank)}
                        </Badge>

                        <div>
                          <div
                            className={`font-black uppercase tracking-wide ${
                              isTopThree ? "text-2xl" : "text-xl"
                            }`}
                          >
                            {entry.name}
                          </div>
                          <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              },
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-black uppercase tracking-tighter leading-none ${
                            isTopThree ? "text-4xl" : "text-2xl"
                          }`}
                        >
                          {entry.score}
                        </div>
                        <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                          DESTRUCTION POINTS
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center">
          <Button onClick={onClose} variant="outline" size="lg">
            ← BACK TO BATTLE
          </Button>
        </div>
      </div>
    </div>
  );
};
