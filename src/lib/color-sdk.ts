import { differenceCiede2000, converter, formatHex, formatRgb } from "culori";
import { getDailyColorFromDate } from "./utils";
import {
  calculateDeltaE,
  calculatePercentageMatch,
  calculateFinalScore,
} from "./color-mixing-utils";

const lab = converter("lab");

export interface ColorMatch {
  targetColor: string;
  capturedColor: string;
  similarity: number;
  finalScore: number;
  timeTaken: number;
}

export interface GameState {
  isPlaying: boolean;
  targetColor: string;
  startTime: number;
  score: number;
  gameHistory: ColorMatch[];
  practiceMode: boolean;
  dailyMode: boolean;
  attempts: number;
  bestScore: number;
  gameMode: "daily" | "practice";
}

export interface DailyColorResponse {
  color: string;
  date: string;
  message: string;
}

export class ColorSDK {
  /**
   * Generate a random hex color
   */
  static generateRandomColor(): string {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  }

  /**
   * Convert hex color to RGB string
   */
  static hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Convert RGB string to hex
   */
  static rgbToHex(rgb: string): string {
    const match = rgb.match(/\d+/g);
    if (!match) return "#000000";

    const [r, g, b] = match.map(Number);
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  /**
   * Calculate color similarity using DeltaE (same as mix SDK)
   */
  static calculateColorSimilarity(color1: string, color2: string): number {
    try {
      // Convert colors to RGB
      const rgb1 = this.parseColor(color1);
      const rgb2 = this.parseColor(color2);

      if (!rgb1 || !rgb2) {
        console.log("Color parsing failed, using fallback");
        return this.calculateRgbDistance(color1, color2);
      }

      // Use the same DeltaE calculation as mix SDK
      const deltaE = calculateDeltaE(rgb1, rgb2);
      console.log("DeltaE difference:", deltaE);

      return deltaE;
    } catch (error) {
      console.log("Error in DeltaE calculation:", error);
      // Fallback to RGB distance
      return this.calculateRgbDistance(color1, color2);
    }
  }

  /**
   * Fallback RGB distance calculation
   */
  private static calculateRgbDistance(color1: string, color2: string): number {
    const rgb1 = this.parseRgb(color1);
    const rgb2 = this.parseRgb(color2);

    if (!rgb1 || !rgb2) return 100;

    const dist = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2),
    );

    // Normalize to 0-100 scale (max distance is sqrt(3 * 255^2) ≈ 441)
    return (dist / 441) * 100;
  }

  /**
   * Parse RGB string to object
   */
  private static parseRgb(
    rgb: string,
  ): { r: number; g: number; b: number } | null {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return null;

    return {
      r: parseInt(match[0]),
      g: parseInt(match[1]),
      b: parseInt(match[2]),
    };
  }

  /**
   * Parse color string (hex or RGB) to RGB object
   */
  private static parseColor(
    color: string,
  ): { r: number; g: number; b: number } | null {
    if (color.startsWith("#")) {
      // Hex color
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      if (result) {
        return {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        };
      }
    } else if (color.startsWith("rgb")) {
      // RGB color
      return this.parseRgb(color);
    }
    return null;
  }

  /**
   * Calculate game score based on color similarity and time factor
   * 85% color accuracy + 15% time factor (more time reduces score)
   */
  static calculateScore(
    targetColor: string,
    capturedColor: string,
    startTime: number,
    endTime: number,
  ): ColorMatch {
    const timeTaken = (endTime - startTime) / 1000; // in seconds

    // Convert colors to RGB objects for DeltaE calculation
    const targetRgb = this.parseColor(targetColor);
    const capturedRgb = this.parseColor(capturedColor);

    if (!targetRgb || !capturedRgb) {
      const deltaE = this.calculateColorSimilarity(targetColor, capturedColor);
      const matchPercentage = calculatePercentageMatch(deltaE);

      const finalScore = calculateFinalScore(matchPercentage, timeTaken);

      return {
        targetColor,
        capturedColor,
        similarity: Math.round(matchPercentage),
        finalScore: Math.round(finalScore),
        timeTaken: Math.round(timeTaken * 100) / 100,
      };
    }

    const deltaE = calculateDeltaE(targetRgb, capturedRgb);
    const matchPercentage = calculatePercentageMatch(deltaE);

    const finalScore = calculateFinalScore(matchPercentage, timeTaken);

    return {
      targetColor,
      capturedColor,
      similarity: Math.round(matchPercentage),
      finalScore: Math.round(finalScore),
      timeTaken: Math.round(timeTaken * 100) / 100,
    };
  }

  /**
   * Get complementary color
   */
  static getComplementaryColor(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return (
      "#" +
      (255 - r).toString(16).padStart(2, "0") +
      (255 - g).toString(16).padStart(2, "0") +
      (255 - b).toString(16).padStart(2, "0")
    );
  }

  /**
   * Fetch daily color from utils
   */
  static async fetchDailyColor(): Promise<DailyColorResponse> {
    const dailyColorData = getDailyColorFromDate();
    return {
      color: dailyColorData.color,
      date: dailyColorData.date,
      message: "Daily color retrieved successfully",
    };
  }

  /**
   * Get random practice color
   */
  static getRandomPracticeColor(): string {
    const r = Math.random() * 256;
    const g = Math.random() * 256;
    const b = Math.random() * 256;
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  }
}
