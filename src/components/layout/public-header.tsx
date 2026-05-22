"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

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
          ? "bg-[#060e2f]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0d1d4a] shadow-lg shadow-[#060e2f]/40 transition-transform group-hover:scale-105 duration-300">
            <svg
              viewBox="0 0 80 40"
              className="h-5 w-10 fill-none stroke-white stroke-[3.5]"
              aria-hidden="true"
            >
              <circle cx="20" cy="20" r="14" strokeLinecap="round" />
              <circle cx="60" cy="20" r="14" strokeLinecap="round" />
              <path d="M34 20 C37 17 43 17 46 20" />
              <path d="M6 20 L0 20" strokeLinecap="round" />
              <path d="M74 20 L80 20" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight text-white">
              Opti<span className="text-[#f0c842]">Maxx</span>
            </span>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-white/60">
              Optik & Lens
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#collections"
            className="text-sm font-medium text-white/80 hover:text-[#f0c842] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#f0c842] after:transition-all hover:after:w-full"
          >
            Koleksiyonlar
          </Link>
          <Link
            href="#services"
            className="text-sm font-medium text-white/80 hover:text-[#f0c842] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#f0c842] after:transition-all hover:after:w-full"
          >
            Hizmetlerimiz
          </Link>
          <Link
            href="#face-shape-test"
            className="text-sm font-medium text-white/80 hover:text-[#f0c842] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#f0c842] after:transition-all hover:after:w-full"
          >
            Yüz Şekli Testi
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium text-white/80 hover:text-[#f0c842] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#f0c842] after:transition-all hover:after:w-full"
          >
            İletişim & Konum
          </Link>
        </nav>

        {/* Login CTA Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#d4a00e] to-[#f0c842] px-6 text-sm font-semibold text-[#060e2f] shadow-lg shadow-[#d4a00e]/25 transition-all hover:shadow-[#d4a00e]/40 hover:scale-[1.03] active:scale-[0.98] gap-1.5"
          >
            Yönetim Paneli
            <ArrowRight className="h-4 w-4" />
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#060e2f] border-b border-white/10 px-6 py-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4">
            <Link
              href="#collections"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-white/80 hover:text-[#f0c842] py-2 transition-colors border-b border-white/5"
            >
              Koleksiyonlar
            </Link>
            <Link
              href="#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-white/80 hover:text-[#f0c842] py-2 transition-colors border-b border-white/5"
            >
              Hizmetlerimiz
            </Link>
            <Link
              href="#face-shape-test"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-white/80 hover:text-[#f0c842] py-2 transition-colors border-b border-white/5"
            >
              Yüz Şekli Testi
            </Link>
            <Link
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-white/80 hover:text-[#f0c842] py-2 transition-colors border-b border-white/5"
            >
              İletişim & Konum
            </Link>
          </nav>
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#d4a00e] to-[#f0c842] px-6 text-sm font-semibold text-[#060e2f] shadow-lg shadow-[#d4a00e]/20"
          >
            Yönetim Paneli Girişi
          </Link>
        </div>
      )}
    </header>
  );
}
