"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(timer);
}
function getTime() {
  return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export function LiveClock() {
  const time = useSyncExternalStore(subscribe, getTime, () => '--:--');
  return <div className="flex items-center gap-2 text-sm tabular-nums"><span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" /><span className="font-medium text-foreground/80">{time}</span></div>;
}
