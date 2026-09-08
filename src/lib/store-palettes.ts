import type { CSSProperties } from 'react';
import type { PageBlock } from './management-api';

export const storePalettes = {
  forest: { name: 'Orman', description: 'Doğal yeşil ve sıcak beyaz', light: ['#202522','#626963','#275b4b','#fcfcfa','#ffffff','#f3f3ee','#dce3dd','#e8ece7','#203e33'], dark: ['#edf3ee','#acbcb2','#9bd4b7','#101a16','#192720','#14221b','#35483d','#30483a','#234b39'] },
  ocean: { name: 'Gece mavisi', description: 'Derin mavi ve serin gri', light: ['#192738','#53677b','#245b91','#fafcfe','#ffffff','#eef3f8','#d4dfeb','#dde8f4','#203e61'], dark: ['#edf4fd','#a9bed6','#9ccafb','#101923','#182636','#142030','#344a64','#2c4663','#23486d'] },
  clay: { name: 'Toprak', description: 'Kiremit, kum ve krem', light: ['#352820','#796253','#934b32','#fdfaf6','#ffffff','#f5eee5','#e6d8cb','#ebddd0','#633d2e'], dark: ['#f9eee5','#cfb7a4','#efb08c','#211813','#2f241d','#291d16','#5a4335','#624938','#663e2b'] },
  graphite: { name: 'Grafit', description: 'Siyah, gümüş ve beyaz', light: ['#252529','#64646e','#4e4e60','#fcfcfd','#ffffff','#f0f0f3','#dcdce3','#e3e3e9','#33333f'], dark: ['#f1f1f6','#b7b7c5','#c7c7e2','#17171c','#23232c','#1d1d25','#434351','#3b3b49','#3a3a4c'] },
} as const;
export type StorePalette = keyof typeof storePalettes;
export function normalizePalette(value: unknown): StorePalette {
  return typeof value === 'string' && Object.hasOwn(storePalettes, value) ? value as StorePalette : 'forest';
}
export function getStorePalette(blocks: readonly PageBlock[]): StorePalette {
  return normalizePalette(blocks.find((block) => block.type === 'appearance' && block.enabled)?.content.palette);
}
export function paletteStyle(palette: StorePalette): CSSProperties {
  const { light, dark } = storePalettes[palette];
  const keys = ['ink','muted','accent','surface','raised','soft','border','art','cta'];
  return Object.fromEntries(keys.map((key, i) => [`--store-${key}`, `light-dark(${light[i]}, ${dark[i]})`])) as CSSProperties;
}
