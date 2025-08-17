import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple hash function for consistent pseudo-random generation
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function getDailyColorFromDate(date?: Date): {
  color: string;
  date: string;
  hue: number;
  saturation: number;
  lightness: number;
} {
  const today = date || new Date();
  const dateString = today.toISOString().split("T")[0]; // YYYY-MM-DD format

  // Generate color based on hashed date seed
  const seed = hashString(dateString);
  const hue = seed % 360;
  const saturation = 70 + (seed % 30);
  const lightness = 40 + (seed % 20);
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return {
    color,
    date: dateString,
    hue,
    saturation,
    lightness,
  };
}
