"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { useColorMixingGame } from "@/lib/useColorMixingGame";

interface ColorMixingGameProps {
  targetColor?: string; // For multiplayer mode
  onScoreSubmit?: (score: number, timeTaken: number) => void; // For multiplayer mode
  isMultiplayer?: boolean;
  disabled?: boolean;
}

interface ColorSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  colorHex: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const ColorSlider = ({
  value,
  onChange,
  label,
  colorHex,
  min = 0,
  max = 100,
  disabled = false,
}: ColorSliderProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 border-4 border-foreground shadow-[4px_4px_0px_hsl(var(--foreground))]"
              style={{ backgroundColor: colorHex }}
            />
            <span className="font-black text-sm uppercase tracking-wide">
              {label}
            </span>
          </div>
          <Badge variant="outline" className="font-mono text-lg px-4 py-2">
            {value}%
          </Badge>
        </div>

        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            disabled={disabled}
            className="w-full h-4 bg-muted border-4 border-foreground appearance-none cursor-pointer slider shadow-[4px_4px_0px_hsl(var(--foreground))] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, ${colorHex} 0%, ${colorHex} ${value}%, hsl(var(--muted)) ${value}%, hsl(var(--muted)) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-muted-foreground mt-2">
            <span>{min}%</span>
            <span>{max}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const ColorMixingGame = ({
  targetColor,
  onScoreSubmit,
  isMultiplayer = false,
  disabled = false,
}: ColorMixingGameProps = {}) => {
  // Use the color mixing game hook
  const {
    state,
    showHelp,
    targetColorHex,
    mixedColorHex,
    recentAttempts,
    stats,
    handleSliderChange,
    handleShadingChange,
    handleMix,
    handleReset,
    handleNewChallenge,
    toggleHelp,
    getColorHex,
  } = useColorMixingGame({
    isMultiplayer,
    targetColor,
    onScoreSubmit,
  });

  const handleBackToMenu = () => {
    window.location.href = "/";
  };

  const getScoreCategory = (score: number) => {
    if (score >= 90) return { text: "PERFECT", variant: "success" as const };
    if (score >= 80) return { text: "EXCELLENT", variant: "success" as const };
    if (score >= 70) return { text: "GREAT", variant: "accent" as const };
    if (score >= 60) return { text: "GOOD", variant: "secondary" as const };
    if (score >= 40) return { text: "OKAY", variant: "warning" as const };
    return { text: "KEEP TRYING", variant: "destructive" as const };
  };

  if (!state.currentChallenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="font-black text-4xl uppercase tracking-wide mb-4">
            LOADING CHALLENGE...
          </div>
          <div className="w-16 h-16 border-8 border-foreground animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 font-mono">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-4">
            🎨 COLOR
            <br />
            <span className="text-accent">MIXING</span>
          </h1>
          <p className="font-black text-xl uppercase tracking-wide text-muted-foreground mb-4">
            MIX COLORS TO MATCH THE TARGET
          </p>
          <div className="flex justify-center items-center space-x-4 font-bold text-sm uppercase tracking-wide">
            <Badge variant="outline">ATTEMPTS: {stats.totalAttempts}</Badge>
            {state.startTime && state.isPlaying && (
              <Badge variant="accent">⏱️ {state.timer}s</Badge>
            )}
          </div>
        </div>

        {/* Top Bar */}
        <div className="flex justify-between items-center">
          {!isMultiplayer && (
            <Button onClick={handleBackToMenu} variant="outline" size="sm">
              ← BACK TO MENU
            </Button>
          )}

          <Button onClick={toggleHelp} variant="secondary" size="sm">
            💡 {showHelp ? "HIDE" : "SHOW"} SOLUTION
          </Button>
        </div>

        {/* Color Display Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Target Color */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 TARGET COLOR</CardTitle>
              <CardDescription>MATCH THIS EXACT COLOR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div
                  className="w-full h-48 border-8 border-foreground shadow-[16px_16px_0px_hsl(var(--foreground))]"
                  style={{ backgroundColor: targetColorHex }}
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-background/90">
                    {targetColorHex}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mixed Color */}
          <Card>
            <CardHeader>
              <CardTitle>🧪 YOUR MIX</CardTitle>
              <CardDescription>CURRENT MIXTURE RESULT</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div
                  className="w-full h-48 border-8 border-foreground shadow-[16px_16px_0px_hsl(var(--foreground))]"
                  style={{ backgroundColor: mixedColorHex }}
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-background/90">
                    {mixedColorHex}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Sliders Section */}
        <Card>
          <CardHeader>
            <CardTitle>🎛️ MIXING CONTROLS</CardTitle>
            <CardDescription>
              ADJUST THESE COLORS TO CREATE YOUR MIX
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary Color 1 */}
              <ColorSlider
                value={state.colorPercentages.color1.percentage}
                onChange={(value) => handleSliderChange("color1", value)}
                label={state.colorPercentages.color1.label}
                colorHex={getColorHex(
                  state.colorPercentages.color1.color.r,
                  state.colorPercentages.color1.color.g,
                  state.colorPercentages.color1.color.b,
                )}
                disabled={disabled}
              />

              {/* Primary Color 2 */}
              <ColorSlider
                value={state.colorPercentages.color2.percentage}
                onChange={(value) => handleSliderChange("color2", value)}
                label={state.colorPercentages.color2.label}
                colorHex={getColorHex(
                  state.colorPercentages.color2.color.r,
                  state.colorPercentages.color2.color.g,
                  state.colorPercentages.color2.color.b,
                )}
                disabled={disabled}
              />

              {/* Distractor Color */}
              <ColorSlider
                value={state.colorPercentages.distractor.percentage}
                onChange={(value) => handleSliderChange("distractor", value)}
                label={state.colorPercentages.distractor.label}
                colorHex={getColorHex(
                  state.colorPercentages.distractor.color.r,
                  state.colorPercentages.distractor.color.g,
                  state.colorPercentages.distractor.color.b,
                )}
                disabled={disabled}
              />

              {/* White Shading */}
              <ColorSlider
                value={state.colorPercentages.white}
                onChange={(value) => handleShadingChange("white", value)}
                label="White"
                colorHex="#FFFFFF"
                disabled={disabled}
              />

              {/* Black Shading */}
              <ColorSlider
                value={state.colorPercentages.black}
                onChange={(value) => handleShadingChange("black", value)}
                label="Black"
                colorHex="#000000"
                disabled={disabled}
              />
            </div>

            {/* Color Palette Info */}
            <Card className="bg-muted border-4 border-foreground">
              <CardContent className="p-4">
                <h3 className="font-black text-sm uppercase tracking-wide mb-4">
                  🎨 AVAILABLE COLORS:
                </h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    {
                      color: state.colorPercentages.color1.color,
                      label: state.colorPercentages.color1.label,
                    },
                    {
                      color: state.colorPercentages.color2.color,
                      label: state.colorPercentages.color2.label,
                    },
                    {
                      color: state.colorPercentages.distractor.color,
                      label: state.colorPercentages.distractor.label,
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 border-4 border-foreground shadow-[4px_4px_0px_hsl(var(--foreground))]"
                        style={{
                          backgroundColor: getColorHex(
                            item.color.r,
                            item.color.g,
                            item.color.b,
                          ),
                        }}
                      />
                      <span className="font-bold text-sm uppercase tracking-wide">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleMix}
                variant="accent"
                size="lg"
                className="text-xl"
                disabled={disabled || state.showResults}
              >
                🎨 MIX COLORS!
              </Button>

              <Button
                onClick={handleReset}
                variant="secondary"
                size="lg"
                className="text-xl"
                disabled={disabled}
              >
                🔄 RESET
              </Button>

              {!isMultiplayer && (
                <Button
                  onClick={handleNewChallenge}
                  variant="success"
                  size="lg"
                  className="text-xl"
                >
                  🎯 NEW CHALLENGE
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {state.showResults && state.lastScore !== null && (
          <Card className="bg-accent border-accent">
            <CardHeader>
              <CardTitle className="text-accent-foreground">
                🏆 MIXING RESULTS
              </CardTitle>
              <CardDescription className="text-accent-foreground/80">
                YOUR COLOR MATCHING PERFORMANCE
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(() => {
                const scoreCategory = getScoreCategory(state.lastScore);

                return (
                  <>
                    <div className="text-center">
                      <div className="font-black text-8xl uppercase tracking-tighter leading-none mb-4 text-accent-foreground">
                        {state.lastScore}%
                      </div>
                      <Badge
                        variant={scoreCategory.variant}
                        className="text-2xl px-8 py-3"
                      >
                        {scoreCategory.text}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border-4 border-accent-foreground bg-accent-foreground/10">
                        <div className="font-black text-2xl text-accent-foreground">
                          {state.lastScore}%
                        </div>
                        <div className="font-bold text-sm uppercase tracking-wide text-accent-foreground/80">
                          MATCH
                        </div>
                      </div>
                      <div className="text-center p-4 border-4 border-accent-foreground bg-accent-foreground/10">
                        <div className="font-black text-2xl text-accent-foreground">
                          {state.timer}s
                        </div>
                        <div className="font-bold text-sm uppercase tracking-wide text-accent-foreground/80">
                          TIME
                        </div>
                      </div>
                      <div className="text-center p-4 border-4 border-accent-foreground bg-accent-foreground/10">
                        <div className="font-black text-2xl text-accent-foreground">
                          {stats.averageScore}%
                        </div>
                        <div className="font-bold text-sm uppercase tracking-wide text-accent-foreground/80">
                          AVG SCORE
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        {showHelp && (
          <Card className="bg-secondary border-secondary">
            <CardHeader>
              <CardTitle className="text-secondary-foreground">
                💡 MIXING SOLUTION
              </CardTitle>
              <CardDescription className="text-secondary-foreground/80">
                HOW TO APPROACH THIS COLOR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-secondary-foreground uppercase tracking-wide space-y-2">
                <p>
                  🎨 Start with the two main colors that best match your target
                </p>
                <p>🔧 Adjust percentages to get the right hue balance</p>
                <p>⚪ Add white to lighten if the target is bright</p>
                <p>⚫ Add black to darken if the target is deep</p>
                <p>🎯 Fine-tune with the third color for perfect matching</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* History Section */}
        {!isMultiplayer && recentAttempts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>📜 RECENT ATTEMPTS</CardTitle>
              <CardDescription>
                YOUR LAST {recentAttempts.length} MIXING ATTEMPTS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentAttempts.map((attempt, index) => (
                  <div
                    key={index}
                    className="p-4 border-4 border-foreground space-y-3"
                  >
                    <div className="flex space-x-2">
                      <div
                        className="w-12 h-12 border-4 border-foreground"
                        style={{
                          backgroundColor: getColorHex(
                            attempt.targetColor.r,
                            attempt.targetColor.g,
                            attempt.targetColor.b,
                          ),
                        }}
                      />
                      <div
                        className="w-12 h-12 border-4 border-foreground"
                        style={{
                          backgroundColor: getColorHex(
                            attempt.mixedColor.r,
                            attempt.mixedColor.g,
                            attempt.mixedColor.b,
                          ),
                        }}
                      />
                    </div>
                    <div className="font-bold text-sm uppercase tracking-wide">
                      SCORE: {attempt.matchPercentage}% | TIME:{" "}
                      {attempt.timeTaken}s
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Tip */}
        <div className="text-center">
          <Badge variant="outline" className="text-lg px-6 py-3">
            💡 TIP: MIX AVAILABLE COLORS TO MATCH THE TARGET, THEN ADJUST WITH
            WHITE/BLACK
          </Badge>
        </div>
      </div>
    </div>
  );
};
