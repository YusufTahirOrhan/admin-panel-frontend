"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  /** "full" shows icon + text, "icon" shows icon only (for collapsed sidebar) */
  variant?: "full" | "icon";
  className?: string;
}

/**
 * Shared OptiMaxx brand logo — extracted from the auth layout's spectacles SVG.
 * Reused across admin sidebar, sales header, and other portals.
 */
export function AppLogo({ variant = "full", className }: AppLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 transition-all duration-200",
        className
      )}
    >
      {/* Spectacles icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand-teal-500)] to-[var(--brand-navy-600)] shadow-lg shadow-[var(--brand-navy-900)]/40">
        <svg
          viewBox="0 0 80 40"
          className="h-4 w-8 fill-none stroke-white stroke-[3]"
          aria-hidden="true"
        >
          <circle cx="20" cy="20" r="14" strokeLinecap="round" />
          <circle cx="60" cy="20" r="14" strokeLinecap="round" />
          <path d="M34 20 C37 17 43 17 46 20" />
          <path d="M6 20 L0 20" strokeLinecap="round" />
          <path d="M74 20 L80 20" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand text — hidden in icon-only mode */}
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span className="text-base font-bold tracking-tight text-sidebar-foreground">
            Opti<span className="text-[var(--brand-teal-400)]">Maxx</span>
          </span>
          <span className="text-[10px] font-medium tracking-widest uppercase text-sidebar-foreground/50">
            Yönetim
          </span>
        </div>
      )}
    </Link>
  );
}
