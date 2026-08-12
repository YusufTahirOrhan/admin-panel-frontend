"use client";

import SplitText from "@/components/ui/split-text";
import GradientText from "@/components/ui/gradient-text";
import CountUp from "@/components/ui/count-up";
import MarqueeBrands from "@/components/public/marquee-brands";

interface AnimatedHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  highlights: string[];
  imageUrl: string;
  primaryButton?: { label: string; href: string } | null;
  secondaryButton?: { label: string; href: string } | null;
}

export function AnimatedHero({
  eyebrow,
  title,
  subtitle,
  highlights,
  imageUrl,
  primaryButton,
  secondaryButton,
}: AnimatedHeroProps) {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[150px]" />
      </div>

      <div className="relative mx-auto grid min-h-[80vh] max-w-6xl content-center gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <GradientText
            colors={["#5eead4", "#818cf8", "#c084fc", "#5eead4"]}
            animationSpeed={4}
            className="text-sm font-semibold uppercase tracking-[0.2em]"
          >
            {eyebrow || "Mahallenizin modern optik mağazası"}
          </GradientText>

          <SplitText
            text={title || "OptiMaxx Optik"}
            tag="h1"
            className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-white"
            delay={50}
            duration={0.6}
            splitType="chars"
            textAlign="left"
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
          />

          <SplitText
            text={subtitle || "Göz sağlığınız, net görüş ve stiliniz için modern optik çözümler."}
            tag="p"
            className="max-w-2xl text-lg leading-8 text-slate-300"
            delay={30}
            duration={0.5}
            splitType="words"
            textAlign="left"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
          />

          {(primaryButton || secondaryButton) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {primaryButton && (
                <a
                  href={primaryButton.href}
                  className="group relative inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-slate-950 transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/10"
                >
                  {primaryButton.label}
                </a>
              )}
              {secondaryButton && (
                <a
                  href={secondaryButton.href}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30"
                >
                  {secondaryButton.label}
                </a>
              )}
            </div>
          )}

          {/* Stats counters */}
          <div className="grid max-w-lg grid-cols-3 gap-4 pt-6">
            {[
              { value: 500, suffix: "+", label: "Mutlu Müşteri" },
              { value: 10, suffix: "+", label: "Yıllık Tecrübe" },
              { value: 50, suffix: "+", label: "Marka Seçeneği" },
            ].map((stat) => (
              <div key={stat.label} className="text-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-4">
                <div className="text-2xl font-bold text-white">
                  <CountUp from={0} to={stat.value} duration={2.5} separator="." />
                  <span>{stat.suffix}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero image / gradient placeholder */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
          ) : (
            <div className="aspect-[4/3] rounded-xl bg-[radial-gradient(circle_at_30%_20%,#5eead4,transparent_28%),radial-gradient(circle_at_80%_70%,#818cf8,transparent_30%),linear-gradient(135deg,#0f172a,#1e293b)]" />
          )}
        </div>
      </div>

      {/* Brand marquee strip */}
      <div className="relative border-t border-white/10 py-6 bg-slate-950/80">
        <MarqueeBrands
          items={[
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
          ]}
          speed={25}
        />
      </div>
    </section>
  );
}

interface AnimatedSectionTitleProps {
  title: string;
  subtitle?: string;
  colors?: string[];
}

export function AnimatedSectionTitle({ title, subtitle, colors }: AnimatedSectionTitleProps) {
  return (
    <div>
      <GradientText
        colors={colors || ["#0f766e", "#0ea5e9", "#8b5cf6", "#0f766e"]}
        animationSpeed={5}
        className="text-3xl font-bold tracking-tight"
      >
        {title}
      </GradientText>
      {subtitle && <p className="mt-3 max-w-2xl text-slate-600">{subtitle}</p>}
    </div>
  );
}
