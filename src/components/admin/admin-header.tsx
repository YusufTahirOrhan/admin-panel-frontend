"use client";

import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CommandPalette } from "@/components/admin/command-palette";
import { NotificationCenter } from "@/components/admin/notification-center";

/**
 * Sticky header for the admin portal content area.
 * Contains sidebar trigger + breadcrumb on left, CommandPalette + NotificationCenter + ThemeToggle on right.
 * Glassmorphism backdrop-blur style for premium feel.
 */
export function AdminHeader() {
  return (
    <header
      id="admin-header"
      className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border/80 bg-background/85 backdrop-blur-md px-4 md:px-6 transition-colors"
    >
      {/* Left: sidebar trigger + breadcrumbs */}
      <BreadcrumbNav showSidebarTrigger={true} />

      {/* Right: action buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <CommandPalette />
        <NotificationCenter />
        <ThemeToggle />
      </div>
    </header>
  );
}
