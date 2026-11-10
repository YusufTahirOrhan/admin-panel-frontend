import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/*
 * Production: a static export (`out/`) that any web host can serve; the PHP backend in
 * spring-boot-admin-panel-project/php-backend answers /api/* on the same domain.
 * Development: `next dev` proxies /api/* to the local PHP server (BACKEND_DEV_URL).
 */
const images: NextConfig["images"] = {
  unoptimized: true,
  remotePatterns: [
    { protocol: "https", hostname: "api.optimaxx.com.tr", pathname: "/**" },
    { protocol: "https", hostname: "optimaxx.com.tr", pathname: "/**" },
    { protocol: "https", hostname: "www.optimaxx.com.tr", pathname: "/**" },
    { protocol: "https", hostname: "panel.optimaxx.com.tr", pathname: "/**" },
    { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    { protocol: "https", hostname: "**" },
    { protocol: "http", hostname: "localhost" },
    { protocol: "http", hostname: "127.0.0.1" },
  ],
};

export default function config(phase: string): NextConfig {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    const backend = process.env.BACKEND_DEV_URL ?? "http://localhost:8080";
    return {
      images,
      turbopack: { root: __dirname },
      async rewrites() {
        return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }];
      },
    };
  }
  return {
    output: "export",
    images,
    turbopack: { root: __dirname },
  };
}
