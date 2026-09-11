import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function uid(prefix = "id") { return `${prefix}_${Math.random().toString(36).slice(2, 10)}`; }
export function formatElapsed(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
export function formatClock(ms: number) { return formatElapsed(ms); }
export function average(values: number[]) { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0; }
export function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
export function wantedLabel(rank: number) { return `#${String(rank).padStart(2, "0")}`; }
