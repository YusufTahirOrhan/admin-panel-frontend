import React from "react";
import Link from "next/link";
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
import type { PageBlock } from "@/lib/management-api";
import PublicHeader from "@/components/public/public-header";
import { fetchPublicHome, getPublicNavigation, isPublicCtaAllowed } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "OptiMaxx Optik",
  description: "OptiMaxx optik mağazası, ürünleri ve hizmetleri.",
};

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

function renderBlock(block: PageBlock, anchors: Set<string>) {
  const content = block.content;
  const allowCta = (label: string, href: string) => isPublicCtaAllowed(label, href) && (!href.startsWith('#') || anchors.has(href));
  switch (block.type) {
    case "hero": {
      const primaryButtonLabel = text(content, "primaryButtonLabel");
      const primaryButtonHref = text(content, "primaryButtonHref");
      const secondaryButtonLabel = text(content, "secondaryButtonLabel", "Koleksiyonları İncele");
      const secondaryButtonHref = text(content, "secondaryButtonHref", "#products");
      const showPrimaryButton = allowCta(primaryButtonLabel, primaryButtonHref || "#contact");
      const showSecondaryButton = allowCta(secondaryButtonLabel, secondaryButtonHref || "#services");

      return (
        <React.Fragment key={block.order}>
          <GsapHero
            eyebrow={text(content, "eyebrow", "Mahallenizin modern optik mağazası")}
            title={text(content, "title", "OptiMaxx Optik")}
            subtitle={text(content, "subtitle", "Göz sağlığınız, net görüş ve stiliniz için modern optik çözümler.")}
            highlights={listOrFallback(content.highlights, ["Optik cam", "Çerçeve", "Bakım"])}
            imageUrl={text(content, "imageUrl")}
            primaryButton={showPrimaryButton ? { label: primaryButtonLabel, href: primaryButtonHref || "#contact" } : null}
            secondaryButton={showSecondaryButton ? { label: secondaryButtonLabel, href: secondaryButtonHref || "#services" } : null}
          />

        </React.Fragment>
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
      const showPrimaryButton = allowCta(primaryButtonLabel, primaryButtonHref || "#contact");
      const showSecondaryButton = allowCta(secondaryButtonLabel, secondaryButtonHref || "#services");

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
  const { blocks, unavailable } = await fetchPublicHome(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080");
  const navigation = getPublicNavigation(blocks).filter((item) => item.href !== '#brands' || blocks.some((block) => block.type === 'brandShowcase' && (asBrandItems(block.content.eyewearItems).length || asBrandItems(block.content.lensItems).length)));
  return <>
    <PublicHeader items={navigation} />
    <main id="main-content" tabIndex={-1} className="flex-1">
      {blocks.length ? blocks.map((block) => renderBlock(block, new Set(navigation.map((item) => item.href)))) : <section className="public-container py-24">
        <p className="text-sm font-semibold text-teal-700">OptiMaxx Optik</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{unavailable ? 'İçeriğe şu anda ulaşılamıyor' : 'Mağaza bilgileri yakında burada'}</h1>
        <p className="mt-4 max-w-xl leading-7 text-slate-600">{unavailable ? 'Geçici bir bağlantı sorunu oluştu. Lütfen kısa bir süre sonra yeniden deneyin.' : 'Yayınlanan mağaza bilgilerini bu sayfadan takip edebilirsiniz.'}</p>
        {unavailable && <form action="/" method="get"><button type="submit" className="mt-7 inline-flex min-h-12 items-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white">Yeniden dene</button></form>}
      </section>}
    </main>
    <footer className="border-t border-white/15 bg-slate-950 py-8 text-slate-300"><div className="public-container flex flex-col justify-between gap-4 text-sm sm:flex-row sm:items-center"><Link href="/" className="text-lg font-semibold text-white">OptiMaxx</Link><p>© {new Date().getFullYear()} OptiMaxx. Tüm hakları saklıdır.</p></div></footer>
  </>;
}
