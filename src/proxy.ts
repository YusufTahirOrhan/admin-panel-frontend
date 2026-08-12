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
        .join("")
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

function isLocalHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.endsWith(".localhost")
  );
}

function isPanelHost(hostname: string) {
  const normalized = hostname.toLowerCase();
  const configured = (process.env.PANEL_HOSTNAMES ?? process.env.NEXT_PUBLIC_PANEL_HOSTNAMES ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  if (configured.includes(normalized)) return true;

  const firstLabel = normalized.split(".")[0];
  return ["panel", "admin"].includes(firstLabel);
}

function isPanelPath(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/admin") || pathname.startsWith("/sales");
}

function dashboardPath(accessToken?: string) {
  if (!accessToken) return "/login";
  const payload = parseJwt(accessToken);
  return payload?.role === "STAFF" ? "/sales" : "/admin";
}

function buildPanelUrl(request: NextRequest, targetPath: string) {
  const panelOrigin = process.env.PANEL_ORIGIN ?? process.env.NEXT_PUBLIC_PANEL_ORIGIN;
  if (panelOrigin) {
    return new URL(targetPath, panelOrigin);
  }

  const hostname = request.nextUrl.hostname;
  const labels = hostname.split(".");
  const rootDomain = labels.length >= 2 ? labels.slice(-2).join(".") : hostname;
  const target = new URL(request.url);
  target.hostname = `panel.${rootDomain}`;
  target.pathname = targetPath;
  return target;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.nextUrl.hostname.toLowerCase();
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const authenticated = Boolean(accessToken || refreshToken);
  const panelHost = isPanelHost(hostname);
  const local = isLocalHost(hostname);

  // 1. If visiting panel subdomain (panel.optimaxx.com.tr) and at root path `/`,
  // redirect immediately to /login (or /admin if logged in)
  if (panelHost && pathname === "/") {
    const target = dashboardPath(accessToken);
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 2. If visiting main domain (optimaxx.com.tr) and trying to access panel paths (/login, /admin, /sales),
  // redirect immediately to panel.optimaxx.com.tr/login (or /admin)
  if (!local && !panelHost && isPanelPath(pathname)) {
    return NextResponse.redirect(buildPanelUrl(request, `${pathname}${request.nextUrl.search}`));
  }

  // 3. Login page behavior on panel domain
  if (pathname === "/login") {
    if (accessToken) {
      const target = dashboardPath(accessToken);
      if (target !== "/login") {
        return NextResponse.redirect(new URL(target, request.url));
      }
    }
    return NextResponse.next();
  }

  // 4. Protect /admin routes
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

  // 5. Protect /sales routes
  if (pathname.startsWith("/sales") && !authenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/sales/:path*", "/login"],
};
