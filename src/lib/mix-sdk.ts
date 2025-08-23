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

  subscribe(listener: (state: ColorMixingState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    setTimeout(() => {
      this.listeners.forEach((listener) => listener({ ...this.state }));
    }, 0);
  }

  getState(): ColorMixingState {
    return { ...this.state };
  }

  private findOptimalSolution(
    targetColor: ColorRGB,
    palette: ReturnType<typeof generateColorPalette>,
  ) {
    let bestScore = 0;
    let bestSolution: ColorPercentages | null = null;

    const percentageSteps = [
      0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
      95, 100,
    ];

    for (const p1 of percentageSteps) {
      for (const p2 of percentageSteps) {
        for (const p3 of percentageSteps) {
          for (const white of percentageSteps) {
            for (const black of percentageSteps) {
              // Skip if total exceeds 100%
              if (p1 + p2 + p3 + white + black > 100) continue;

              const testPercentages: ColorPercentages = {
                color1: { ...palette.color1, percentage: p1 },
                color2: { ...palette.color2, percentage: p2 },
                distractor: { ...palette.distractor, percentage: p3 },
                white,
                black,
              };

              const mixedColor = mixColors(testPercentages);
              const deltaE = calculateDeltaE(targetColor, mixedColor);
              const matchPercentage = calculatePercentageMatch(deltaE);

              if (matchPercentage > bestScore) {
                bestScore = matchPercentage;
                bestSolution = testPercentages;
              }
            }
          }
        }
      }
    }

    if (bestSolution) {
      const mixedColor = mixColors(bestSolution);
      const deltaE = calculateDeltaE(targetColor, mixedColor);
      const matchPercentage = calculatePercentageMatch(deltaE);

      if (matchPercentage > 96) {
        console.log(
          `Found solution with score: ${matchPercentage.toFixed(2)}% for color RGB(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`,
        );
      }

      return {
        colorPercentages: bestSolution,
        mixedColor,
        matchPercentage,
        deltaE,
      };
    }

    return null;
  }

  generateChallenge(targetColor?: ColorRGB): ColorMixingChallenge {
    const fallbackColor = generateRandomColor();
    const fallbackPalette = generateColorPalette(fallbackColor);
    let challenge = {
      id: Math.random().toString(36).substr(2, 9),
      targetColor: fallbackColor,
      palette: {
        color1: fallbackPalette.color1.color,
        color2: fallbackPalette.color2.color,
        distractor: fallbackPalette.distractor.color,
      },
      createdAt: Date.now(),
    };

    if (targetColor) {
      const palette = generateColorPalette(targetColor);
      challenge = {
        id: Math.random().toString(36).substr(2, 9),
        targetColor: targetColor,
        palette: {
          color1: palette.color1.color,
          color2: palette.color2.color,
          distractor: palette.distractor.color,
        },
        createdAt: Date.now(),
      };
      const solution = this.findOptimalSolution(targetColor, palette);
      console.log(solution);
    } else {
      console.log("Generating solvable challenge...");
      let attempts = 0;
      const maxAttempts = 100;
      let foundSolvable = false;

      while (attempts < maxAttempts && !foundSolvable) {
        const randomColor = generateRandomColor();
        const palette = generateColorPalette(randomColor);

        const solution = this.findOptimalSolution(randomColor, palette);

        if (solution && solution.matchPercentage > 95) {
          challenge = {
            id: Math.random().toString(36).substr(2, 9),
            targetColor: randomColor,
            palette: {
              color1: palette.color1.color,
              color2: palette.color2.color,
              distractor: palette.distractor.color,
            },
            createdAt: Date.now(),
          };
          foundSolvable = true;
        }

        attempts++;
      }

      if (!foundSolvable) {
        const fallbackColor = generateRandomColor();
        const palette = generateColorPalette(fallbackColor);

        challenge = {
          id: Math.random().toString(36).substr(2, 9),
          targetColor: fallbackColor,
          palette: {
            color1: palette.color1.color,
            color2: palette.color2.color,
            distractor: palette.distractor.color,
          },
          createdAt: Date.now(),
        };
      }
    }

    this.state.currentChallenge = challenge;
    this.state.colorPercentages = {
      color1: {
        color: challenge.palette.color1,
        percentage: 0,
        name: "",
        label: "",
      },
      color2: {
        color: challenge.palette.color2,
        percentage: 0,
        name: "",
        label: "",
      },
      distractor: {
        color: challenge.palette.distractor,
        percentage: 0,
        name: "",
        label: "",
      },
      white: 0,
      black: 0,
    };
    this.state.mixedColor = { r: 255, g: 255, b: 255 };
    this.state.showResults = false;
    this.state.lastScore = null;

    this.notify();
    return challenge;
  }

  startChallenge(targetColor?: ColorRGB): void {
    this.generateChallenge(targetColor);
    this.state.isPlaying = true;
    this.state.startTime = Date.now();
    this.state.timer = 0;
    this.notify();
  }

  updateColorPercentage(
    colorType: keyof Pick<ColorPercentages, "color1" | "color2" | "distractor">,
    percentage: number,
  ): void {
    if (this.state.colorPercentages[colorType].percentage !== percentage) {
      this.state.colorPercentages[colorType].percentage = percentage;
      this.updateMixedColor();
    }
  }

  updateShadingPercentage(
    shadingType: "white" | "black",
    percentage: number,
  ): void {
    if (this.state.colorPercentages[shadingType] !== percentage) {
      this.state.colorPercentages[shadingType] = percentage;
      this.updateMixedColor();
    }
  }

  private updateMixedColor(): void {
    const newMixedColor = mixColors(this.state.colorPercentages);

    if (
      newMixedColor.r !== this.state.mixedColor.r ||
      newMixedColor.g !== this.state.mixedColor.g ||
      newMixedColor.b !== this.state.mixedColor.b
    ) {
      this.state.mixedColor = newMixedColor;
      this.notify();
    }
  }

  submitMix(): ColorMixingAttempt | null {
    console.log("Submitting mix...");
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
    console.log("Mix submitted:", {
      targetColor: rgbToHex(
        this.state.currentChallenge.targetColor.r,
        this.state.currentChallenge.targetColor.g,
        this.state.currentChallenge.targetColor.b,
      ),
      mixedColor: rgbToHex(
        this.state.mixedColor.r,
        this.state.mixedColor.g,
        this.state.mixedColor.b,
      ),
      matchPercentage,
      timeTaken,
    });
    return attempt;
  }

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

  updateTimer(): void {
    if (this.state.startTime && this.state.isPlaying) {
      this.state.timer = Math.floor((Date.now() - this.state.startTime) / 1000);
      this.notify();
    }
  }

  getRecentAttempts(count: number = 3): ColorMixingAttempt[] {
    return this.state.attempts.slice(-count).reverse();
  }

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

  getTargetColorHex(): string {
    if (!this.state.currentChallenge) return "#000000";
    const { r, g, b } = this.state.currentChallenge.targetColor;
    return rgbToHex(r, g, b);
  }

  getMixedColorHex(): string {
    const { r, g, b } = this.state.mixedColor;
    return rgbToHex(r, g, b);
  }

  loadChallenge(targetColorHex: string): void {
    const hslToRgb = (hsl: string): ColorRGB => {
      const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (match) {
        const h = parseInt(match[1]) / 360;
        const s = parseInt(match[2]) / 100;
        const l = parseInt(match[3]) / 100;

        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
        const g = Math.round(hue2rgb(p, q, h) * 255);
        const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

        return { r, g, b };
      }

      return hexToRgb(hsl);
    };

    const rgbStringToRgb = (rgb: string): ColorRGB => {
      // Parse RGB string like "rgb(211, 227, 76)"
      const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        return {
          r: parseInt(match[1]),
          g: parseInt(match[2]),
          b: parseInt(match[3]),
        };
      }

      return hexToRgb(rgb);
    };

    const hexToRgb = (hex: string): ColorRGB => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        const rgb = {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        };
        return rgb;
      } else {
        console.error(
          "Failed to parse hex color:",
          hex,
          "falling back to default",
        );

        return { r: 166, g: 197, b: 152 };
      }
    };

    const targetColor = targetColorHex.startsWith("hsl(")
      ? hslToRgb(targetColorHex)
      : targetColorHex.startsWith("rgb(")
        ? rgbStringToRgb(targetColorHex)
        : hexToRgb(targetColorHex);
    this.startChallenge(targetColor);
  }
}

export { rgbToHex };
export type { ColorPercentages, ColorRGB };
