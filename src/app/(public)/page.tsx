import Image from "next/image";
import BrandShowcase, { type BrandShowcaseItem } from "@/components/public/brand-showcase";
import { AnimatedHero, AnimatedSectionTitle } from "@/components/public/animated-sections";
import type { PageBlock, SitePage } from "@/lib/management-api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "OptiMaxx Optik",
  description: "OptiMaxx optik mağazası, ürünleri ve hizmetleri.",
};

const fallbackBlocks: PageBlock[] = [
  {
    type: "hero",
    order: 0,
    enabled: true,
    content: {
      title: "OptiMaxx Optik",
      subtitle: "Göz sağlığınız, net görüş ve stiliniz için modern optik çözümler.",
      eyebrow: "Mahallenizin modern optik mağazası",
      primaryButtonLabel: "",
      primaryButtonHref: "",
      secondaryButtonLabel: "Koleksiyonları İncele",
      secondaryButtonHref: "#products",
      highlights: ["Optik cam danışmanlığı", "Çerçeve seçimi", "Hızlı bakım"],
      imageUrl: "",
    },
  },
  {
    type: "services",
    order: 1,
    enabled: true,
    content: {
      title: "Hizmetlerimiz",
      subtitle: "Gözlük seçiminden bakım ve ayara kadar mağaza içinde hızlı destek.",
      items: ["Optik cam danışmanlığı", "Gözlük çerçevesi", "Kontakt lens", "Tamir ve ayar"],
    },
  },
  {
    type: "featuredProducts",
    order: 2,
    enabled: true,
    content: {
      title: "Öne Çıkanlar",
      subtitle: "Günlük kullanım, güneş koruması ve özel cam ihtiyaçları için seçilmiş ürünler.",
      items: ["Güneş gözlükleri", "Progresif camlar", "Mavi ışık filtreli camlar"],
    },
  },
  {
    type: "brandShowcase",
    order: 3,
    enabled: true,
    content: {
      title: "Seçili Marka ve Ürünler",
      subtitle: "Gözlük ve lens markalarını ayrı akışlarda keşfedin.",
      eyewearItems: [
        {
          name: "Ray-Ban",
          description: "Klasik güneş gözlüğü ve optik çerçeve modelleri.",
          imageUrl: "",
          url: "",
        },
        {
          name: "Persol",
          description: "El işçiliği detaylı premium çerçeveler.",
          imageUrl: "",
          url: "",
        },
        {
          name: "Vogue Eyewear",
          description: "Günlük kullanıma uygun modern ve renkli tasarımlar.",
          imageUrl: "",
          url: "",
        },
      ],
      lensItems: [
        {
          name: "Acuvue",
          description: "Günlük ve aylık kontakt lens seçenekleri.",
          imageUrl: "",
          url: "",
        },
        {
          name: "Air Optix",
          description: "Nefes alabilen kontakt lens teknolojileri.",
          imageUrl: "",
          url: "",
        },
        {
          name: "Biofinity",
          description: "Uzun süreli konfor için kontakt lens alternatifleri.",
          imageUrl: "",
          url: "",
        },
      ],
    },
  },
  {
    type: "about",
    order: 4,
    enabled: true,
    content: {
      title: "Net görüş için sakin, özenli bir deneyim",
      body: "OptiMaxx, optik ürün seçimini karmaşık olmaktan çıkarıp ihtiyaca uygun, anlaşılır ve güvenilir bir sürece dönüştürür.",
      imageUrl: "",
    },
  },
  {
    type: "cta",
    order: 5,
    enabled: true,
    content: {
      title: "Size uygun camı birlikte seçelim",
      subtitle: "Ekibimiz ihtiyaçlarınıza göre en doğru çözümü bulmanıza yardımcı olur.",
      primaryButtonLabel: "Mağazaya Ulaş",
      primaryButtonHref: "#contact",
      secondaryButtonLabel: "Hizmetleri Gör",
      secondaryButtonHref: "#services",
      imageUrl: "",
    },
  },
  {
    type: "hours",
    order: 6,
    enabled: true,
    content: {
      title: "Çalışma Saatleri",
      subtitle: "Mağaza ziyaretinizi planlamadan önce güncel saatleri kontrol edebilirsiniz.",
      weekdays: "09:00 - 19:00",
      saturday: "10:00 - 17:00",
      sunday: "Kapalı",
      note: "Resmi tatil ve özel günlerde saatler değişebilir.",
    },
  },
  {
    type: "contact",
    order: 7,
    enabled: true,
    content: {
      title: "Mağazamız",
      phone: "+90 555 123 4567",
      email: "contact@optimaxx.com",
      address: "Merkez Mahallesi, Optik Caddesi No: 1",
      mapUrl: "",
    },
  },
  {
    type: "socialLinks",
    order: 8,
    enabled: true,
    content: {
      title: "Bizi Takip Edin",
      subtitle: "Yeni modeller, kampanyalar ve mağaza duyuruları için sosyal hesaplarımız.",
      items: [
        { label: "Instagram", url: "https://instagram.com/" },
        { label: "Facebook", url: "https://facebook.com/" },
        { label: "TikTok", url: "https://tiktok.com/" },
      ],
    },
  },
];

