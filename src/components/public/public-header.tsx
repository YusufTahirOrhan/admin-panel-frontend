"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { PublicThemeSelect } from "./public-theme";

type NavItem = { href: string; label: string };
export default function PublicHeader({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  function closeMenu() { setOpen(false); }
  return <header className="public-header sticky top-0 z-40" onKeyDown={(event) => {
    if (event.key === 'Escape' && open) { closeMenu(); toggleRef.current?.focus(); }
  }}>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-slate-950">İçeriğe geç</a>
    <div className="public-container flex min-h-18 items-center justify-between gap-4">
      <Link href="/" aria-label="OptiMaxx ana sayfa" className="shrink-0 whitespace-nowrap rounded-sm text-2xl font-bold tracking-tight">OptiMaxx<span className="text-teal-700">.</span></Link>
      <div className="ml-auto flex items-center gap-2">
      <PublicThemeSelect />
      {items.length > 0 && <>
        <nav aria-label="Ana navigasyon" className="hidden items-center gap-1 lg:flex">{items.map((item) => <a key={item.href} href={item.href} className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium ${item.href === '#contact' ? 'ml-2 bg-slate-950 text-white hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>{item.label}</a>)}</nav>
        <button ref={toggleRef} type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'} className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm lg:hidden">{open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}<span className="hidden min-[381px]:inline">Menü</span></button>
      </>}
      </div>
    </div>
    <nav id="mobile-navigation" aria-label="Mobil navigasyon" hidden={!open} className="border-t border-slate-200 lg:hidden"><div className="public-container grid grid-cols-2 gap-1 py-3">{items.map((item) => <a key={item.href} href={item.href} onClick={closeMenu} className="flex min-h-12 items-center rounded-full px-3 text-sm font-medium text-slate-800 hover:bg-slate-100">{item.label}</a>)}</div></nav>
  </header>;
}
