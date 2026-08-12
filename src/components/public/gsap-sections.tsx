"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BorderGlow from "@/components/ui/border-glow";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. HERO SECTION GSAP COMPONENT
// ==========================================
interface GsapHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  highlights: string[];
  imageUrl: string;
  primaryButton?: { label: string; href: string } | null;
  secondaryButton?: { label: string; href: string } | null;
}

export function GsapHero({
  eyebrow,
  title,
  subtitle,
  imageUrl,
  primaryButton,
  secondaryButton,
}: GsapHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);

  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );

      tl.fromTo(
        headingRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4"
      );

      tl.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.65"
      );

      if (ctaContainerRef.current) {
        const buttons = Array.from(ctaContainerRef.current.children);
        tl.fromTo(
          buttons,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          "-=0.5"
        );
      }

      if (svgPathRef.current) {
        const pathLength = svgPathRef.current.getTotalLength();
        gsap.set(svgPathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(svgPathRef.current, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: "power2.inOut",
          delay: 0.3,
        });
      }

      if (statsContainerRef.current) {
        const statsObj = { count1: 0, count2: 0, count3: 0 };
        gsap.to(statsObj, {
          count1: 500,
          count2: 10,
          count3: 50,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsContainerRef.current,
            start: "top 90%",
            once: true,
          },
          onUpdate: () => {
            if (stat1Ref.current) stat1Ref.current.innerText = Math.round(statsObj.count1).toString();
            if (stat2Ref.current) stat2Ref.current.innerText = Math.round(statsObj.count2).toString();
            if (stat3Ref.current) stat3Ref.current.innerText = Math.round(statsObj.count3).toString();
          },
        });
      }

      if (marqueeTrackRef.current) {
        const marqueeTrack = marqueeTrackRef.current;
        const loopTimeline = gsap.to(marqueeTrack, {
          xPercent: -50,
          ease: "none",
          duration: 25,
          repeat: -1,
        });

        const marqueeEl = marqueeContainerRef.current;
        if (marqueeEl) {
          const handleMouseEnter = () => {
            gsap.to(loopTimeline, { timeScale: 0.3, duration: 0.5, ease: "power1.out" });
          };
          const handleMouseLeave = () => {
            gsap.to(loopTimeline, { timeScale: 1.0, duration: 0.5, ease: "power1.out" });
          };
          marqueeEl.addEventListener("mouseenter", handleMouseEnter);
          marqueeEl.addEventListener("mouseleave", handleMouseLeave);
        }
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef }
  );

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const lenis = (window as any).lenis;
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.6 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const handlePrimaryButtonMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.03,
      y: -2,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handlePrimaryButtonMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.0,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const marqueeBrandsList = [
    "Ray-Ban",
    "Persol",
    "Vogue Eyewear",
    "Oakley",
    "Acuvue",
    "Air Optix",
    "Biofinity",
    "Essilor",
    "Zeiss",
    "Hoya",
  ];

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid min-h-[80vh] max-w-6xl content-center gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <p
            ref={badgeRef}
            className="inline-block text-sm font-semibold uppercase tracking-[0.2em] text-teal-300"
          >
            {eyebrow || "Mahallenizin modern optik mağazası"}
          </p>

          <h1
            ref={headingRef}
            className="max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {title || "OptiMaxx Optik"}
          </h1>

          <p
            ref={subtitleRef}
            className="max-w-2xl text-lg leading-8 text-slate-300"
          >
            {subtitle || "Göz sağlığınız, net görüş ve stiliniz için modern optik çözümler."}
          </p>

          {(primaryButton || secondaryButton) && (
            <div ref={ctaContainerRef} className="flex flex-wrap gap-3 pt-2">
              {primaryButton && (
                <a
                  href={primaryButton.href}
                  onClick={(e) => handleButtonClick(e, primaryButton.href)}
                  onMouseEnter={handlePrimaryButtonMouseEnter}
                  onMouseLeave={handlePrimaryButtonMouseLeave}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 px-6 text-sm font-bold text-slate-950 shadow-md transition-colors"
                >
                  {primaryButton.label}
                </a>
              )}
              {secondaryButton && (
                <a
                  href={secondaryButton.href}
                  onClick={(e) => handleButtonClick(e, secondaryButton.href)}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  {secondaryButton.label}
                </a>
              )}
            </div>
          )}

          {/* Dynamic Stats Cards with BorderGlow */}
          <div
            ref={statsContainerRef}
            className="grid max-w-lg grid-cols-3 gap-4 pt-6"
          >
            {[
              { ref: stat1Ref, label: "Mutlu Müşteri", colors: ["#5eead4", "#2dd4bf", "#0f766e"] },
              { ref: stat2Ref, label: "Yıllık Tecrübe", colors: ["#818cf8", "#6366f1", "#4338ca"] },
              { ref: stat3Ref, label: "Marka Seçeneği", colors: ["#f472b6", "#ec4899", "#be185d"] },
            ].map((stat) => (
              <BorderGlow
                key={stat.label}
                backgroundColor="#0f172a"
                borderRadius={16}
                glowColor="170 80 60"
                colors={stat.colors}
                edgeSensitivity={35}
                glowRadius={30}
                className="group transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="px-4 py-4 text-center">
                  <div className="text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
                    <span ref={stat.ref}>0</span>
                    <span className="text-teal-400">+</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-400">{stat.label}</p>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>

        {/* Hero SVG Glasses Visual */}
        <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
          ) : (
            <div className="relative flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
              <svg
                className="h-48 w-full text-teal-400"
                viewBox="0 0 400 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="100" cy="80" r="65" stroke="rgba(45, 212, 191, 0.15)" strokeWidth="1" />
                <circle cx="300" cy="80" r="65" stroke="rgba(45, 212, 191, 0.15)" strokeWidth="1" />
                
                <path
                  ref={svgPathRef}
                  d="M 40 80 C 40 45, 160 45, 160 80 C 160 115, 40 115, 40 80 Z M 240 80 C 240 45, 360 45, 360 80 C 360 115, 240 115, 240 80 Z M 160 75 Q 200 65, 240 75 M 40 75 L 10 65 M 360 75 L 390 65"
                  stroke="url(#glasses-gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <defs>
                  <linearGradient id="glasses-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Infinite Brand Marquee */}
      <div
        ref={marqueeContainerRef}
        className="relative overflow-hidden border-t border-white/10 bg-slate-950/80 py-6"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div ref={marqueeTrackRef} className="flex w-max gap-12 whitespace-nowrap">
          {[...marqueeBrandsList, ...marqueeBrandsList].map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="px-4 text-xl font-bold uppercase tracking-wider text-slate-400/50 transition-colors hover:text-white"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 2. FLUID OPTICAL TECH SHOWCASE WITH BORDERGLOW & HOVER LIFT
// ==========================================
export function GsapPinnedShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !cardsRef.current) return;

      const cards = Array.from(cardsRef.current.children);
      gsap.fromTo(
        cards,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  const features = [
    {
      tag: "Optik Odaklama",
      title: "Progresif Odaklama Teknolojisi",
      desc: "Uzak, orta ve yakın mesafeler arasında kesintisiz ve doğal görüş geçişi sunan özel optik cam tasarımları.",
      badgeColor: "text-teal-300 border-teal-500/30 bg-teal-500/10",
      colors: ["#2dd4bf", "#0f766e", "#14b8a6"],
    },
    {
      tag: "Dijital Koruma",
      title: "Mavi Işık & UV Filtresi",
      desc: "Ekran karşısında geçen uzun saatlerde göz yorgunluğunu en aza indiren akıllı cam kaplamaları.",
      badgeColor: "text-sky-300 border-sky-500/30 bg-sky-500/10",
      colors: ["#38bdf8", "#0284c7", "#0284c7"],
    },
    {
      tag: "Kristal Berraklık",
      title: "Süper Anti-Refle Kaplama",
      desc: "Yansımaları sıfırlayan, su ve leke tutmayan hidrofobik yüzey teknolojisi.",
      badgeColor: "text-purple-300 border-purple-500/30 bg-purple-500/10",
      colors: ["#c084fc", "#7e22ce", "#a855f7"],
    },
  ];

  return (
    <section ref={sectionRef} className="border-b border-white/10 bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
            OptiMaxx Teknolojisi
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Göz Sağlığı ve Konfor Standartları
          </h2>
        </div>

        <div ref={cardsRef} className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feat) => (
            <BorderGlow
              key={feat.title}
              backgroundColor="#090d16"
              borderRadius={20}
              glowColor="180 80 60"
              colors={feat.colors}
              edgeSensitivity={30}
              glowRadius={35}
              glowIntensity={1.2}
              coneSpread={25}
              className="group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="p-8">
                <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${feat.badgeColor}`}>
                  {feat.tag}
                </span>

                <h3 className="mt-5 text-xl font-bold text-white transition-colors group-hover:text-teal-300">{feat.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{feat.desc}</p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 3. SERVICES SECTION GSAP COMPONENT WITH BORDERGLOW & FLOAT LIFT
// ==========================================
interface GsapServicesProps {
  title: string;
  subtitle?: string;
  items: string[];
}

export function GsapServices({ title, subtitle, items }: GsapServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="border-b border-slate-100 bg-white px-6 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
            Hizmetlerimiz
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 text-base leading-7 text-slate-600">{subtitle}</p>
          ) : null}
        </div>

        <div ref={gridRef} className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <BorderGlow
              key={item}
              backgroundColor="#ffffff"
              borderRadius={16}
              glowColor="170 80 50"
              colors={["#2dd4bf", "#38bdf8", "#818cf8"]}
              edgeSensitivity={30}
              glowRadius={30}
              glowIntensity={1.0}
              className="group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 transition-colors group-hover:text-teal-700">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Mağazada ihtiyaçlarınıza göre yönlendirme ve ürün desteği sunulur.
                </p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 4. HIGHLIGHTS / FEATURED PRODUCTS GSAP COMPONENT WITH BORDERGLOW & LIFT
// ==========================================
interface GsapProductsProps {
  title: string;
  subtitle?: string;
  items: string[];
}

export function GsapProducts({ title, subtitle, items }: GsapProductsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="products"
      className="border-b border-slate-100 bg-slate-50/70 px-6 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
            Öne Çıkanlar
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 text-base leading-7 text-slate-600">{subtitle}</p>
          ) : null}
        </div>

        <div ref={gridRef} className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <BorderGlow
              key={item}
              backgroundColor="#ffffff"
              borderRadius={16}
              glowColor="210 80 50"
              colors={["#38bdf8", "#818cf8", "#c084fc"]}
              edgeSensitivity={30}
              glowRadius={30}
              glowIntensity={1.0}
              className="group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Stok ve model seçenekleri mağaza içinde güncel olarak paylaşılır.
                </p>
                <div className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                  <span>Detayları Gör</span>
                  <span className="cta-arrow transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 5. ABOUT GSAP COMPONENT
// ==========================================
interface GsapAboutProps {
  title: string;
  body: string;
  imageUrl?: string;
}

export function GsapAbout({ title, body, imageUrl }: GsapAboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightVisualRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (leftContentRef.current) {
        gsap.fromTo(
          leftContentRef.current,
          { x: -25, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: leftContentRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (rightVisualRef.current) {
        gsap.to(rightVisualRef.current, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="overflow-hidden border-b border-slate-100 bg-white px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div ref={leftContentRef}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
            OptiMaxx Yaklaşımı
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">{body}</p>
        </div>

        <div ref={rightVisualRef} className="will-change-transform">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="aspect-video w-full rounded-2xl object-cover shadow-lg"
            />
          ) : (
            <div className="aspect-video rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50" />
          )}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 6. CALL-TO-ACTION GSAP COMPONENT
// ==========================================
interface GsapCtaProps {
  title: string;
  subtitle: string;
  primaryButton?: { label: string; href: string } | null;
  secondaryButton?: { label: string; href: string } | null;
  imageUrl?: string;
}

export function GsapCta({
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  imageUrl,
}: GsapCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (textContentRef.current) {
        gsap.fromTo(
          textContentRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: textContentRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (buttonsRef.current) {
        const btns = Array.from(buttonsRef.current.children);
        gsap.fromTo(
          btns,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: buttonsRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const lenis = (window as any).lenis;
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.6 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <section ref={sectionRef} className="border-b border-white/10 bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div ref={textContentRef}>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              {subtitle}
            </p>
          </div>

          {(primaryButton || secondaryButton) && (
            <div ref={buttonsRef} className="mt-8 flex flex-wrap gap-3">
              {primaryButton && (
                <a
                  href={primaryButton.href}
                  onClick={(e) => handleButtonClick(e, primaryButton.href)}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-slate-950 transition-all hover:bg-slate-100 hover:scale-105 shadow-md"
                >
                  {primaryButton.label}
                </a>
              )}
              {secondaryButton && (
                <a
                  href={secondaryButton.href}
                  onClick={(e) => handleButtonClick(e, secondaryButton.href)}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  {secondaryButton.label}
                </a>
              )}
            </div>
          )}
        </div>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="aspect-video w-full rounded-2xl object-cover opacity-90 shadow-lg"
          />
        ) : (
          <div className="hidden aspect-video rounded-2xl border border-white/10 bg-white/5 md:block" />
        )}
      </div>
    </section>
  );
}

// ==========================================
// 7. WORKING HOURS GSAP COMPONENT WITH BORDERGLOW & LIFT
// ==========================================
interface GsapHoursProps {
  title: string;
  subtitle?: string;
  weekdays: string;
  saturday: string;
  sunday: string;
  note?: string;
}

export function GsapHours({
  title,
  subtitle,
  weekdays,
  saturday,
  sunday,
  note,
}: GsapHoursProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (cardsRef.current) {
        const scheduleCards = Array.from(cardsRef.current.children);
        gsap.fromTo(
          scheduleCards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="hours"
      className="border-b border-slate-100 bg-slate-50/70 px-6 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
              Saatler
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h2>
            {subtitle ? <p className="mt-3 max-w-2xl text-slate-600">{subtitle}</p> : null}
          </div>
          {note ? (
            <p className="max-w-sm rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-500 shadow-sm">
              {note}
            </p>
          ) : null}
        </div>

        <div ref={cardsRef} className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Hafta içi", weekdays, "Açık"],
            ["Cumartesi", saturday, "Açık"],
            ["Pazar", sunday, sunday.toLowerCase().includes("kapalı") ? "Kapalı" : "Açık"],
          ].map(([label, value, status]) => (
            <BorderGlow
              key={label}
              backgroundColor="#ffffff"
              borderRadius={16}
              glowColor="40 80 50"
              colors={["#f59e0b", "#f97316", "#ef4444"]}
              edgeSensitivity={30}
              glowRadius={30}
              glowIntensity={1.0}
              className="group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold transition-transform duration-300 group-hover:scale-105 ${
                      status === "Açık"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {value}
                </p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 8. CONTACT GSAP COMPONENT
// ==========================================
interface GsapContactProps {
  title: string;
  address: string;
  phone?: string;
  email?: string;
  mapUrl?: string;
}

export function GsapContact({ title, address, phone, email, mapUrl }: GsapContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftInfoRef = useRef<HTMLDivElement>(null);
  const rightMapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (leftInfoRef.current) {
        gsap.fromTo(
          leftInfoRef.current,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: leftInfoRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (rightMapRef.current) {
        gsap.fromTo(
          rightMapRef.current,
          { x: 20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: rightMapRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="contact" className="bg-white px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div ref={leftInfoRef}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
            Bize Ulaşın
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 leading-7 text-slate-600">{address}</p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-sm">
            {phone ? (
              <p className="flex justify-between gap-4 border-b border-slate-200 py-3">
                <span className="font-medium text-slate-500">Telefon</span>
                <span className="font-semibold text-slate-900">{phone}</span>
              </p>
            ) : null}
            {email ? (
              <p className="flex justify-between gap-4 py-3">
                <span className="font-medium text-slate-500">E-posta</span>
                <span className="font-semibold text-slate-900">{email}</span>
              </p>
            ) : null}
          </div>
        </div>

        <div ref={rightMapRef}>
          {mapUrl ? (
            <div className="flex flex-col gap-2">
              <iframe
                title="OptiMaxx mağaza haritası"
                src={toEmbedMapUrl(mapUrl)}
                className="min-h-80 w-full rounded-2xl border border-slate-200 shadow-sm"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="text-right">
                <a
                  href={mapUrl.match(/^https?:\/\//i) ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(mapUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Google Haritalar'da Aç ↗
                </a>
              </div>
            </div>
          ) : (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Harita bağlantısı site editöründen eklendiğinde burada görünecek.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function toEmbedMapUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  let url = rawUrl.trim();
  const iframeMatch = url.match(/src=["']([^"']+)["']/i);
  if (iframeMatch) url = iframeMatch[1];
  if (url.includes("/maps/embed") && !url.includes("output=embed")) return url;
  let query = url;
  const placeMatch = url.match(/\/maps\/place\/([^/]+)/i);
  if (placeMatch) query = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

// ==========================================
// 9. SOCIAL LINKS & FOOTER GSAP COMPONENT
// ==========================================
interface GsapSocialFooterProps {
  socialTitle: string;
  socialSubtitle?: string;
  socialItems: { label: string; url: string }[];
}

export function GsapSocialFooter({
  socialTitle,
  socialSubtitle,
  socialItems,
}: GsapSocialFooterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      if (linksContainerRef.current) {
        const linkBtns = Array.from(linksContainerRef.current.children);
        gsap.fromTo(
          linkBtns,
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: linksContainerRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.9,
            ease: "power1.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 95%",
              once: true,
            },
          }
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      {socialItems.length > 0 && (
        <section className="border-b border-slate-100 bg-white px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{socialTitle}</h2>
              {socialSubtitle ? (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{socialSubtitle}</p>
              ) : null}
            </div>
            <div ref={linksContainerRef} className="flex flex-wrap gap-2">
              {socialItems.map((item) => (
                <a
                  key={`${item.label}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer
        ref={footerRef}
        className="border-t border-slate-800 bg-slate-950 px-6 py-10 text-sm text-slate-400"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-lg font-bold text-white">OptiMaxx</span>
            <p className="mt-1 text-slate-500">
              Optik ürünler, cam çözümleri ve mağaza hizmetleri.
            </p>
          </div>
          <span className="text-slate-500">
            © {new Date().getFullYear()} OptiMaxx. Tüm hakları saklıdır.
          </span>
        </div>
      </footer>
    </div>
  );
}
