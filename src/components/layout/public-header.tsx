"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

export default function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a0a0c]/95 backdrop-blur-md border-b border-[#c5a880]/10 py-4 shadow-xl"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#c5a880] to-[#121214] border border-[#c5a880]/30 shadow-lg shadow-[#0a0a0c]/60 transition-transform group-hover:scale-105 duration-300">
            <svg
              viewBox="0 0 80 40"
              className="h-5 w-10 fill-none stroke-white stroke-[3]"
              aria-hidden="true"
            >
              <circle cx="20" cy="20" r="14" />
              <circle cx="60" cy="20" r="14" />
              <path d="M34 20 C37 17 43 17 46 20" />
              <path d="M6 20 L0 20" />
              <path d="M74 20 L80 20" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-wider text-white font-serif uppercase">
              Opti<span className="text-[#c5a880]">Maxx</span>
            </span>
            <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-white/50">
              Optik & Lens
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#collections"
            className="text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-[#c5a880] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#c5a880] after:transition-all hover:after:w-full"
          >
            Koleksiyonlar
          </Link>
          <Link
            href="#simulator"
            className="text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-[#c5a880] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#c5a880] after:transition-all hover:after:w-full"
          >
            Lens Simülatörü
          </Link>
          <Link
            href="#face-shape-test"
            className="text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-[#c5a880] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#c5a880] after:transition-all hover:after:w-full"
          >
            Yüz Şekli Testi
          </Link>
          <Link
            href="#services"
            className="text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-[#c5a880] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#c5a880] after:transition-all hover:after:w-full"
          >
            Hizmetlerimiz
          </Link>
          <Link
            href="#contact"
            className="text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-[#c5a880] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#c5a880] after:transition-all hover:after:w-full"
          >
            Konum & İletişim
          </Link>
        </nav>

        {/* Customer CTA Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="#contact"
            className="inline-flex h-9 items-center justify-center rounded border border-[#c5a880]/30 hover:border-[#c5a880] bg-white/5 hover:bg-[#c5a880] px-5 text-xs font-semibold tracking-widest uppercase text-white hover:text-[#0a0a0c] transition-all hover:scale-[1.03] active:scale-[0.98] gap-2"
          >
            <Phone className="h-3.5 w-3.5" />
            İletişime Geç
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
          aria-label="Menüyü Aç/Kapat"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0c] border-b border-[#c5a880]/10 px-6 py-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4">
            <Link
              href="#collections"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wider uppercase text-white/80 hover:text-[#c5a880] py-2 transition-colors border-b border-white/5"
            >
              Koleksiyonlar
            </Link>
            <Link
              href="#simulator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wider uppercase text-white/80 hover:text-[#c5a880] py-2 transition-colors border-b border-white/5"
            >
              Lens Simülatörü
            </Link>
            <Link
              href="#face-shape-test"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wider uppercase text-white/80 hover:text-[#c5a880] py-2 transition-colors border-b border-white/5"
            >
              Yüz Şekli Testi
            </Link>
            <Link
              href="#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wider uppercase text-white/80 hover:text-[#c5a880] py-2 transition-colors border-b border-white/5"
            >
              Hizmetlerimiz
            </Link>
            <Link
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wider uppercase text-white/80 hover:text-[#c5a880] py-2 transition-colors border-b border-white/5"
            >
              Konum & İletişim
            </Link>
          </nav>
          <Link
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex h-10 items-center justify-center rounded bg-[#c5a880] text-xs font-semibold tracking-wider uppercase text-[#0a0a0c] shadow-lg"
          >
            Bize Ulaşın
          </Link>
        </div>
      )}
    </header>
  );
}
