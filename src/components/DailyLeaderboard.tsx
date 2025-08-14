import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
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
  onSubmitScore?: (name: string) => void;
}

export const DailyLeaderboard = ({ 
  onClose, 
  currentDate, 
  currentScore,
  onSubmitScore 
}: DailyLeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [currentDate]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaderboard');
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      
      const data = await response.json();
      // Filter for today's entries
      const todaysEntries = data.leaderboard.filter((entry: LeaderboardEntry) => 
        entry.date === currentDate
      );
      setLeaderboard(todaysEntries);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitScore = async () => {
    if (!playerName.trim() || !currentScore || submitting) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName.trim(),
          score: currentScore,
          date: currentDate,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit score');

      setHasSubmitted(true);
      if (onSubmitScore) {
        onSubmitScore(playerName.trim());
      }
      
      // Refresh leaderboard
      await fetchLeaderboard();
    } catch (err) {
      setError('Failed to submit score');
      console.error('Score submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

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
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
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

        {/* Score Submission (if user has a current score and hasn't submitted) */}
        {currentScore && !hasSubmitted && (
          <Card className="mb-8 border-accent bg-accent/10">
            <CardHeader>
              <CardTitle className="text-accent">💀 SUBMIT YOUR DESTRUCTION</CardTitle>
              <CardDescription>ADD YOUR SCORE TO THE CARNAGE</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="font-black text-4xl uppercase tracking-tighter leading-none mb-2">
                  YOUR SCORE: {currentScore}
                </div>
                <Badge variant="accent" className="text-lg">
                  READY FOR SUBMISSION
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="font-black text-sm uppercase tracking-wide mb-2 block">
                    ENTER YOUR NAME (MAX 20 CHARS):
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
                    className="w-full p-4 border-4 border-foreground bg-input text-foreground font-mono font-bold uppercase tracking-wide focus:outline-none focus:ring-0 shadow-[8px_8px_0px_hsl(var(--foreground))]"
                    placeholder="YOUR BRUTAL NAME"
                    maxLength={20}
                  />
                </div>
                
                <Button
                  onClick={submitScore}
                  disabled={!playerName.trim() || submitting}
                  variant="accent"
                  size="lg"
                  className="w-full text-xl"
                >
                  {submitting ? "SUBMITTING DESTRUCTION..." : "🔥 SUBMIT TO LEADERBOARD"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>👑 TOP DESTROYERS</CardTitle>
            <CardDescription>TODAY&apos;S MOST BRUTAL PERFORMERS</CardDescription>
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
                <Button onClick={fetchLeaderboard} variant="outline" className="mt-4">
                  RETRY LOAD
                </Button>
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
                          ? 'bg-muted shadow-[8px_8px_0px_hsl(var(--foreground))]' 
                          : 'bg-card shadow-[4px_4px_0px_hsl(var(--foreground))]'
                      } ${isTopThree ? 'hover:translate-x-2 hover:translate-y-2 transition-transform duration-75' : ''}`}
                    >
                      <div className="flex items-center space-x-6">
                        <Badge 
                          variant={getRankColor(rank) as any}
                          className={`text-lg px-4 py-2 ${isTopThree ? 'text-xl px-6 py-3' : ''}`}
                        >
                          {rank}{getRankSuffix(rank)}
                        </Badge>
                        
                        <div>
                          <div className={`font-black uppercase tracking-wide ${
                            isTopThree ? 'text-2xl' : 'text-xl'
                          }`}>
                            {entry.name}
                          </div>
                          <div className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-black uppercase tracking-tighter leading-none ${
                          isTopThree ? 'text-4xl' : 'text-2xl'
                        }`}>
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
        <div className="flex justify-center space-x-4">
          <Button
            onClick={fetchLeaderboard}
            variant="secondary"
            size="lg"
          >
            🔄 REFRESH CARNAGE
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            size="lg"
          >
            ← BACK TO BATTLE
          </Button>
        </div>
      </div>
    </div>
  );
};
