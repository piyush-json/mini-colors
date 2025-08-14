// Color Mixing SDK - Core functionality for color mixing challenges

import {
  mixColors,
  generateRandomColor,
  generateColorPalette,
  calculateDeltaE,
  calculatePercentageMatch,
  rgbToHex,
  ColorPercentages,
  ColorRGB,
} from "./color-mixing-utils";

export interface ColorMixingAttempt {
  targetColor: ColorRGB;
  mixedColor: ColorRGB;
  colorPercentages: ColorPercentages;
  timestamp: string;
  timeTaken: number;
  matchPercentage: number;
  deltaE: number;
}

export interface ColorMixingChallenge {
  id: string;
  targetColor: ColorRGB;
  palette: {
    color1: ColorRGB;
    color2: ColorRGB;
    distractor: ColorRGB;
  };
  createdAt: number;
}

export interface ColorMixingState {
  currentChallenge: ColorMixingChallenge | null;
  colorPercentages: ColorPercentages;
  mixedColor: ColorRGB;
  attempts: ColorMixingAttempt[];
  isPlaying: boolean;
  startTime: number | null;
  timer: number;
  showResults: boolean;
  lastScore: number | null;
}

export class ColorMixingSDK {
  private state: ColorMixingState;
  private listeners: Set<(state: ColorMixingState) => void>;

  constructor() {
    this.state = {
      currentChallenge: null,
      colorPercentages: {
        color1: {
          name: "",
          color: { r: 0, g: 0, b: 0 },
          label: "",
          percentage: 0,
        },
        color2: {
          name: "",
          color: { r: 0, g: 0, b: 0 },
          label: "",
          percentage: 0,
        },
        distractor: {
          name: "",
          color: { r: 0, g: 0, b: 0 },
          label: "",
          percentage: 0,
        },
        white: 0,
        black: 0,
      },
      mixedColor: { r: 255, g: 255, b: 255 },
      attempts: [],
      isPlaying: false,
      startTime: null,
      timer: 0,
      showResults: false,
      lastScore: null,
    };
    this.listeners = new Set();
  }

