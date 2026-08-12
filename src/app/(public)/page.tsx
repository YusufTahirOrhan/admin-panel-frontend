import BrandShowcase, { type BrandShowcaseItem } from "@/components/public/brand-showcase";
import {
  GsapHero,
  GsapServices,
  GsapProducts,
  GsapAbout,
  GsapCta,
  GsapHours,
  GsapContact,
  GsapSocialFooter,
} from "@/components/public/gsap-sections";
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
        <GsapHero
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
        <GsapServices
          key={block.order}
          title={text(content, "title", "Hizmetlerimiz")}
          subtitle={text(content, "subtitle")}
          items={asList(content.items)}
        />
      );
    case "featuredProducts":
      return (
        <GsapProducts
          key={block.order}
          title={text(content, "title", "Öne Çıkanlar")}
          subtitle={text(content, "subtitle")}
          items={asList(content.items)}
        />
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
        <GsapAbout
          key={block.order}
          title={text(content, "title", "OptiMaxx")}
          body={text(content, block.type === "about" ? "body" : "subtitle")}
          imageUrl={text(content, "imageUrl")}
        />
      );
    case "cta": {
      const primaryButtonLabel = text(content, "primaryButtonLabel", "Mağazaya Ulaş");
      const primaryButtonHref = text(content, "primaryButtonHref", "#contact");
      const secondaryButtonLabel = text(content, "secondaryButtonLabel", "Hizmetleri Gör");
      const secondaryButtonHref = text(content, "secondaryButtonHref", "#services");
      const showPrimaryButton = isPublicCtaAllowed(primaryButtonLabel, primaryButtonHref || "#contact");
      const showSecondaryButton = isPublicCtaAllowed(secondaryButtonLabel, secondaryButtonHref || "#services");

      return (
        <GsapCta
          key={block.order}
          title={text(content, "title", "Size uygun camı birlikte seçelim")}
          subtitle={text(content, "subtitle")}
          primaryButton={showPrimaryButton ? { label: primaryButtonLabel, href: primaryButtonHref || "#contact" } : null}
          secondaryButton={showSecondaryButton ? { label: secondaryButtonLabel, href: secondaryButtonHref || "#services" } : null}
          imageUrl={text(content, "imageUrl")}
        />
      );
    }
    case "hours":
      return (
        <GsapHours
          key={block.order}
          title={text(content, "title", "Çalışma Saatleri")}
          subtitle={text(content, "subtitle")}
          weekdays={text(content, "weekdays")}
          saturday={text(content, "saturday")}
          sunday={text(content, "sunday")}
          note={text(content, "note")}
        />
      );
    case "contact":
      return (
        <GsapContact
          key={block.order}
          title={text(content, "title", "Mağazamız")}
          address={text(content, "address")}
          phone={text(content, "phone")}
          email={text(content, "email")}
          mapUrl={text(content, "mapUrl")}
        />
      );
    case "socialLinks": {
      const links = asSocialLinks(content.items);
      return (
        <GsapSocialFooter
          key={block.order}
          socialTitle={text(content, "title", "Bizi Takip Edin")}
          socialSubtitle={text(content, "subtitle")}
          socialItems={links}
        />
      );
    }
    default:
      return null;
  }
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
