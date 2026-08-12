"use client";

import { cn } from "@/lib/utils";

interface DotPatternBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function DotPatternBackground({ className, children }: DotPatternBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen w-full bg-background transition-colors duration-200", className)}>
      {/* Noticeable Dot Pattern Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-35"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1.2px, transparent 1.2px)`,
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
