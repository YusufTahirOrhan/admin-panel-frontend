"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollToPlugin);

export default function PublicHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!headerRef.current) return;

      const navElements = navItemsRef.current
        ? Array.from(navItemsRef.current.children)
        : [];

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        logoRef.current,
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      );

      if (navElements.length > 0) {
        tl.fromTo(
          navElements,
          { y: -15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
          "-=0.6"
        );
      }
    },
    { scope: headerRef }
  );

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 70 },
          ease: "power3.inOut",
        });
      }
    }
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <Link
          ref={logoRef}
          href="/"
          className="group flex items-center gap-2"
        >
          <span className="text-xl font-extrabold tracking-tight text-white transition-colors group-hover:text-teal-300">
            OptiMaxx
          </span>
        </Link>

        <nav ref={navItemsRef} className="hidden items-center gap-1 text-sm font-medium sm:flex">
          <a
            href="#services"
            onClick={(e) => handleNavClick(e, "#services")}
            className="rounded-lg px-3.5 py-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          >
            Hizmetler
          </a>
          <a
            href="#products"
            onClick={(e) => handleNavClick(e, "#products")}
            className="rounded-lg px-3.5 py-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          >
            Ürünler
          </a>
          <a
            href="#brands"
            onClick={(e) => handleNavClick(e, "#brands")}
            className="rounded-lg px-3.5 py-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          >
            Markalar
          </a>
          <a
            href="#hours"
            onClick={(e) => handleNavClick(e, "#hours")}
            className="rounded-lg px-3.5 py-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          >
            Saatler
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="ml-2 inline-flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 px-4 text-sm font-bold text-slate-950 transition-all hover:shadow-lg hover:shadow-teal-500/20 hover:scale-105"
          >
            İletişim
          </a>
        </nav>
      </div>
    </header>
  );
}
