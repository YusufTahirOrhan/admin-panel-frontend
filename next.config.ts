import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.optimaxx.com.tr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "optimaxx.com.tr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.optimaxx.com.tr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "panel.optimaxx.com.tr",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
