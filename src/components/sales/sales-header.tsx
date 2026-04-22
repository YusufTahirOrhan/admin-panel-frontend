"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { salesNavConfig } from "@/app/(sales)/sales/_config/sales-nav-config";
import { AppLogo } from "@/components/layout/app-logo";
import { UserMenu } from "@/components/layout/user-menu";
import { LiveClock } from "@/components/sales/live-clock";
import { NotificationBell } from "@/components/layout/notification-bell";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Sales POS header with horizontal tab navigation.
 * Full-width sticky design prioritizing content real estate.
 * Mobile: tabs collapse into a sheet drawer.
 */
export function SalesHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isItemActive = (href: string) => {
    if (href === "/sales") return pathname === "/sales";
    return pathname.startsWith(href);
  };

  return (
    <header
      id="sales-header"
      className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md"
    >
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        {/* Left: Logo + Mobile hamburger */}
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menüyü aç"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <AppLogo variant="icon" />

          {/* Desktop brand text */}
          <div className="hidden md:block">
            <span className="text-base font-bold tracking-tight text-foreground">
              Opti<span className="text-[var(--brand-teal-400)]">Maxx</span>
            </span>
            <span className="ml-2 text-xs font-medium text-muted-foreground">
              POS
            </span>
          </div>
        </div>

        {/* Center: Tab navigation (desktop) */}
        <nav className="hidden md:flex items-center gap-1 mx-auto">
          {salesNavConfig.map((item) => {
            const active = isItemActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                id={`sales-tab-${item.id}`}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-[var(--brand-teal-500)]/10 text-[var(--brand-teal-500)] shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Clock + Actions */}
        <div className="flex items-center gap-3 ml-auto md:ml-0">
          <LiveClock />
          <NotificationBell />
          <div className="hidden sm:block">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* ── Mobile Sheet Menu ── */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="p-4 border-b sr-only">
            <SheetTitle>Satış Menüsü</SheetTitle>
            <SheetDescription>Satış portalı navigasyon menüsü</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-1 p-3">
            <div className="flex items-center gap-3 px-3 py-3 mb-2">
              <AppLogo variant="full" />
            </div>
            {salesNavConfig.map((item) => {
              const active = isItemActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-[var(--brand-teal-500)]/10 text-[var(--brand-teal-500)]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
