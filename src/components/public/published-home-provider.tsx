"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { PageBlock } from "@/lib/management-api";
import { getPublishedHome } from "@/lib/published-home";
import { resolveStoreTheme } from "@/lib/store-theme";
import { getStorePalette } from "@/lib/store-palettes";
import { dashboardPath, isPanelHost, roleOf } from "@/lib/panel-routing";
import { useAuthStore } from "@/stores/auth-store";
import { PublicThemeProvider } from "./public-theme";
import PublicLoading from "@/app/(public)/loading";

interface PublishedHome {
  blocks: PageBlock[];
  unavailable: boolean;
}

const PublishedHomeContext = createContext<PublishedHome>({ blocks: [], unavailable: false });
export const usePublishedHome = () => useContext(PublishedHomeContext);

function savedThemeCookie(): string | undefined {
  return document.cookie
    .split("; ")
    .find((part) => part.startsWith("optimaxx-store-theme="))
    ?.split("=")[1];
}

/**
 * Loads the published homepage once in the browser and shares it with the theme and the page.
 * (On the Node.js build this happened on the server; a static export has no server.)
 */
export function PublishedHomeProvider({ children }: { children: React.ReactNode }) {
  const [home, setHome] = useState<PublishedHome | null>(null);

  useEffect(() => {
    // The panel subdomain's root goes straight to the panel (was proxy.ts).
    if (isPanelHost(window.location.hostname) && window.location.pathname === "/") {
      const { accessToken, user } = useAuthStore.getState();
      window.location.replace(accessToken ? dashboardPath(roleOf(accessToken, user?.role)) : "/login");
      return;
    }
    let active = true;
    getPublishedHome().then((result) => {
      if (active) setHome(result);
    });
    return () => {
      active = false;
    };
  }, []);

  if (home === null) {
    return <PublicLoading />;
  }

  return (
    <PublishedHomeContext value={home}>
      <PublicThemeProvider initialTheme={resolveStoreTheme(savedThemeCookie(), home.blocks)} palette={getStorePalette(home.blocks)}>
        {children}
      </PublicThemeProvider>
    </PublishedHomeContext>
  );
}
