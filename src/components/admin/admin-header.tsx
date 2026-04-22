"use client";

import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { NotificationBell } from "@/components/layout/notification-bell";

/**
 * Sticky header for the admin portal content area.
 * Contains sidebar trigger + breadcrumb on left, actions on right.
 * Glassmorphism backdrop-blur style for premium feel.
 */
export function AdminHeader() {
  return (
    <header
      id="admin-header"
      className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6"
    >
      {/* Left: sidebar trigger + breadcrumbs */}
      <BreadcrumbNav showSidebarTrigger={true} />

      {/* Right: action buttons */}
      <div className="flex items-center gap-1">
        <NotificationBell count={3} />
      </div>
    </header>
  );
}
