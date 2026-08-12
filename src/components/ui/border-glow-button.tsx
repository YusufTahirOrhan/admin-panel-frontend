"use client";

import React from "react";
import { BorderGlow } from "./border-glow";
import { cn } from "@/lib/utils";

interface BorderGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function BorderGlowButton({
  children,
  className,
  disabled,
  onClick,
  type = "button",
  ...props
}: BorderGlowButtonProps) {
  return (
    <BorderGlow
      borderRadius={10}
      edgeSensitivity={30}
      glowRadius={25}
      glowIntensity={1.2}
      backgroundColor="#059669"
      colors={["#34d399", "#14b8a6", "#38bdf8"]}
      className={cn("inline-flex h-10 transition-transform active:scale-95 disabled:opacity-50", className)}
    >
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className="flex h-full w-full items-center justify-center gap-2 px-5 py-2 text-sm font-bold text-white transition-colors hover:text-white focus:outline-none"
        {...props}
      >
        {children}
      </button>
    </BorderGlow>
  );
}
