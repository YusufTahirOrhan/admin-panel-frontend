"use client";

import { useState, useEffect } from "react";

/**
 * Live clock component for POS header.
 * Shows current time in HH:mm format, updates every minute.
 * Useful for staff to track transaction timestamps.
 */
export function LiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      return now.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Set immediately
    setTime(formatTime());

    // Update every 30 seconds (no need for per-second in a POS header)
    const interval = setInterval(() => {
      setTime(formatTime());
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null; // avoid hydration mismatch

  return (
    <div className="flex items-center gap-2 text-sm tabular-nums">
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="font-medium text-foreground/80">{time}</span>
    </div>
  );
}
