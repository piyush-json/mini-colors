// Color mixing utilities for the Color Mixing Challenge

// Type definitions
export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

export interface ColorLAB {
  l: number;
  a: number;
  b: number;
}

export interface ColorEntry {
  name: string;
  color: ColorRGB;
  label: string;
  percentage: number;
}

export interface ColorPercentages {
  color1: ColorEntry;
  color2: ColorEntry;
  distractor: ColorEntry;
  white: number;
  black: number;
}

// Base colors in RGB format - Enhanced for better neon color mixing
export const BASE_COLORS = {
  red: { r: 255, g: 0, b: 0 },
  yellow: { r: 255, g: 255, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
  green: { r: 0, g: 255, b: 0 },
  purple: { r: 128, g: 0, b: 128 },
  orange: { r: 255, g: 165, b: 0 },
  // CMY colors for better color mixing coverage
  cyan: { r: 0, g: 255, b: 255 },
  magenta: { r: 255, g: 0, b: 255 },
  yellow_cmy: { r: 255, g: 255, b: 0 }, // Same as yellow but for CMY system
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0, g: 0, b: 0 },
};

// Convert RGB to XYZ (using sRGB standard)
export function rgbToXyz(r: number, g: number, b: number) {
  // Normalize RGB values
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ using sRGB matrix
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  return { x: x * 100, y: y * 100, z: z * 100 };
}

// Convert XYZ to LAB
export function xyzToLab(x: number, y: number, z: number) {
  // D65 white point
  const xn = 95.047;
  const yn = 100.0;
  const zn = 108.883;

  x = x / xn;
  y = y / yn;
  z = z / zn;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);

  return { l, a, b };
}

// Convert RGB to LAB
export function rgbToLab(r: number, g: number, b: number) {
  const xyz = rgbToXyz(r, g, b);
  return xyzToLab(xyz.x, xyz.y, xyz.z);
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
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
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Calculate DeltaE (color difference)
export function calculateDeltaE(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number },
) {
  const lab1 = rgbToLab(color1.r, color1.g, color1.b);
  const lab2 = rgbToLab(color2.r, color2.g, color2.b);

  const deltaL = lab1.l - lab2.l;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;

  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
}

// Calculate percentage match from DeltaE
export function calculatePercentageMatch(deltaE: number) {
  // DeltaE of 0 = 100% match, DeltaE of 100+ = 0% match
  const maxDeltaE = 100;
  const percentage = Math.max(
    0,
    Math.min(100, 100 - (deltaE / maxDeltaE) * 100),
  );
  return Math.round(percentage);
}

// Calculate final score based on similarity and time factor
// 85% weightage on similarity, 15% weightage on time factor
export function calculateFinalScore(similarity: number, timeTaken: number) {
  // Similarity is already a percentage (0-100)
  const similarityScore = similarity;

  // Time factor calculation: less time = higher score
  // Base time of 30 seconds gives full time score
  // Every additional 10 seconds reduces time score by 10 points
  const baseTime = 30; // seconds
  const timeScore = Math.max(
    0,
    100 - Math.max(0, (timeTaken - baseTime) / 10) * 10,
  );

  // Final score: 85% similarity + 15% time factor
  const finalScore = similarityScore * 0.85 + timeScore * 0.15;

  return Math.max(0, similarity);
}

