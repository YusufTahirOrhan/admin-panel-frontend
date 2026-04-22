"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  /** Number of unread notifications */
  count?: number;
  className?: string;
}

/**
 * Placeholder notification bell with unread badge.
 * Will be wired to a real notifications endpoint in a later phase.
 */
export function NotificationBell({
  count = 0,
  className,
}: NotificationBellProps) {
  return (
    <Button
      id="notification-bell"
      variant="ghost"
      size="icon-sm"
      className={cn("relative", className)}
      aria-label={`Bildirimler${count > 0 ? ` (${count} okunmamış)` : ""}`}
    >
      <Bell className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Button>
  );
}
