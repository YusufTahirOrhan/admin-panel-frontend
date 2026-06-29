import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
  role?: string;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

function configuredPanelHosts() {
  return (process.env.PANEL_HOSTNAMES ?? process.env.NEXT_PUBLIC_PANEL_HOSTNAMES ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function isPanelHost(hostname: string) {
  const normalized = hostname.toLowerCase();
  const configured = configuredPanelHosts();
  if (configured.includes(normalized)) return true;

  const firstLabel = normalized.split(".")[0];
  return ["panel", "admin", "store"].includes(firstLabel);
}

function isPanelPath(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/admin") || pathname.startsWith("/sales");
}

function dashboardPath(accessToken?: string) {
  if (!accessToken) return "/login";
  const payload = parseJwt(accessToken);
  return payload?.role === "STAFF" ? "/sales" : "/admin";
}

function panelUrl(request: NextRequest, targetPath: string) {
  const panelOrigin = process.env.PANEL_ORIGIN ?? process.env.NEXT_PUBLIC_PANEL_ORIGIN;
  if (panelOrigin) {
    return new URL(targetPath, panelOrigin);
  }

  const hostname = request.nextUrl.hostname;
  const labels = hostname.split(".");
  const rootDomain = labels.length > 2 ? labels.slice(1).join(".") : hostname;
  const target = new URL(request.url);
  target.hostname = `store.${rootDomain}`;
  target.pathname = targetPath;
  return target;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.nextUrl.hostname;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const authenticated = Boolean(accessToken || refreshToken);
  const panelHost = isPanelHost(hostname);

  if (!isLocalHost(hostname) && !panelHost && isPanelPath(pathname)) {
    return NextResponse.redirect(panelUrl(request, `${pathname}${request.nextUrl.search}`));
  }

  if (panelHost && pathname === "/") {
    return NextResponse.redirect(new URL(dashboardPath(accessToken), request.url));
  }

  if (authenticated && pathname === "/login") {
    return NextResponse.redirect(new URL(dashboardPath(accessToken), request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!authenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (accessToken) {
      const payload = parseJwt(accessToken);
      if (payload && payload.role !== "ADMIN" && payload.role !== "OWNER") {
        return NextResponse.redirect(new URL("/sales", request.url));
      }
    }
  }

  if (pathname.startsWith("/sales") && !authenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/sales/:path*", "/login"],
};
