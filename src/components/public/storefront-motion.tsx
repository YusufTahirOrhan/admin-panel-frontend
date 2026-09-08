"use client";

import { useEffect, useRef } from "react";

/** Progressive enhancement: server content stays visible if scripting is unavailable. */
export default function StorefrontMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    const targets = root.current?.querySelectorAll<HTMLElement>(
      '.public-hero-copy > *, .public-hero-image, .public-heading, .public-service-item, .public-product-card, .public-brand-card, .public-cta h2, .public-hours dl, .public-contact iframe',
    );
    if (!targets || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const animation = entry.target.animate(
          [{ opacity: .65, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 650, delay: Math.min(order++ * 65, 260), fill: 'backwards', easing: 'cubic-bezier(.22, 1, .36, 1)' },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: .08 });
    targets.forEach((target) => observer.observe(target));
    const cancelMotion = () => { if (preference.matches) { animations.forEach((animation) => animation.cancel()); animations.clear(); } };
    preference.addEventListener('change', cancelMotion);
    return () => { observer.disconnect(); animations.forEach((animation) => animation.cancel()); preference.removeEventListener('change', cancelMotion); };
  }, []);
  return <div ref={root}>{children}</div>;
}
