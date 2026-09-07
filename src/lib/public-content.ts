import type { PageBlock } from './management-api';

export async function fetchPublicHome(baseUrl: string, request: typeof fetch = fetch): Promise<{ blocks: PageBlock[]; unavailable: boolean }> {
  try {
    const response = await request(`${baseUrl.replace(/\/$/, '')}/api/v1/public/pages/home`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { blocks: [], unavailable: true };
    const page: unknown = await response.json();
    if (!page || typeof page !== 'object' || !('blocks' in page) || !Array.isArray(page.blocks)) return { blocks: [], unavailable: true };
    return { blocks: parsePublicBlocks(page.blocks), unavailable: false };
  } catch {
    return { blocks: [], unavailable: true };
  }
}

const sections: Record<string, { href: string; label: string }> = {
  services: { href: '#services', label: 'Hizmetler' },
  featuredProducts: { href: '#products', label: 'Ürünler' },
  brandShowcase: { href: '#brands', label: 'Markalar' },
  about: { href: '#about', label: 'Hakkımızda' },
  hours: { href: '#hours', label: 'Saatler' },
  contact: { href: '#contact', label: 'İletişim' },
};

export function parsePublicBlocks(value: unknown): PageBlock[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.filter((block): block is PageBlock => {
    if (!block || typeof block !== 'object' || block.enabled !== true ||
        !Number.isFinite(block.order) || !block.content || typeof block.content !== 'object' ||
        Array.isArray(block.content) || ![...Object.keys(sections), 'hero', 'cta', 'socialLinks'].includes(block.type)) return false;
    return true;
  }).sort((a, b) => a.order - b.order).filter((block) => {
    if (block.type === 'cta') return true;
    if (seen.has(block.type)) return false;
    seen.add(block.type);
    return true;
  });
}

export function getPublicNavigation(blocks: readonly PageBlock[]) {
  return blocks.filter((block) => block.enabled && sections[block.type]).map((block) => sections[block.type]);
}

export function safePublicHref(rawHref: string): string | null {
  const href = rawHref.trim();
  if (!href || /[\u0000-\u0020\u007f\\<>]/.test(href) || href.startsWith('//')) return null;
  if (!/^(https?:\/\/|\/|#[\w-]+$|tel:\+?[\d()-]+$|mailto:[^?]+$)/i.test(href)) return null;
  try {
    const url = new URL(href, 'https://optimaxx.com.tr');
    const path = decodeURIComponent(url.pathname).toLocaleLowerCase('tr-TR');
    if (/(^|\/)(login|admin|sales|randevu|appointment)(\/|$)/.test(path) ||
        /(^|\.)(panel|admin)\./i.test(url.hostname)) return null;
    return href;
  } catch { return null; }
}

export function isPublicCtaAllowed(label: string, href: string) {
  return Boolean(label.trim() && safePublicHref(href)) &&
    !/login|giris|giriş|admin|panel|randevu|appointment/i.test(label);
}

export function getGoogleMapsLinks(rawUrl = '', address = ''): { embedUrl: string | null; directionsUrl: string | null } {
  const search = (query: string) => ({
    embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`,
    directionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
  });
  const raw = rawUrl.trim();
  if (!raw) return address.trim() ? search(address.trim()) : { embedUrl: null, directionsUrl: null };
  const iframe = raw.match(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
  const source = (iframe?.[1] ?? raw).replace(/&amp;/g, '&');
  if (/[<>]/.test(source)) return { embedUrl: null, directionsUrl: null };
  if (!/^[a-z][a-z\d+.-]*:|^\/\//i.test(source)) return search(source);
  try {
    const url = new URL(source);
    if (url.protocol !== 'https:' || url.username || url.password) return { embedUrl: null, directionsUrl: null };
    const google = /^(www\.|maps\.)?google\.(com|com\.tr)$/.test(url.hostname);
    if (['maps.app.goo.gl', 'goo.gl'].includes(url.hostname)) {
      return { embedUrl: address.trim() ? search(address.trim()).embedUrl : null, directionsUrl: url.href };
    }
    if (!google || !url.pathname.startsWith('/maps')) return { embedUrl: null, directionsUrl: null };
    if (url.pathname.startsWith('/maps/embed')) return { embedUrl: url.href, directionsUrl: url.href };
    const query = url.searchParams.get('q') || url.searchParams.get('query') ||
      (url.pathname.match(/\/place\/([^/]+)/)?.[1] ? decodeURIComponent(url.pathname.match(/\/place\/([^/]+)/)![1]).replace(/\+/g, ' ') : '') || address.trim();
    return { embedUrl: query ? search(query).embedUrl : null, directionsUrl: url.href };
  } catch { return { embedUrl: null, directionsUrl: null }; }
}