async function getHomeBlocks(): Promise<PageBlock[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const fallback = process.env.NODE_ENV === "production" ? [] : fallbackBlocks;

  try {
    const response = await fetch(`${baseUrl}/api/v1/public/pages/home`, {
      cache: "no-store",
    });
    if (!response.ok) return fallback;
    const page = (await response.json()) as SitePage;
    return page.blocks?.length ? page.blocks : fallback;
  } catch {
    return fallback;
  }
}

function text(content: PageBlock["content"], key: string, fallback = "") {
  const value = content[key];
  return value === undefined || value === null ? fallback : String(value);
}

function asList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function listOrFallback(value: unknown, fallback: string[]): string[] {
  const list = asList(value);
  return list.length ? list : fallback;
}

function asRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null && !Array.isArray(item))
    : [];
}

function asBrandItems(value: unknown): BrandShowcaseItem[] {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value.map((item) => ({ name: item }));
  }

  return asRecords(value)
    .map((item) => ({
      name: text(item, "name"),
      description: text(item, "description"),
      imageUrl: text(item, "imageUrl"),
      url: text(item, "url"),
    }))
    .filter((item) => item.name);
}

function asSocialLinks(value: unknown) {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value
      .map((item) => {
        const [label, url = ""] = item.split("|");
        return { label: label.trim(), url: url.trim() };
      })
      .filter((item) => item.label && item.url);
  }

  return asRecords(value)
    .map((item) => ({
      label: text(item, "label"),
      url: text(item, "url"),
    }))
    .filter((item) => item.label && item.url);
}

function renderImage(src: string, className: string) {
  return src ? (
    <Image
      src={src}
      alt=""
      width={1200}
      height={900}
      unoptimized
      className={className}
    />
  ) : null;
}

function toEmbedMapUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  let url = rawUrl.trim();

  // Extract src if iframe tag is pasted
  const iframeMatch = url.match(/src=["']([^"']+)["']/i);
  if (iframeMatch) {
    url = iframeMatch[1];
  }

  // Official Google Maps Embed (/maps/embed?pb=...)
  if (url.includes("/maps/embed") && !url.includes("output=embed")) {
    return url;
  }

  // Extract place name if place URL
  let query = url;
  const placeMatch = url.match(/\/maps\/place\/([^/]+)/i);
  if (placeMatch) {
    query = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
  }

  // Clean embed URL without legacy info bubble banner
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

