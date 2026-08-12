"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BorderGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  glowColor?: "emerald" | "gold" | "teal";
  className?: string;
}

export function BorderGlowButton({
  children,
  glowColor = "emerald",
  className,
  disabled,
  ...props
}: BorderGlowButtonProps) {
  const gradientMap = {
    emerald: "from-emerald-500 via-teal-400 to-emerald-600",
    gold: "from-amber-400 via-yellow-300 to-amber-500",
    teal: "from-teal-400 via-cyan-400 to-emerald-500",
  };

  return (
    <button
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-lg p-[2px] font-medium transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100 shadow-md hover:shadow-emerald-500/20",
        className
      )}
      {...props}
    >
      {/* React Bits Glowing Border Layer */}
      <span
        className={cn(
          "absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#059669_0%,#34d399_50%,#059669_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-300 animate-border-glow",
          disabled && "animate-none opacity-20"
        )}
      />

      {/* Inner Button Content */}
      <span
        className={cn(
          "inline-flex h-full w-full items-center justify-center gap-2 rounded-[6px] bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-emerald-500/90 dark:bg-emerald-700 dark:group-hover:bg-emerald-600",
          gradientMap[glowColor]
        )}
      >
        {children}
      </span>
    </button>
  );
}
