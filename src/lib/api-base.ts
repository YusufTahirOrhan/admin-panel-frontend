/**
 * Base URL for API calls. Empty means "same origin": the static site and the PHP API are
 * served from one domain (and `next dev` proxies /api/* to the PHP server).
 * Set NEXT_PUBLIC_API_URL at build time only when the API lives on another domain.
 */
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
