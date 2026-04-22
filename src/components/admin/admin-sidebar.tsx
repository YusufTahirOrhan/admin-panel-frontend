"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { adminNavConfig } from "@/app/(admin)/admin/_config/admin-nav-config";
import { AppLogo } from "@/components/layout/app-logo";
import { UserMenu } from "@/components/layout/user-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

/**
 * Admin sidebar component.
 * Renders brand logo, role-filtered navigation groups, and user footer.
 * Uses shadcn/ui Sidebar primitives for collapsible behavior.
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";

  /**
   * Determine if a nav item is active.
   * Dashboard (/admin) is exact match; others are prefix match.
   */
  const isItemActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  /**
   * Filter nav items based on current user's role.
   */
  const filterByRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* ── Header: Brand Logo ── */}
      <SidebarHeader className="p-4 pb-2">
        <AppLogo variant={isCollapsed ? "icon" : "full"} />
      </SidebarHeader>

      <SidebarSeparator className="opacity-30" />

      {/* ── Content: Nav Groups ── */}
      <SidebarContent className="px-1 pt-2">
        {adminNavConfig.map((group) => {
          const visibleItems = group.items.filter((item) =>
            filterByRole(item.roles)
          );
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase tracking-wider text-[10px] font-semibold">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const active = isItemActive(item.href);
                    const Icon = item.icon;

                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={active}
                          tooltip={item.label}
                          render={
                            <Link href={item.href} />
                          }
                          className={
                            active
                              ? "bg-[var(--brand-navy-700)] text-[var(--brand-gold-400)] hover:bg-[var(--brand-navy-600)] hover:text-[var(--brand-gold-300)]"
                              : "text-sidebar-foreground/70 hover:bg-[var(--brand-navy-800)] hover:text-sidebar-foreground"
                          }
                        >
                          <Icon className="shrink-0" />
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto rounded-full bg-[var(--brand-gold-500)]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--brand-gold-400)]">
                              {item.badge}
                            </span>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarSeparator className="opacity-30" />

      {/* ── Footer: User Menu ── */}
      <SidebarFooter className="p-2">
        <UserMenu />
      </SidebarFooter>

      {/* ── Rail: drag edge to toggle ── */}
      <SidebarRail />
    </Sidebar>
  );
}
