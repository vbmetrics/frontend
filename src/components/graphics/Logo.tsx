// src/components/graphics/Logo.tsx
import { cn } from "@/lib/utils";

export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-primary animate-float-logo", className)}
    >
      <circle cx="12" cy="12" r="10" strokeDasharray="2 2" />
      <line x1="12" y1="6" x2="12" y2="18" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="8" y1="8" x2="16" y2="16" />
      <line x1="8" y1="16" x2="16" y2="8" />
    </svg>
  );
}
