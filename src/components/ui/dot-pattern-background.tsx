"use client";

import { cn } from "@/lib/utils";

interface DotPatternBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function DotPatternBackground({ className, children }: DotPatternBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen w-full bg-background transition-colors duration-200", className)}>
      {/* SVG Dot Pattern Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
