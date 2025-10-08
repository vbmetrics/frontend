"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ChartContainer({
  height = 240,
  className,
  children,
}: {
  height?: number;
  className?: string;
  children: (el: HTMLDivElement, size: { width: number; height: number }) => void;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState({ width: 0, height });

  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) setSize({ width: cr.width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [height]);

  React.useEffect(() => {
    if (!ref.current || size.width === 0) return;
    children(ref.current, size);
  }, [children, size]);

  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      style={{ height }}
      aria-busy={size.width === 0}
    />
  );
}
