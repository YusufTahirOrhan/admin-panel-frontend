"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  className,
  delay = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(direction === "up" ? 0 : value);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 1200; // 1.2s ease-out count animation

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease-out quad formula
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        const current = direction === "up" ? value * easeOutProgress : value * (1 - easeOutProgress);
        
        setDisplayValue(current);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, direction, delay]);

  const formatted = displayValue.toLocaleString("tr-TR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={cn("inline-block font-mono tracking-tight transition-all", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
