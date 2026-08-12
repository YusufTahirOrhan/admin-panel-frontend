"use client";

import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({ text, disabled = false, speed = 5, className }: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={cn(
        "inline-block bg-gradient-to-r from-foreground via-emerald-500 to-foreground bg-[length:200%_100%] bg-clip-text text-transparent transition-all",
        !disabled && "animate-shiny-text",
        className
      )}
      style={{
        animationDuration,
      }}
    >
      {text}
    </span>
  );
}
