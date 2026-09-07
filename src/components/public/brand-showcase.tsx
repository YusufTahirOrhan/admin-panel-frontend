"use client";

import Image from "next/image";
import { ArrowUpRight, Glasses } from "lucide-react";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { safePublicHref } from "@/lib/public-content";

export type BrandShowcaseItem = { name: string; description?: string; imageUrl?: string; url?: string };
export default function BrandShowcase({ title, subtitle, eyewearItems, lensItems }: { title: string; subtitle?: string; eyewearItems: BrandShowcaseItem[]; lensItems: BrandShowcaseItem[] }) {
  const [selected, setSelected] = useState<BrandShowcaseItem | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  if (!eyewearItems.length && !lensItems.length) return null;
  return <section id="brands" className="public-section bg-slate-950 text-white">
    <div className="public-container">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">Markalar</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 max-w-2xl leading-7 text-slate-300">{subtitle}</p>}
      <div className="mt-10 space-y-9">{[{ label: 'Gözlük markaları', items: eyewearItems }, { label: 'Lens markaları', items: lensItems }].filter((group) => group.items.length).map((group) => <div key={group.label}>
        <h3 className="mb-4 text-sm font-medium text-slate-300">{group.label}</h3>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{group.items.map((item, index) => <li key={`${item.name}-${index}`}>
          <button type="button" aria-haspopup="dialog" onClick={(event) => { triggerRef.current = event.currentTarget; setSelected(item); }} className="flex h-full min-h-32 w-full items-center gap-4 rounded-xl border border-white/20 bg-slate-900 p-5 text-left hover:border-teal-300 hover:bg-slate-800">
            <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-800">{item.imageUrl ? <Image src={item.imageUrl} alt="" fill sizes="56px" className="object-cover" /> : <Glasses aria-hidden="true" className="size-7 text-teal-200" strokeWidth={1.3} />}</span>
            <span className="min-w-0 flex-1"><span className="block font-semibold text-white">{item.name}</span>{item.description && <span className="mt-2 line-clamp-2 block text-sm leading-6 text-slate-300">{item.description}</span>}<span className="mt-3 block text-xs font-medium text-teal-300">Markayı incele</span></span>
            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
          </button>
        </li>)}</ul>
      </div>)}</div>
    </div>
    <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      <DialogContent finalFocus={triggerRef} className="max-w-xl">
        <DialogHeader><DialogTitle>{selected?.name}</DialogTitle><DialogDescription>{selected?.description || 'Marka bilgileri'}</DialogDescription></DialogHeader>
        {selected?.imageUrl && <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-lg bg-slate-50"><Image src={selected.imageUrl} alt={selected.name} fill sizes="560px" className="object-contain" /></div>}
        {selected?.url && safePublicHref(selected.url) && <a href={selected.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white">Marka sayfasını aç<span className="sr-only"> (yeni sekme)</span><ArrowUpRight aria-hidden="true" className="size-4" /></a>}
      </DialogContent>
    </Dialog>
  </section>;
}
