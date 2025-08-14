"use client";

import { useState, useEffect } from "react";
import { RetroButton, RetroCard, RetroColorSwatch, RetroSpinner } from "./RetroUI";
import Link from "next/link";

// Utility functions for color mixing
const mixColors = (color1: string, color2: string, proportion1: number, proportion2: number): string => {
  const total = proportion1 + proportion2;
  const ratio1 = proportion1 / total;
  const ratio2 = proportion2 / total;

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
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
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  // Calculate Euclidean distance
  const deltaR = rgb1.r - rgb2.r;
  const deltaG = rgb1.g - rgb2.g;
  const deltaB = rgb1.b - rgb2.b;

  const distance = Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB);
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
      "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff",
      "#ff8000", "#8000ff", "#00ff80", "#ff0080", "#80ff00", "#0080ff"
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
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, showResult]);

  return (
    <div className="min-h-screen retro-bg-gradient-alt p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 retro-text-gradient-secondary">
            🎨 Color Mixing Challenge
          </h1>
          <p className="text-xl text-foreground-muted">
            Mix two colors in perfect proportions to match the target color!
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

        {/* Result Overlay */}
        {showResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">🎯 Your Result!</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Score:</span>
                  <span className={`text-2xl font-bold ${
                    score >= 80 ? 'text-green-600' :
                    score >= 60 ? 'text-yellow-600' :
                    score >= 40 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {score}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Time:</span>
                  <span>{timer}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Target:</span>
                  <RetroColorSwatch color={targetColor} size="sm" />
                </div>
                <div className="flex justify-between items-center">
                  <span>Your Mix:</span>
                  <RetroColorSwatch color={mixedResult} size="sm" />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <RetroButton onClick={handleNewGame} variant="primary" size="lg" className="w-full">
                  🎮 New Game
                </RetroButton>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Target Color Card */}
          <RetroCard title="Target Color">
            <div className="text-center space-y-4">
              <RetroColorSwatch
                color={targetColor}
                size="lg"
                showHex
                className="mx-auto"
              />
              <p className="font-mono text-sm text-foreground-muted">
                {targetColor}
              </p>
              
              {isPlaying && (
                <div className="space-y-2">
                  <div className="font-mono text-sm font-bold text-foreground-muted">
                    Time: {timer}s
                  </div>
                  <RetroButton
                    onClick={handleMixColors}
                    variant="success"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <RetroSpinner className="mr-2" />
                        Mixing...
                      </span>
                    ) : (
                      "🎨 Mix Colors"
                    )}
                  </RetroButton>
                </div>
              )}

              {!isPlaying && (
                <RetroButton onClick={handleStartGame} variant="primary" size="lg" className="w-full">
                  🚀 Start Mixing Game
                </RetroButton>
              )}
            </div>
          </RetroCard>

          {/* Color Mixer Card */}
          <RetroCard title="Color Mixer">
            <div className="space-y-6">
              {/* Color 1 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Color 1
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="w-16 h-16 rounded border-2 border-gray-300"
                    disabled={isPlaying}
                  />
                  <input
                    type="text"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                    placeholder="#ff0000"
                    disabled={isPlaying}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground-muted">Proportion:</span>
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
                  <span className="text-sm font-mono w-12">{proportion1}%</span>
                </div>
              </div>

              {/* Color 2 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Color 2
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-16 h-16 rounded border-2 border-gray-300"
                    disabled={isPlaying}
                  />
                  <input
                    type="text"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                    placeholder="#0000ff"
                    disabled={isPlaying}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground-muted">Proportion:</span>
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
                  <span className="text-sm font-mono w-12">{proportion2}%</span>
                </div>
              </div>

              {/* Mixed Result Preview */}
              {!isPlaying && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">
                    Mixed Result Preview
                  </label>
                  <div className="text-center">
                    <RetroColorSwatch
                      color={mixColors(color1, color2, proportion1, proportion2)}
                      size="lg"
                      showHex
                      className="mx-auto"
                    />
                    <p className="font-mono text-sm mt-2 text-foreground-muted">
                      {mixColors(color1, color2, proportion1, proportion2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </RetroCard>
        </div>

        {/* Instructions */}
        <RetroCard title="🎯 How to Play" className="mb-6">
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">1.</span>
              <p>Look at the target color you need to create</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">2.</span>
              <p>Choose two colors to mix together</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">3.</span>
              <p>Adjust the proportions of each color</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">4.</span>
              <p>Mix the colors and see how close you get!</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">5.</span>
              <p>Faster completion time gives bonus points</p>
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
            <Link href="/practice">
              <RetroButton variant="secondary" size="md">
                🎯 Practice Mode
              </RetroButton>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-foreground-muted">
          <p>
            💡 <strong>Tip:</strong> Use the preview to see how your color mix will look before submitting!
          </p>
        </div>
      </div>
    </div>
  );
};
