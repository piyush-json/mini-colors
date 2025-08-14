import { differenceCiede2000, converter, formatHex, formatRgb } from "culori";

const lab = converter("lab");

export interface ColorMatch {
  targetColor: string;
  capturedColor: string;
  similarity: number;
  timeScore: number;
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
   * Calculate color similarity using CIEDE2000 (more accurate than Euclidean distance)
   *
   * CIEDE2000 differences:
   * - 0-1: Imperceptible (identical colors)
   * - 1-2: Just noticeable difference
   * - 2-10: Small difference
   * - 10-50: Medium difference
   * - 50+: Large difference
   *
   * Returns: Raw CIEDE2000 difference (not normalized to 0-100)
   * Lower values = more similar colors
   */
  static calculateColorSimilarity(color1: string, color2: string): number {
    try {
      const lab1 = lab(color1);
      const lab2 = lab(color2);

      if (!lab1 || !lab2) {
        console.log("LAB conversion failed, falling back to RGB");
        return this.calculateRgbDistance(color1, color2);
      }

      const diffFn = differenceCiede2000();
      const diff = diffFn(lab1, lab2);

      console.log("CIEDE2000 difference:", diff);
      console.log(
        "RGB fallback difference:",
        this.calculateRgbDistance(color1, color2),
      );

      return diff;
    } catch (error) {
      console.log("Error in CIEDE2000 calculation:", error);
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
   * Calculate game score based on color similarity and time
   */
  static calculateScore(
    targetColor: string,
    capturedColor: string,
    startTime: number,
    endTime: number,
  ): ColorMatch {
    const timeTaken = (endTime - startTime) / 1000; // in seconds
    const ciedeDifference = this.calculateColorSimilarity(
      targetColor,
      capturedColor,
    );

    let normalizedDifference: number;

    if (ciedeDifference <= 1) {
      normalizedDifference = ciedeDifference * 10;
    } else if (ciedeDifference <= 5) {
      normalizedDifference = 10 + Math.sqrt(ciedeDifference - 1) * 15;
    } else if (ciedeDifference <= 15) {
      normalizedDifference = 40 + (ciedeDifference - 5) * 3;
    } else if (ciedeDifference <= 30) {
      normalizedDifference = 70 + Math.log(ciedeDifference - 14) * 10;
    } else {
      normalizedDifference = Math.min(
        100,
        90 + Math.log(ciedeDifference - 29) * 5,
      );
    }

    console.log("normalizedDifference", normalizedDifference);

    const maxSimilarity = 100;
    const similarityScore = Math.max(0, maxSimilarity - normalizedDifference);

    const maxTime = 30;
    const timeScore = Math.max(0, maxTime - timeTaken);

    const finalScore = Math.round(similarityScore * 0.7 + timeScore * 0.3);

    return {
      targetColor,
      capturedColor,
      similarity: Math.round(normalizedDifference),
      timeScore: Math.round(timeScore),
      finalScore,
      timeTaken: Math.round(timeTaken * 100) / 100,
    };
  }

  /**
   * Get color name suggestions based on hex value
   */
  static getColorName(hex: string): string | null {
    const colorNames: { [key: string]: string } = {
      "#ff0000": "Red",
      "#00ff00": "Green",
      "#0000ff": "Blue",
      "#ffff00": "Yellow",
      "#ff00ff": "Magenta",
      "#00ffff": "Cyan",
      "#ff8000": "Orange",
      "#8000ff": "Purple",
      "#ff0080": "Pink",
      "#80ff00": "Lime",
      "#0080ff": "Sky Blue",
      "#800080": "Purple",
      "#008080": "Teal",
      "#808000": "Olive",
    };

    return colorNames[hex.toLowerCase()] || null;
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
}
