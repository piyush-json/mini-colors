import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

  // Generate color based on date seed
  const seed = parseInt(dateString.replace(/-/g, ""));
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
