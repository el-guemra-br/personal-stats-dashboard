import { format, formatDistanceToNow } from "date-fns";
import type { ActivityLevel } from "./types";

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatFullNumber(value: number): string {
  return new Intl.NumberFormat("en").format(value);
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "PPpp");
}

export function formatShortDate(iso: string): string {
  return format(new Date(iso), "MMM d");
}

export function formatRelativeTime(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function levelFromValue(value: number, highThreshold: number, moderateThreshold: number): ActivityLevel {
  if (value >= highThreshold) {
    return "high";
  }

  if (value >= moderateThreshold) {
    return "moderate";
  }

  return "low";
}

export function levelClasses(level: ActivityLevel): string {
  if (level === "high") {
    return "border-emerald-400/70 bg-emerald-500/10";
  }

  if (level === "moderate") {
    return "border-amber-400/70 bg-amber-500/10";
  }

  return "border-rose-400/70 bg-rose-500/10";
}

export function safeDivide(value: number, divisor: number): number {
  if (divisor === 0) {
    return 0;
  }

  return value / divisor;
}
