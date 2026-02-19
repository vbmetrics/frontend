import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapPosition(pos: string): string {
  if (!pos) return "?";
  if (pos.includes("outside")) return "OH";
  if (pos.includes("middle")) return "MB";
  if (pos.includes("setter")) return "S";
  if (pos.includes("libero")) return "L";
  if (pos.includes("opposite")) return "OP";
  return pos.substring(0, 2).toUpperCase();
}