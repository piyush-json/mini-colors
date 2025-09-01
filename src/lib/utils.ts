import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function hashString(str: string): number {
  let hash = 0;

  // Use FNV-1a hash algorithm for better distribution
  const FNV_OFFSET_BASIS = 2166136261;
  const FNV_PRIME = 16777619;

  hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * FNV_PRIME) >>> 0; // Convert to unsigned 32-bit integer
  }

  // Additional mixing with multiple rounds for better distribution
  hash ^= hash >>> 16;
  hash = (hash * 0x85ebca6b) >>> 0;
  hash ^= hash >>> 13;
  hash = (hash * 0xc2b2ae35) >>> 0;
  hash ^= hash >>> 16;

  // Extra entropy mixing for consecutive inputs
  hash = (hash ^ (hash >>> 11)) >>> 0;
  hash = (hash * 0x7feb352d) >>> 0;
  hash = (hash ^ (hash >>> 15)) >>> 0;
  hash = (hash * 0x846ca68b) >>> 0;
  hash = (hash ^ (hash >>> 16)) >>> 0;

  return Math.abs(hash);
}

export function getDailyColorFromDate(date?: Date): {
  color: string;
  date: string;
  hue: number;
  saturation: number;
  lightness: number;
} {
  // return this color 2856f5 hsl(226, 91%, 55%)

  const today = date || new Date();
  const dateString = today.toISOString().split("T")[0]; // YYYY-MM-DD format
  if (dateString === "2025-08-27") {
    return {
      color: "hsl(331, 70%, 45%)",
      date: dateString,
      hue: parseInt("331"),
      saturation: parseInt("70"),
      lightness: parseInt("45"),
    };
  }

  // Generate different seeds for each color component with additional entropy
  const hueSeed = hashString(dateString + "_hue_daily_color");
  const satSeed = hashString(dateString + "_saturation_component");
  const lightSeed = hashString(dateString + "_lightness_value");

  // Generate color components with improved ranges and better distribution
  const hue = hueSeed % 360;
  const saturation = 70 + (satSeed % 30); // Range: 70-99% for vibrant colors
  const lightness = 45 + (lightSeed % 25); // Range: 45-69% for good visibility
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return {
    color,
    date: dateString,
    hue,
    saturation,
    lightness,
  };
}

export const formatTimeTaken = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
};
