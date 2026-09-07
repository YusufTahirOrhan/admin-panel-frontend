"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRef, useState } from "react";

type NavItem = { href: string; label: string };
export default function PublicHeader({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  function closeMenu() { setOpen(false); }
  return <header className="sticky top-0 z-40 border-b border-white/15 bg-slate-950 text-white" onKeyDown={(event) => {
    if (event.key === 'Escape' && open) { closeMenu(); toggleRef.current?.focus(); }
  }}>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-slate-950">İçeriğe geç</a>
    <div className="public-container flex min-h-18 items-center justify-between gap-4">
      <Link href="/" aria-label="OptiMaxx ana sayfa" className="rounded-sm text-2xl font-bold tracking-tight">OptiMaxx<span className="text-teal-300">.</span></Link>
      {items.length > 0 && <>
        <nav aria-label="Ana navigasyon" className="hidden items-center gap-1 md:flex">{items.map((item) => <a key={item.href} href={item.href} className={`inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium ${item.href === '#contact' ? 'ml-2 bg-teal-300 text-slate-950 hover:bg-teal-200' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>{item.label}</a>)}</nav>
        <button ref={toggleRef} type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'} className="flex min-h-11 items-center gap-2 rounded-lg border border-white/25 px-3 text-sm md:hidden">{open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}Menü</button>
      </>}
    </div>
    <nav id="mobile-navigation" aria-label="Mobil navigasyon" hidden={!open} className="border-t border-white/15 md:hidden"><div className="public-container grid grid-cols-2 gap-1 py-3">{items.map((item) => <a key={item.href} href={item.href} onClick={closeMenu} className="flex min-h-12 items-center rounded-lg px-3 text-sm font-medium text-slate-200 hover:bg-white/10">{item.label}</a>)}</div></nav>
  </header>;
}