function renderMap(src: string) {
  if (!src) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-lg border bg-slate-100 p-6 text-center text-sm text-slate-500">
        Harita bağlantısı site editöründen eklendiğinde burada görünecek.
      </div>
    );
  }

  const embedUrl = toEmbedMapUrl(src);
  const directUrl = src.match(/^https?:\/\//i) ? src : `https://maps.google.com/maps?q=${encodeURIComponent(src)}`;

  return (
    <div className="flex flex-col gap-2">
      <iframe
        title="OptiMaxx mağaza haritası"
        src={embedUrl}
        className="min-h-80 w-full rounded-lg border"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="text-right">
        <a
          href={directUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline"
        >
          Google Haritalar'da Aç ↗
        </a>
      </div>
    </div>
  );
}

function normalizeCtaText(value: string) {
  return value.trim().toLocaleLowerCase("tr-TR");
}

function isPublicCtaAllowed(label: string, href: string) {
  if (!label.trim()) return false;

  const normalizedLabel = normalizeCtaText(label);
  const normalizedHref = normalizeCtaText(href);
  const pathOnly = normalizedHref.replace(/^https?:\/\/[^/]+/, "");
  const forbiddenTerms = ["login", "giris", "giriş", "admin", "panel", "randevu", "appointment"];

  if (forbiddenTerms.some((term) => normalizedLabel.includes(term))) {
    return false;
  }

  if (["/login", "/admin", "/sales"].some((path) => pathOnly === path || pathOnly.startsWith(`${path}/`))) {
    return false;
  }

  return !["panel.optimaxx.com.tr", "randevu", "appointment"].some((term) => normalizedHref.includes(term));
}

function renderBlock(block: PageBlock) {
  const content = block.content;
  switch (block.type) {
    case "hero": {
      const primaryButtonLabel = text(content, "primaryButtonLabel");
      const primaryButtonHref = text(content, "primaryButtonHref");
      const secondaryButtonLabel = text(content, "secondaryButtonLabel", "Koleksiyonları İncele");
      const secondaryButtonHref = text(content, "secondaryButtonHref", "#products");
      const showPrimaryButton = isPublicCtaAllowed(primaryButtonLabel, primaryButtonHref || "#contact");
      const showSecondaryButton = isPublicCtaAllowed(secondaryButtonLabel, secondaryButtonHref || "#services");

      return (
        <AnimatedHero
          key={block.order}
          eyebrow={text(content, "eyebrow", "Mahallenizin modern optik mağazası")}
          title={text(content, "title", "OptiMaxx Optik")}
          subtitle={text(content, "subtitle", "Göz sağlığınız, net görüş ve stiliniz için modern optik çözümler.")}
          highlights={listOrFallback(content.highlights, ["Optik cam", "Çerçeve", "Bakım"])}
          imageUrl={text(content, "imageUrl")}
          primaryButton={showPrimaryButton ? { label: primaryButtonLabel, href: primaryButtonHref || "#contact" } : null}
          secondaryButton={showSecondaryButton ? { label: secondaryButtonLabel, href: secondaryButtonHref || "#services" } : null}
        />
      );
    }
    case "services":
      return (
        <section id="services" key={block.order} className="border-b bg-white px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <AnimatedSectionTitle title={text(content, "title", "Hizmetlerimiz")} subtitle={text(content, "subtitle")} />
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {asList(content.items).map((item) => (
                <div key={item} className="group rounded-2xl border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-teal-200 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-teal-50/50 hover:to-white">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="font-bold text-slate-900">{item}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Mağazada ihtiyaçlarınıza göre yönlendirme ve ürün desteği sunulur.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "featuredProducts":
      return (
        <section id="products" key={block.order} className="border-b bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <AnimatedSectionTitle
              title={text(content, "title", "Öne Çıkanlar")}
              subtitle={text(content, "subtitle")}
              colors={["#0ea5e9", "#8b5cf6", "#ec4899", "#0ea5e9"]}
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {asList(content.items).map((item) => (
                <div key={item} className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <h3 className="text-lg font-bold text-slate-900">{item}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Stok ve model seçenekleri mağaza içinde güncel olarak paylaşılır.
                    </p>
                    <div className="mt-4 inline-flex items-center text-xs font-bold text-indigo-600 transition-colors group-hover:text-indigo-700">
                      Detayları Gör →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "brandShowcase":
      return (
        <BrandShowcase
          key={block.order}
          title={text(content, "title", "Seçili Marka ve Ürünler")}
          subtitle={text(content, "subtitle")}
          eyewearItems={asBrandItems(content.eyewearItems)}
          lensItems={asBrandItems(content.lensItems)}
        />
      );
    case "about":
      return (
        <section key={block.order} className="border-b bg-white px-6 py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
            <div>
              <AnimatedSectionTitle
                title={text(content, "title", "OptiMaxx")}
                colors={["#0f766e", "#059669", "#10b981", "#0f766e"]}
              />
              <p className="mt-5 text-base leading-7 text-slate-600">
                {text(content, block.type === "about" ? "body" : "subtitle")}
              </p>
            </div>
            {renderImage(text(content, "imageUrl"), "aspect-video w-full rounded-2xl object-cover shadow-lg") ?? (
              <div className="aspect-video rounded-2xl border bg-gradient-to-br from-slate-100 to-slate-50" />
            )}
          </div>
        </section>
      );
    case "cta": {
      const primaryButtonLabel = text(content, "primaryButtonLabel", "Mağazaya Ulaş");
      const primaryButtonHref = text(content, "primaryButtonHref", "#contact");
      const secondaryButtonLabel = text(content, "secondaryButtonLabel", "Hizmetleri Gör");
      const secondaryButtonHref = text(content, "secondaryButtonHref", "#services");
      const showPrimaryButton = isPublicCtaAllowed(primaryButtonLabel, primaryButtonHref || "#contact");
      const showSecondaryButton = isPublicCtaAllowed(secondaryButtonLabel, secondaryButtonHref || "#services");

      return (
        <section key={block.order} className="border-b bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                {text(content, "title", "Size uygun camı birlikte seçelim")}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                {text(content, "subtitle")}
              </p>
              {(showPrimaryButton || showSecondaryButton) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {showPrimaryButton ? (
                    <a
                      href={primaryButtonHref || "#contact"}
                      className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100"
                    >
                      {primaryButtonLabel}
                    </a>
                  ) : null}
                  {showSecondaryButton ? (
                    <a
                      href={secondaryButtonHref || "#services"}
                      className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      {secondaryButtonLabel}
                    </a>
                  ) : null}
                </div>
              )}
            </div>
            {renderImage(text(content, "imageUrl"), "aspect-video w-full rounded-lg object-cover opacity-90 shadow-sm") ?? (
              <div className="hidden aspect-video rounded-lg border border-white/10 bg-white/5 md:block" aria-hidden="true" />
            )}
          </div>
        </section>
      );
    }
    case "hours":
      return (
        <section id="hours" key={block.order} className="border-b bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <AnimatedSectionTitle
                title={text(content, "title", "Çalışma Saatleri")}
                subtitle={text(content, "subtitle")}
                colors={["#f59e0b", "#f97316", "#ef4444", "#f59e0b"]}
              />
              {text(content, "note") ? (
                <p className="max-w-sm rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-slate-500 shadow-sm">
                  {text(content, "note")}
                </p>
              ) : null}
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                ["Hafta içi", text(content, "weekdays")],
                ["Cumartesi", text(content, "saturday")],
                ["Pazar", text(content, "sunday")],
              ].map(([label, value]) => (
                <div key={label} className="group rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "contact":
      return (
        <section id="contact" key={block.order} className="bg-white px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{text(content, "title", "Mağazamız")}</h2>
              <p className="mt-4 leading-7 text-slate-600">{text(content, "address")}</p>
              <div className="mt-6 rounded-lg border p-5 text-sm">
                {["phone", "email"].map((key) =>
                  content[key] ? (
                    <p key={key} className="flex justify-between gap-4 border-b py-2 last:border-0">
                      <span className="font-medium">{labelFor(key)}</span>
                      <span className="text-right">{String(content[key])}</span>
                    </p>
                  ) : null,
                )}
              </div>
            </div>
            {renderMap(text(content, "mapUrl"))}
          </div>
        </section>
      );
    case "socialLinks": {
      const links = asSocialLinks(content.items);
      if (links.length === 0) return null;

      return (
        <section key={block.order} className="border-b bg-white px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{text(content, "title", "Bizi Takip Edin")}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{text(content, "subtitle")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {links.map((item) => (
                <a
                  key={`${item.label}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      );
    }
    default:
      return null;
  }
}

function labelFor(key: string) {
  const labels: Record<string, string> = {
    phone: "Telefon",
    email: "E-posta",
  };
  return labels[key] ?? key;
}

export default async function PublicHomePage() {
  const blocks = await getHomeBlocks();
  return (
    <main>
      {blocks
        .filter((block) => block.enabled)
        .sort((a, b) => a.order - b.order)
        .map(renderBlock)}
    </main>
  );
}