// Mix colors based on percentages
export function mixColors(colorPercentages: ColorPercentages) {
  const { color1, color2, distractor, white, black } = colorPercentages;

  // Start with black base for additive mixing
  const mixedColor = { r: 0, g: 0, b: 0 };

  // Apply additive mixing for the two main colors
  if (color1.percentage > 0) {
    const factor = color1.percentage / 100;
    const colorRGB = color1.color;

    mixedColor.r += colorRGB.r * factor;
    mixedColor.g += colorRGB.g * factor;
    mixedColor.b += colorRGB.b * factor;
  }

  if (color2.percentage > 0) {
    const factor = color2.percentage / 100;
    const colorRGB = color2.color;

    mixedColor.r += colorRGB.r * factor;
    mixedColor.g += colorRGB.g * factor;
    mixedColor.b += colorRGB.b * factor;
  }

  // Apply distractor color
  if (distractor.percentage > 0) {
    const factor = distractor.percentage / 100;
    const colorRGB = distractor.color;

    mixedColor.r += colorRGB.r * factor;
    mixedColor.g += colorRGB.g * factor;
    mixedColor.b += colorRGB.b * factor;
  }

  // White lightens the color (additive)
  if (white > 0) {
    const whiteFactor = white / 100;
    const whiteAmount = 255 * whiteFactor;
    mixedColor.r = Math.min(255, mixedColor.r + whiteAmount);
    mixedColor.g = Math.min(255, mixedColor.g + whiteAmount);
    mixedColor.b = Math.min(255, mixedColor.b + whiteAmount);
  }

  // Black darkens the color
  if (black > 0) {
    const blackFactor = black / 100;
    mixedColor.r *= 1 - blackFactor;
    mixedColor.g *= 1 - blackFactor;
    mixedColor.b *= 1 - blackFactor;
  }

  // Clamp values
  mixedColor.r = Math.max(0, Math.min(255, Math.round(mixedColor.r)));
  mixedColor.g = Math.max(0, Math.min(255, Math.round(mixedColor.g)));
  mixedColor.b = Math.max(0, Math.min(255, Math.round(mixedColor.b)));

  return mixedColor;
}

// Generate random color
export function generateRandomColor() {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
}

// Shuffle array utility
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate color palette for mixing with HSL hue matching for 99% target color accuracy
export function generateColorPalette(targetColor: ColorRGB) {
  const targetHSL = rgbToHsl(targetColor.r, targetColor.g, targetColor.b);
  const { h: targetHue } = targetHSL;

  // Enhanced available colors including CMY colors
  const availableColors = [
    { name: "red", color: BASE_COLORS.red, label: "Red" },
    { name: "yellow", color: BASE_COLORS.yellow, label: "Yellow" },
    { name: "blue", color: BASE_COLORS.blue, label: "Blue" },
    { name: "green", color: BASE_COLORS.green, label: "Green" },
    { name: "purple", color: BASE_COLORS.purple, label: "Purple" },
    // { name: "orange", color: BASE_COLORS.orange, label: "Orange" },
    // { name: "cyan", color: BASE_COLORS.cyan, label: "Cyan" },
    { name: "magenta", color: BASE_COLORS.magenta, label: "Magenta" },
  ];

  // Convert all available colors to HSL for better matching
  const availableColorsHSL = availableColors.map((color) => ({
    ...color,
    hsl: rgbToHsl(color.color.r, color.color.g, color.color.b),
  }));

  // Calculate hue distance for each color from target
  const colorsWithDistance = availableColorsHSL.map((color) => {
    let hueDistance = Math.abs(color.hsl.h - targetHue);
    // Handle hue wrapping (e.g., 350° to 10° = 20° distance, not 340°)
    if (hueDistance > 180) {
      hueDistance = 360 - hueDistance;
    }

    return {
      ...color,
      hueDistance,
      // Calculate overall color similarity score
      similarityScore: calculateColorSimilarity(targetHSL, color.hsl),
    };
  });

  // Sort colors by similarity score (higher = better match)
  colorsWithDistance.sort((a, b) => b.similarityScore - a.similarityScore);

  // Select colors based on HSL matching strategy
  let selectedColors: typeof colorsWithDistance = [];

  // Strategy 1: Try to find colors that can mix to create the target hue
  const primaryHue = targetHue;
  const complementaryHue = (targetHue + 180) % 360;

  // Find colors closest to target hue and complementary hue
  const primaryColors = colorsWithDistance
    .filter((c) => c.hueDistance < 60) // Within 60° of target
    .slice(0, 3);

  const complementaryColors = colorsWithDistance
    .filter((c) => {
      const compDistance = Math.abs(c.hsl.h - complementaryHue);
      return Math.min(compDistance, 360 - compDistance) < 60;
    })
    .slice(0, 2);

  // Strategy 2: If we don't have enough primary colors, add some from complementary
  if (primaryColors.length < 2) {
    selectedColors = [
      ...primaryColors,
      ...complementaryColors.slice(0, 2 - primaryColors.length),
    ];
  } else {
    selectedColors = primaryColors.slice(0, 2);
  }

  // Strategy 3: Add a distractor color that's different enough
  const usedHues = selectedColors.map((c) => c.hsl.h);
  const distractorCandidates = colorsWithDistance.filter(
    (c) =>
      !usedHues.some((usedHue) => {
        const distance = Math.abs(c.hsl.h - usedHue);
        return Math.min(distance, 360 - distance) < 45; // At least 45° different
      }),
  );

  if (distractorCandidates.length > 0) {
    selectedColors.push(distractorCandidates[0]);
  } else {
    // Fallback: add the least similar color
    selectedColors.push(colorsWithDistance[colorsWithDistance.length - 1]);
  }

  // Ensure we have exactly 3 colors
  while (selectedColors.length < 3) {
    const remainingColors = colorsWithDistance.filter(
      (c) => !selectedColors.includes(c),
    );
    if (remainingColors.length > 0) {
      selectedColors.push(remainingColors[0]);
    } else {
      break;
    }
  }

  // Shuffle the final selection for variety
  const shuffledColors = shuffleArray(selectedColors.slice(0, 3));

  return {
    color1: {
      name: shuffledColors[0].name,
      color: shuffledColors[0].color,
      label: shuffledColors[0].label,
      percentage: 0,
    },
    color2: {
      name: shuffledColors[1].name,
      color: shuffledColors[1].color,
      label: shuffledColors[1].label,
      percentage: 0,
    },
    distractor: {
      name: shuffledColors[2].name,
      color: shuffledColors[2].color,
      label: shuffledColors[2].label,
      percentage: 0,
    },
  };
}

