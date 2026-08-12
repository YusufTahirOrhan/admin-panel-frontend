"use client";

import { cn } from "@/lib/utils";

interface DotPatternBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function DotPatternBackground({ className, children }: DotPatternBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen w-full bg-background transition-colors duration-200", className)}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
