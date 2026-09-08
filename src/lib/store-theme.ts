import type { PageBlock } from './management-api';

export function resolveStoreTheme(saved: unknown, blocks: readonly PageBlock[]): 'light' | 'dark' | 'system' {
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  const configured = (blocks.find((block) => block.type === 'appearance' && block.enabled) ?? blocks.find((block) => block.type === 'hero' && block.enabled))?.content.defaultTheme;
  return configured === 'light' || configured === 'dark' ? configured : 'system';
}
