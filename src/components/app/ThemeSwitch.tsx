"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function ThemeSwitch({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // do hydratacji: przed montażem nie pokazuj stanu zależnego od klienta
  if (!mounted) {
    return (
      <div className={cn("relative inline-flex items-center", className)}>
        <div
          aria-hidden
          className="h-6 w-11 rounded-full border border-border bg-input"
        />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      {/* IKONY nie łapią klików */}
      <Sun
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 z-10 transition-opacity text-primary",
          isDark ? "opacity-0" : "opacity-90"
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 z-10 transition-opacity text-primary",
          isDark ? "opacity-90" : "opacity-0"
        )}
      />

      <Switch
        checked={isDark}
        onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
        aria-label="Toggle theme"
        className={cn(
          "relative z-0 h-6 w-10.5 border",
          "data-[state=unchecked]:bg-input data-[state=checked]:bg-primary",
          "border-border focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "[&>span]:bg-background [&>span]:shadow"
        )}
      />
    </div>
  );
}
