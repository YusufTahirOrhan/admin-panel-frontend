"use client";

import Image from "next/image";
import { ExternalLink, X } from "lucide-react";
import { useMemo, useState } from "react";

export type BrandShowcaseItem = {
  name: string;
  description?: string;
  imageUrl?: string;
  url?: string;
};

type BrandShowcaseProps = {
  title: string;
  subtitle?: string;
  eyewearItems: BrandShowcaseItem[];
  lensItems: BrandShowcaseItem[];
};

export default function BrandShowcase({
  title,
  subtitle,
  eyewearItems,
  lensItems,
}: BrandShowcaseProps) {
  const [selectedItem, setSelectedItem] = useState<BrandShowcaseItem | null>(null);
  const hasItems = eyewearItems.length > 0 || lensItems.length > 0;

  if (!hasItems) {
    return null;
  }

  return (
    <section id="brands" className="overflow-hidden border-b bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">Markalar</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {subtitle ? <p className="mt-4 text-base leading-7 text-slate-300">{subtitle}</p> : null}
        </div>

        <div className="mt-10 space-y-5">
          <MarqueeRow label="Gözlük Markaları" items={eyewearItems} direction="left" onSelect={setSelectedItem} />
          <MarqueeRow label="Lens Markaları" items={lensItems} direction="right" onSelect={setSelectedItem} />
        </div>
      </div>

      {selectedItem ? <BrandPreview item={selectedItem} onClose={() => setSelectedItem(null)} /> : null}
    </section>
  );
}

function MarqueeRow({
  label,
  items,
  direction,
  onSelect,
}: {
  label: string;
  items: BrandShowcaseItem[];
  direction: "left" | "right";
  onSelect: (item: BrandShowcaseItem) => void;
}) {
  const displayItems = useMemo(() => [...items, ...items], [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">{label}</h3>
        <span className="text-xs text-slate-500">Kartlara tıklayın</span>
      </div>
      <div className="group relative overflow-hidden">
        <div
          className={[
            "flex w-max gap-4",
            direction === "left" ? "optimaxx-marquee-left" : "optimaxx-marquee-right",
          ].join(" ")}
        >
          {displayItems.map((item, index) => (
            <button
              key={`${item.name}-${index}`}
              type="button"
              className="grid h-32 w-64 shrink-0 grid-cols-[88px_1fr] overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] text-left transition-colors hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
              onClick={() => onSelect(item)}
            >
              <BrandThumb item={item} compact />
              <span className="min-w-0 p-4">
                <span className="block truncate text-base font-semibold text-white">{item.name}</span>
                <span className="mt-2 line-clamp-3 block text-xs leading-5 text-slate-300">
                  {item.description || "Mağaza koleksiyonunda görüntülenebilir."}
                </span>
              </span>
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-950 to-transparent" />
      </div>
    </div>
  );
}

function BrandPreview({ item, onClose }: { item: BrandShowcaseItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/75 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg border border-white/10 bg-white text-slate-950 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{item.name}</p>
            {item.description ? <p className="mt-1 text-sm text-slate-500">{item.description}</p> : null}
          </div>
          <button
            type="button"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-colors hover:bg-slate-50"
            aria-label="Önizlemeyi kapat"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
          <BrandThumb item={item} />
          <div className="p-6">
            <p className="text-sm leading-7 text-slate-600">
              {item.description || "Bu marka veya ürün için görsel ve açıklama site editöründen güncellenebilir."}
            </p>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Detaya Git
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandThumb({ item, compact = false }: { item: BrandShowcaseItem; compact?: boolean }) {
  if (item.imageUrl) {
    return (
      <div className={compact ? "relative h-full w-full bg-slate-900" : "relative min-h-72 bg-slate-100"}>
        <Image src={item.imageUrl} alt={item.name} fill unoptimized className="object-cover" sizes={compact ? "88px" : "60vw"} />
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? "grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_20%,#5eead4,transparent_30%),linear-gradient(135deg,#0f172a,#334155)]"
          : "grid min-h-72 place-items-center bg-[radial-gradient(circle_at_30%_20%,#5eead4,transparent_30%),linear-gradient(135deg,#e2e8f0,#f8fafc)]"
      }
    >
      <span className={compact ? "text-2xl font-bold text-white/90" : "text-5xl font-bold text-slate-700"}>
        {item.name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}
