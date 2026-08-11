"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/lib/auth-service";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Settings,
  User as UserIcon,
  ChevronsUpDown,
} from "lucide-react";

/**
 * Robust User menu component with custom popover.
 * Completely eliminates third-party component crashes.
 */
export function UserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((s) => s.user);
  const getDisplayName = useAuthStore((s) => s.getDisplayName);
  const logout = useAuthStore((s) => s.logout);

  const displayName = getDisplayName();

  /** Map role to Turkish display label */
  const roleLabelMap: Record<string, string> = {
    OWNER: "Mağaza Sahibi",
    ADMIN: "Yönetici",
    STAFF: "Personel",
  };

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await authService.logout();
    } catch {
      logout();
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("optimaxx-auth-storage");
    }
    window.location.href = "/login";
  };

  /** Generate initials from display name */
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Popover Content (Opens ABOVE the trigger) ── */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-56 rounded-xl border border-sidebar-border bg-slate-900/95 p-1 text-slate-100 shadow-xl backdrop-blur-md z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex flex-col gap-1 p-3">
            <span className="text-sm font-semibold text-white">{displayName}</span>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span className="text-xs text-slate-400 truncate">
                {user?.email || "—"}
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0 bg-slate-800 text-teal-300">
                {roleLabelMap[user?.role || "STAFF"] || user?.role}
              </Badge>
            </div>
          </div>

          <div className="my-1 h-px bg-slate-800" />

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              router.push("/admin/users");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <UserIcon className="h-4 w-4 text-teal-400" />
            Kullanıcı Yönetimi
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              router.push("/admin/site-editor");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <Settings className="h-4 w-4 text-amber-400" />
            Site Editörü
          </button>

          <div className="my-1 h-px bg-slate-800" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-red-400" />
            Çıkış Yap
          </button>
        </div>
      )}

      {/* ── Trigger Button ── */}
      <button
        type="button"
        id="user-menu-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring min-w-0 cursor-pointer"
      >
        <Avatar className="h-7 w-7 shrink-0 rounded-lg border border-sidebar-border">
          <AvatarFallback className="rounded-lg bg-gradient-to-br from-[var(--brand-teal-500)] to-[var(--brand-navy-600)] text-[10px] font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
          <span className="truncate font-medium text-sidebar-foreground">
            {displayName}
          </span>
          <span className="truncate text-xs text-sidebar-foreground/60">
            {user?.email || "—"}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-sidebar-foreground/40" />
      </button>
    </div>
  );
}
