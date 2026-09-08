"use client";

import { useState } from 'react';
import { Sun, Moon, Check } from 'lucide-react';
import { storePalettes, paletteStyle, type StorePalette } from '@/lib/store-palettes';
import type { PageBlock } from '@/lib/management-api';
import { getPublicNavigation, parsePublicBlocks } from '@/lib/public-content';
import { renderBlock } from '@/components/public/public-blocks';
import { PublicThemeProvider } from '@/components/public/public-theme';
import '@/app/(public)/public.css';
import '@/app/(public)/theme.css';
import './site-appearance.css';

type Theme = 'light' | 'dark' | 'system';
export function PalettePagePreview({ blocks, palette, mode }: { blocks: PageBlock[]; palette: StorePalette; mode: Theme }) {
  const visible = parsePublicBlocks(blocks).filter((block) => block.type !== 'appearance');
  const anchors = new Set(getPublicNavigation(visible).map((item) => item.href));
  return <div className="appearance-preview-scroll" tabIndex={0} role="region" aria-label="Sayfa önizlemesi">
    <div className="appearance-content-preview">
      <PublicThemeProvider key={mode} initialTheme={mode} palette={palette}>
        {visible.length ? <div inert>{visible.map((block) => renderBlock(block, anchors))}</div> : <p className="p-6 text-sm">Önizleme için aktif bir blok ekleyin.</p>}
      </PublicThemeProvider>
    </div>
  </div>;
}
export function SiteAppearance({ blocks, palette, defaultTheme, disabled, onPaletteChange, onThemeChange }: {
  blocks: PageBlock[]; palette: StorePalette; defaultTheme: Theme; disabled: boolean;
  onPaletteChange: (value: StorePalette) => void; onThemeChange: (value: Theme) => void;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const previewBlocks = parsePublicBlocks(blocks).filter((block) => ['hero', 'services', 'featuredProducts'].includes(block.type));
  const anchors = new Set(getPublicNavigation(previewBlocks).map((item) => item.href));
  return <section className="rounded-xl border bg-card p-5 sm:p-6" aria-labelledby="site-appearance-title">
    <h2 id="site-appearance-title" className="text-lg font-semibold">Site Görünümü</h2>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Renk paletini seçin; açık ve koyu görünümü karşılaştırın. Değişiklikler taslağa kaydedilir, yalnızca “Yayınla” ile siteye uygulanır.</p>
    <fieldset disabled={disabled} className="mt-5 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <legend className="sr-only">Sitenin renk paleti</legend>
      {Object.entries(storePalettes).map(([key, item]) => <label key={key} className={`relative cursor-pointer rounded-xl border-2 p-4 transition-colors ${palette === key ? 'border-teal-600 bg-teal-500/5' : 'border-transparent bg-muted/40'} has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-500`}>
        <input type="radio" name="site-palette" value={key} checked={palette === key} onChange={() => onPaletteChange(key as StorePalette)} className="sr-only" />
        <span className="flex items-center justify-between font-semibold">{item.name}{palette === key && <Check aria-hidden="true" className="size-4 text-teal-600" />}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{item.description}</span>
        <span className="mt-4 flex gap-1.5" aria-hidden="true">{[item.light[2],item.dark[2],item.dark[3],item.light[5]].map((color) => <span key={color} className="h-6 flex-1 rounded border border-black/10" style={{background: color}} />)}</span>
      </label>)}
    </fieldset>
    <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
      {(['light','dark'] as const).map((mode) => <div key={mode} data-store-theme={mode} style={paletteStyle(palette)} className="storefront-theme appearance-sample rounded-xl border p-5">
        <p className="flex items-center gap-2 text-xs font-medium" style={{color:'var(--store-muted)'}}>{mode === 'light' ? <Sun className="size-4" /> : <Moon className="size-4" />}{mode === 'light' ? 'Açık görünüm' : 'Koyu görünüm'}</p>
        <h3 className="mt-5 text-2xl font-semibold tracking-tight">OptiMaxx</h3>
        <p className="mt-2 text-sm" style={{color:'var(--store-muted)'}}>Başlık, açıklama ve kart renkleri</p>
        <div className="mt-4 rounded-xl border p-4" style={{background:'var(--store-raised)',borderColor:'var(--store-border)'}}><span className="text-sm">Koleksiyon kartı</span><span className="mt-3 block w-fit rounded-full px-4 py-2 text-xs font-medium" style={{background:'var(--store-accent)',color:'var(--store-button-ink)'}}>Buton görünümü</span></div>
      </div>)}
    </div>
    <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
      <label className="block text-sm"><span className="mb-2 block font-medium">Varsayılan görünüm</span><select value={defaultTheme} disabled={disabled} onChange={(event) => onThemeChange(event.target.value as Theme)} className="min-h-11 rounded-lg border bg-background px-3">
        <option value="system">Ziyaretçinin sistem tercihi</option><option value="light">Açık</option><option value="dark">Koyu</option>
      </select><span className="mt-2 block text-xs text-muted-foreground">Ziyaretçinin kendi açık/koyu tercihi korunur.</span></label>
      <button type="button" aria-expanded={showPreview} aria-controls="palette-content-preview" onClick={() => setShowPreview(!showPreview)} className="min-h-11 rounded-lg border px-4 text-sm font-medium hover:bg-muted">{showPreview ? 'İçerik önizlemesini kapat' : 'İçeriğimle önizle'}</button>
    </div>
    {showPreview && <div id="palette-content-preview" className="mt-6 grid gap-4 lg:grid-cols-2">
      {(['light','dark'] as const).map((mode) => <div key={mode} className="min-w-0"><p className="mb-2 text-sm font-medium">{mode === 'light' ? 'Açık' : 'Koyu'} · İlk ekran ve koleksiyonlar</p>
        <div className="appearance-preview-scroll" tabIndex={0} role="region" aria-label={`${mode === 'light' ? 'Açık' : 'Koyu'} içerik önizlemesi`}>
          <div data-store-theme={mode} style={paletteStyle(palette)} className="storefront-theme public-site appearance-content-preview">
            {previewBlocks.length ? <div inert>{previewBlocks.map((block) => renderBlock(block, anchors))}</div> : <p className="p-6 text-sm">Önizleme için aktif Hero, Hizmetler veya Ürünler bloğu ekleyin.</p>}
          </div>
        </div>
      </div>)}
    </div>}
  </section>;
}
