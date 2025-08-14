"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

// Utility functions for color mixing
const mixColors = (
  color1: string,
  color2: string,
  proportion1: number,
  proportion2: number,
): string => {
  const total = proportion1 + proportion2;
  const ratio1 = proportion1 / total;
  const ratio2 = proportion2 / total;

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return "#000000";

  // Mix colors
  const mixedR = Math.round(rgb1.r * ratio1 + rgb2.r * ratio2);
  const mixedG = Math.round(rgb1.g * ratio1 + rgb2.g * ratio2);
  const mixedB = Math.round(rgb1.b * ratio1 + rgb2.b * ratio2);

  // Convert back to hex
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(mixedR)}${toHex(mixedG)}${toHex(mixedB)}`;
};

const calculateColorAccuracy = (color1: string, color2: string): number => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  // Calculate Euclidean distance
  const deltaR = rgb1.r - rgb2.r;
  const deltaG = rgb1.g - rgb2.g;
  const deltaB = rgb1.b - rgb2.b;

  const distance = Math.sqrt(
    deltaR * deltaR + deltaG * deltaG + deltaB * deltaB,
  );
  const maxDistance = Math.sqrt(255 * 255 + 255 * 255 + 255 * 255);

  // Convert to percentage (100% = perfect match, 0% = completely different)
  return Math.max(0, 100 - (distance / maxDistance) * 100);
};

export const ColorMixingScreen = () => {
  const [color1, setColor1] = useState("#ff0000");
  const [color2, setColor2] = useState("#0000ff");
  const [proportion1, setProportion1] = useState(50);
  const [proportion2, setProportion2] = useState(50);
  const [targetColor, setTargetColor] = useState("#800080");
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [mixedResult, setMixedResult] = useState("");

  // Generate a new target color
  const generateTargetColor = () => {
    const colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#ff8000",
      "#8000ff",
      "#00ff80",
      "#ff0080",
      "#80ff00",
      "#0080ff",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(randomColor);
  };

  // Start a new game
  const handleStartGame = () => {
    generateTargetColor();
    setIsPlaying(true);
    setTimer(0);
    setShowResult(false);
    setScore(0);
    setMixedResult("");
  };

  // Mix colors and calculate score
  const handleMixColors = () => {
    setIsLoading(true);

    setTimeout(() => {
      const result = mixColors(color1, color2, proportion1, proportion2);
      setMixedResult(result);

      const accuracy = calculateColorAccuracy(result, targetColor);
      const timeBonus = Math.max(0, 100 - timer * 2); // Time penalty
      const finalScore = Math.round((accuracy + timeBonus) / 2);

      setScore(finalScore);
      setShowResult(true);
      setIsLoading(false);
    }, 1000);
  };

  // Start a new game
  const handleNewGame = () => {
    setIsPlaying(false);
    setTimer(0);
    setShowResult(false);
    setScore(0);
    setMixedResult("");
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !showResult) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, showResult]);

  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
            🎨 COLOR
            <br />
            <span className="text-accent">MIXING</span>
            <br />
            <span className="text-destructive">CHALLENGE</span>
          </h1>
          <p className="text-xl font-bold uppercase tracking-wide">
            MIX TWO COLORS IN PERFECT PROPORTIONS TO MATCH THE TARGET COLOR!
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/">
              <Button variant="secondary">← BACK TO MENU</Button>
            </Link>
            <Link href="/daily">
              <Button variant="default">🌟 DAILY CHALLENGE</Button>
            </Link>
          </div>
        </div>

        {/* Result Overlay */}
        {showResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4">
              <CardHeader>
                <CardTitle>🎯 YOUR RESULT!</CardTitle>
                <CardDescription>DESTRUCTION COMPLETE</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-2 border-2 border-foreground bg-muted">
                  <span className="font-black uppercase tracking-wide">
                    SCORE:
                  </span>
                  <Badge
                    variant={
                      score >= 80
                        ? "success"
                        : score >= 60
                          ? "accent"
                          : score >= 40
                            ? "secondary"
                            : "destructive"
                    }
                    className="text-2xl"
                  >
                    {score}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 border-2 border-foreground bg-muted">
                  <span className="font-black uppercase tracking-wide">
                    TIME:
                  </span>
                  <Badge variant="outline">{timer}S</Badge>
                </div>
                <div className="flex justify-between items-center p-2 border-2 border-foreground bg-muted">
                  <span className="font-black uppercase tracking-wide">
                    TARGET:
                  </span>
                  <div
                    className="w-8 h-8 border-4 border-foreground shadow-[4px_4px_0px_hsl(var(--foreground))]"
                    style={{ backgroundColor: targetColor }}
                  />
                </div>
                <div className="flex justify-between items-center p-2 border-2 border-foreground bg-muted">
                  <span className="font-black uppercase tracking-wide">
                    YOUR MIX:
                  </span>
                  <div
                    className="w-8 h-8 border-4 border-foreground shadow-[4px_4px_0px_hsl(var(--foreground))]"
                    style={{ backgroundColor: mixedResult }}
                  />
                </div>
                <Button
                  onClick={handleNewGame}
                  size="lg"
                  className="w-full mt-6"
                >
                  🎮 NEW GAME
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Target Color Card */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 TARGET COLOR</CardTitle>
              <CardDescription>MATCH THIS DESTRUCTION</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div
                className="w-32 h-32 mx-auto border-8 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))]"
                style={{ backgroundColor: targetColor }}
              />
              <p className="font-mono text-sm font-black uppercase tracking-wide">
                {targetColor}
              </p>

              {isPlaying && (
                <div className="space-y-2">
                  <Badge variant="outline" className="text-lg">
                    TIME: {timer}S
                  </Badge>
                  <Button
                    onClick={handleMixColors}
                    variant="default"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "🎨 MIXING..." : "🎨 MIX COLORS"}
                  </Button>
                </div>
              )}

              {!isPlaying && (
                <Button onClick={handleStartGame} size="lg" className="w-full">
                  🚀 START MIXING GAME
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Color Mixer Card */}
          <Card>
            <CardHeader>
              <CardTitle>🎨 COLOR MIXER</CardTitle>
              <CardDescription>DESTRUCTION LABORATORY</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color 1 */}
              <div className="space-y-3">
                <label className="block text-sm font-black uppercase tracking-wide">
                  COLOR 1
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="w-16 h-16 border-4 border-foreground shadow-[4px_4px_0px_hsl(var(--foreground))]"
                    disabled={isPlaying}
                  />
                  <input
                    type="text"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="flex-1 p-3 border-4 border-foreground bg-background font-mono font-black uppercase tracking-wide shadow-[4px_4px_0px_hsl(var(--foreground))]"
                    placeholder="#FF0000"
                    disabled={isPlaying}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black uppercase tracking-wide">
                    PROPORTION:
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={proportion1}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setProportion1(val);
                      setProportion2(100 - val);
                    }}
                    className="flex-1"
                    disabled={isPlaying}
                  />
                  <Badge variant="outline" className="w-16 text-center">
                    {proportion1}%
                  </Badge>
                </div>
              </div>

              {/* Color 2 */}
              <div className="space-y-3">
                <label className="block text-sm font-black uppercase tracking-wide">
                  COLOR 2
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-16 h-16 border-4 border-foreground shadow-[4px_4px_0px_hsl(var(--foreground))]"
                    disabled={isPlaying}
                  />
                  <input
                    type="text"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="flex-1 p-3 border-4 border-foreground bg-background font-mono font-black uppercase tracking-wide shadow-[4px_4px_0px_hsl(var(--foreground))]"
                    placeholder="#0000FF"
                    disabled={isPlaying}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black uppercase tracking-wide">
                    PROPORTION:
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={proportion2}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setProportion2(val);
                      setProportion1(100 - val);
                    }}
                    className="flex-1"
                    disabled={isPlaying}
                  />
                  <Badge variant="outline" className="w-16 text-center">
                    {proportion2}%
                  </Badge>
                </div>
              </div>

              {/* Mixed Result Preview */}
              {!isPlaying && (
                <div className="space-y-3">
                  <label className="block text-sm font-black uppercase tracking-wide">
                    MIXED RESULT PREVIEW
                  </label>
                  <div className="text-center">
                    <div
                      className="w-32 h-32 mx-auto border-8 border-foreground shadow-[8px_8px_0px_hsl(var(--foreground))]"
                      style={{
                        backgroundColor: mixColors(
                          color1,
                          color2,
                          proportion1,
                          proportion2,
                        ),
                      }}
                    />
                    <p className="font-mono text-sm mt-2 font-black uppercase tracking-wide">
                      {mixColors(color1, color2, proportion1, proportion2)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🎯 HOW TO PLAY</CardTitle>
            <CardDescription>DESTRUCTION INSTRUCTIONS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm font-mono">
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="min-w-6 text-center">
                  1
                </Badge>
                <p className="font-black uppercase tracking-wide">
                  LOOK AT THE TARGET COLOR YOU NEED TO CREATE
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="min-w-6 text-center">
                  2
                </Badge>
                <p className="font-black uppercase tracking-wide">
                  CHOOSE TWO COLORS TO MIX TOGETHER
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="min-w-6 text-center">
                  3
                </Badge>
                <p className="font-black uppercase tracking-wide">
                  ADJUST THE PROPORTIONS OF EACH COLOR
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="min-w-6 text-center">
                  4
                </Badge>
                <p className="font-black uppercase tracking-wide">
                  MIX THE COLORS AND SEE HOW CLOSE YOU GET!
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="min-w-6 text-center">
                  5
                </Badge>
                <p className="font-black uppercase tracking-wide">
                  FASTER COMPLETION TIME GIVES BONUS POINTS
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/daily">
              <Button variant="default">🌟 DAILY CHALLENGE</Button>
            </Link>
            <Link href="/party">
              <Button variant="secondary">🎉 PARTY MODE</Button>
            </Link>
            <Link href="/practice">
              <Button variant="secondary">🎯 PRACTICE MODE</Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="p-4 border-4 border-foreground bg-muted shadow-[8px_8px_0px_hsl(var(--foreground))]">
            <p className="text-sm font-mono font-black uppercase tracking-wide">
              💡 <strong>TIP:</strong> USE THE PREVIEW TO SEE HOW YOUR COLOR MIX
              WILL LOOK BEFORE SUBMITTING!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
