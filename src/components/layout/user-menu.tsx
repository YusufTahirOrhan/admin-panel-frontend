"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Settings,
  User as UserIcon,
  ChevronsUpDown,
} from "lucide-react";

/**
 * User menu dropdown displaying name, role badge, and actions.
 * Consumes auth store for user data and logout.
 */
export function UserMenu() {
  const router = useRouter();
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

  const handleLogout = () => {
    logout();
    // Clear tokens from storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("refreshToken");
      document.cookie = "accessToken=; path=/; max-age=0";
      document.cookie = "refreshToken=; path=/; max-age=0";
    }
    router.push("/login");
  };

  /** Generate initials from display name */
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        id="user-menu-trigger"
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      >
        <Avatar className="h-7 w-7 rounded-lg border border-sidebar-border">
          <AvatarFallback className="rounded-lg bg-gradient-to-br from-[var(--brand-teal-500)] to-[var(--brand-navy-600)] text-[10px] font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium text-sidebar-foreground">
            {displayName}
          </span>
          <span className="truncate text-xs text-sidebar-foreground/60">
            {user?.email || "—"}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto h-4 w-4 text-sidebar-foreground/40" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex flex-col gap-1 p-3">
          <span className="text-sm font-semibold">{displayName}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {user?.email || "—"}
            </span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {roleLabelMap[user?.role || "STAFF"] || user?.role}
            </Badge>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem id="user-menu-profile">
          <UserIcon className="mr-2 h-4 w-4" />
          Profil Ayarları
        </DropdownMenuItem>
        <DropdownMenuItem id="user-menu-settings">
          <Settings className="mr-2 h-4 w-4" />
          Tercihler
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          id="user-menu-logout"
          onClick={handleLogout}
          variant="destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
