"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "indigo" | "blue" | "green" | "red";
const ACCENTS: Accent[] = ["indigo", "blue", "green", "red"];
const STORAGE_KEY = "vbm_accent";

const SWATCH_BG: Record<Accent, string> = {
  indigo: "bg-indigo-600 dark:bg-indigo-500",
  blue: "bg-blue-600 dark:bg-blue-500",
  green: "bg-green-600 dark:bg-green-500",
  red: "bg-red-600 dark:bg-red-500",
};

function readAccent(): Accent {
  if (typeof document !== "undefined") {
    const fromDom = document.documentElement.dataset.accent as Accent | undefined;
    if (fromDom && ACCENTS.includes(fromDom)) return fromDom;
  }
  if (typeof window !== "undefined") {
    const fromStorage = window.localStorage.getItem(STORAGE_KEY) as Accent | null;
    if (fromStorage && ACCENTS.includes(fromStorage)) return fromStorage;
  }
  return "indigo";
}

function applyAccent(next: Accent) {
  document.documentElement.dataset.accent = next;
  window.localStorage.setItem(STORAGE_KEY, next);
}

export function AccentPicker({ className }: { className?: string }) {
  const [accent, setAccent] = React.useState<Accent>(() => readAccent());

  // zsynchronizuj po montażu (SSR → CSR)
  React.useEffect(() => {
    setAccent(readAccent());
  }, []);

  // stosuj zmianę akcentu w DOM + localStorage
  React.useEffect(() => {
    applyAccent(accent);
  }, [accent]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {ACCENTS.map((a) => {
        const active = a === accent;
        return (
          <button
            key={a}
            type="button"
            aria-pressed={active}
            aria-label={`Set accent ${a}`}
            title={a}
            onClick={() => setAccent(a)}
            className={cn(
              "relative size-8 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              SWATCH_BG[a],
              active && "ring-2 ring-primary/70"
            )}
          >
            {active && (
              <Check className="absolute inset-0 m-auto size-4 text-white dark:text-black" />
            )}
          </button>
        );
      })}
    </div>
  );
}