  // Subscribe to state changes
  subscribe(listener: (state: ColorMixingState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners of state changes
  private notify(): void {
    // Use setTimeout to avoid infinite loops during render
    setTimeout(() => {
      this.listeners.forEach((listener) => listener({ ...this.state }));
    }, 0);
  }

  // Get current state
  getState(): ColorMixingState {
    return { ...this.state };
  }

  // Generate a new color mixing challenge
  generateChallenge(targetColor?: ColorRGB): ColorMixingChallenge {
    const target = targetColor || generateRandomColor();
    const palette = generateColorPalette(target);

    const challenge: ColorMixingChallenge = {
      id: Math.random().toString(36).substr(2, 9),
      targetColor: target,
      palette: {
        color1: palette.color1.color,
        color2: palette.color2.color,
        distractor: palette.distractor.color,
      },
      createdAt: Date.now(),
    };

    this.state.currentChallenge = challenge;
    this.state.colorPercentages = {
      color1: palette.color1,
      color2: palette.color2,
      distractor: palette.distractor,
      white: 0,
      black: 0,
    };
    this.state.mixedColor = { r: 255, g: 255, b: 255 };
    this.state.showResults = false;
    this.state.lastScore = null;

    this.notify();
    return challenge;
  }

  // Start a new challenge
  startChallenge(targetColor?: ColorRGB): void {
    this.generateChallenge(targetColor);
    this.state.isPlaying = true;
    this.state.startTime = Date.now();
    this.state.timer = 0;
    this.notify();
  }

  // Update color percentages
  updateColorPercentage(
    colorType: keyof Pick<ColorPercentages, "color1" | "color2" | "distractor">,
    percentage: number,
  ): void {
    if (this.state.colorPercentages[colorType].percentage !== percentage) {
      this.state.colorPercentages[colorType].percentage = percentage;
      this.updateMixedColor();
    }
  }

  // Update shading percentages
  updateShadingPercentage(
    shadingType: "white" | "black",
    percentage: number,
  ): void {
    if (this.state.colorPercentages[shadingType] !== percentage) {
      this.state.colorPercentages[shadingType] = percentage;
      this.updateMixedColor();
    }
  }

  // Update the mixed color based on current percentages
  private updateMixedColor(): void {
    const newMixedColor = mixColors(this.state.colorPercentages);

    // Only update if the color actually changed
    if (
      newMixedColor.r !== this.state.mixedColor.r ||
      newMixedColor.g !== this.state.mixedColor.g ||
      newMixedColor.b !== this.state.mixedColor.b
    ) {
      this.state.mixedColor = newMixedColor;
      this.notify();
    }
  }

  // Submit the current mix
  submitMix(): ColorMixingAttempt | null {
    if (!this.state.currentChallenge || !this.state.startTime) return null;

    const timeTaken = Math.floor((Date.now() - this.state.startTime) / 1000);
    const deltaE = calculateDeltaE(
      this.state.currentChallenge.targetColor,
      this.state.mixedColor,
    );
    const matchPercentage = calculatePercentageMatch(deltaE);

    const attempt: ColorMixingAttempt = {
      targetColor: this.state.currentChallenge.targetColor,
      mixedColor: { ...this.state.mixedColor },
      colorPercentages: JSON.parse(JSON.stringify(this.state.colorPercentages)),
      timestamp: new Date().toISOString(),
      timeTaken,
      matchPercentage,
      deltaE,
    };

    this.state.attempts.push(attempt);
    this.state.showResults = true;
    this.state.lastScore = matchPercentage;
    this.state.isPlaying = false;

    this.notify();
    return attempt;
  }

  // Reset the current challenge
  resetChallenge(): void {
    if (!this.state.currentChallenge) return;

    const palette = generateColorPalette(
      this.state.currentChallenge.targetColor,
    );
    this.state.colorPercentages = {
      color1: { ...palette.color1, percentage: 0 },
      color2: { ...palette.color2, percentage: 0 },
      distractor: { ...palette.distractor, percentage: 0 },
      white: 0,
      black: 0,
    };
    this.state.mixedColor = { r: 255, g: 255, b: 255 };
    this.state.showResults = false;
    this.state.startTime = Date.now();
    this.state.timer = 0;
    this.state.isPlaying = true;

    this.notify();
  }

  // Update timer
  updateTimer(): void {
    if (this.state.startTime && this.state.isPlaying) {
      this.state.timer = Math.floor((Date.now() - this.state.startTime) / 1000);
      this.notify();
    }
  }

  // Get recent attempts
  getRecentAttempts(count: number = 3): ColorMixingAttempt[] {
    return this.state.attempts.slice(-count).reverse();
  }

  // Get challenge statistics
  getStats() {
    const attempts = this.state.attempts;
    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        averageTime: 0,
        perfectScores: 0,
      };
    }

    const scores = attempts.map((a) => a.matchPercentage);
    const times = attempts.map((a) => a.timeTaken);

    return {
      totalAttempts: attempts.length,
      averageScore: Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length,
      ),
      bestScore: Math.max(...scores),
      averageTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      perfectScores: scores.filter((s) => s >= 95).length,
    };
  }

  // Get score category
  getScoreCategory(score: number): {
    text: string;
    variant: "success" | "accent" | "secondary" | "warning" | "destructive";
  } {
    if (score >= 90) return { text: "PERFECT", variant: "success" };
    if (score >= 80) return { text: "EXCELLENT", variant: "success" };
    if (score >= 70) return { text: "GREAT", variant: "accent" };
    if (score >= 60) return { text: "GOOD", variant: "secondary" };
    if (score >= 40) return { text: "OKAY", variant: "warning" };
    return { text: "KEEP TRYING", variant: "destructive" };
  }

  // Convert target color to hex
  getTargetColorHex(): string {
    if (!this.state.currentChallenge) return "#000000";
    const { r, g, b } = this.state.currentChallenge.targetColor;
    return rgbToHex(r, g, b);
  }

  // Convert mixed color to hex
  getMixedColorHex(): string {
    const { r, g, b } = this.state.mixedColor;
    return rgbToHex(r, g, b);
  }

  // Load challenge from external source (for multiplayer)
  loadChallenge(targetColorHex: string): void {
    const hexToRgb = (hex: string): ColorRGB => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 255, g: 0, b: 0 };
    };

    const targetColor = hexToRgb(targetColorHex);
    this.startChallenge(targetColor);
  }
}

// Export utilities
export { rgbToHex };
export type { ColorPercentages, ColorRGB };
