"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { guardRedirect, panelOriginRedirect, type PanelArea } from "@/lib/panel-routing";

/** Client-side route guard for /admin and /sales (was proxy.ts). */
export function PanelGuard({ area, children }: { area: PanelArea; children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const storedRole = useAuthStore((state) => state.user?.role);
  // false on the server and during hydration (so the prerendered HTML matches), then the real value.
  const hydrated = useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  const target = hydrated ? guardRedirect(area, accessToken, storedRole) : null;

  useEffect(() => {
    if (!hydrated) return;
    const external = panelOriginRedirect(window.location);
    if (external) {
      window.location.replace(external);
      return;
    }
    if (target) router.replace(target);
  }, [hydrated, target, router]);

  if (!hydrated || target) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-live="polite">
        <Loader2 aria-hidden="true" className="size-6 animate-spin text-muted-foreground" />
        <span className="sr-only">Yükleniyor…</span>
      </div>
    );
  }
  return <>{children}</>;
}

/** On /login: send already signed-in users to their dashboard. */
export function LoginRedirect() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const storedRole = useAuthStore((state) => state.user?.role);

  useEffect(() => {
    const external = panelOriginRedirect(window.location);
    if (external) {
      window.location.replace(external);
      return;
    }
    if (!accessToken) return;
    router.replace(guardRedirect("admin", accessToken, storedRole) ?? "/admin");
  }, [accessToken, storedRole, router]);

  return null;
}
