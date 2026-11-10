/**
 * Browser-side replacement for the old Next.js proxy.ts (middleware), which a static export
 * cannot run. The API still enforces every permission; this only decides where to send
 * people so they do not see screens they cannot use.
 */

export type PanelArea = "admin" | "sales";

interface JwtPayload {
  role?: string;
  exp?: number;
}

export function parseJwt(token: string | null | undefined): JwtPayload | null {
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function roleOf(accessToken: string | null | undefined, storedRole?: string | null): string | null {
  return parseJwt(accessToken)?.role ?? storedRole ?? null;
}

export function dashboardPath(role: string | null): string {
  if (!role) return "/login";
  return role === "STAFF" ? "/sales" : "/admin";
}

/** Where a visitor of `area` should go instead, or null to stay. */
export function guardRedirect(area: PanelArea, accessToken: string | null, storedRole?: string | null): string | null {
  if (!accessToken) return "/login";
  const role = roleOf(accessToken, storedRole);
  if (area === "admin" && role && role !== "ADMIN" && role !== "OWNER") return "/sales";
  return null;
}

function configuredPanelHosts(): string[] {
  return (process.env.NEXT_PUBLIC_PANEL_HOSTNAMES ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname.endsWith(".localhost");
}

export function isPanelHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  if (configuredPanelHosts().includes(normalized)) return true;
  return ["panel", "admin"].includes(normalized.split(".")[0]);
}

/**
 * When the panel has its own subdomain (NEXT_PUBLIC_PANEL_ORIGIN), panel pages opened on the
 * public domain move there. With everything on one domain (the default) nothing happens.
 */
export function panelOriginRedirect(location: Location): string | null {
  const panelOrigin = process.env.NEXT_PUBLIC_PANEL_ORIGIN;
  if (!panelOrigin || isLocalHost(location.hostname) || isPanelHost(location.hostname)) return null;
  return new URL(`${location.pathname}${location.search}`, panelOrigin).toString();
}