// Helper function to calculate color similarity based on HSL
function calculateColorSimilarity(target: ColorHSL, source: ColorHSL): number {
  // Normalize hue distance (0-180° = 0-1)
  let hueDistance = Math.abs(target.h - source.h);
  if (hueDistance > 180) {
    hueDistance = 360 - hueDistance;
  }
  const normalizedHueDistance = hueDistance / 180;

  // Normalize saturation and lightness differences (0-100 = 0-1)
  const saturationDistance = Math.abs(target.s - source.s) / 100;
  const lightnessDistance = Math.abs(target.l - source.l) / 100;

  // Weighted similarity score (hue is most important, then saturation, then lightness)
  const hueWeight = 0.6;
  const saturationWeight = 0.25;
  const lightnessWeight = 0.15;

  const similarityScore =
    100 -
    (normalizedHueDistance * hueWeight +
      saturationDistance * saturationWeight +
      lightnessDistance * lightnessWeight) *
      100;

  return Math.max(0, similarityScore);
}

// Convert RGB to hex
export function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Convert hex to RGB
export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbOrHslToHex(color: `rgb${string}` | `hsl${string}`): string {
  if (color.startsWith("rgb")) {
    // Parse RGB values from rgb(r, g, b) or rgba(r, g, b, a) format
    const match = color.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/,
    );
    if (!match) {
      throw new Error(`Invalid RGB color format: ${color}`);
    }

    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    return rgbToHex(r, g, b);
  } else if (color.startsWith("hsl")) {
    // Parse HSL values from hsl(h, s%, l%) or hsla(h, s%, l%, a) format
    const match = color.match(
      /hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/,
    );
    if (!match) {
      throw new Error(`Invalid HSL color format: ${color}`);
    }

    const h = parseInt(match[1], 10);
    const s = parseInt(match[2], 10);
    const l = parseInt(match[3], 10);

    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  } else {
    throw new Error(`Unsupported color format: ${color}`);
  }
}
