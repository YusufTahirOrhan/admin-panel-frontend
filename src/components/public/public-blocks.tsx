import React from "react";
import BrandShowcase, { type BrandShowcaseItem } from "./brand-showcase";
import { PublicHero, PublicServices, PublicProducts, PublicAbout, PublicCta, PublicHours, PublicContact, PublicSocialFooter } from "./storefront-sections";
import type { PageBlock } from "@/lib/management-api";
import { isPublicCtaAllowed } from "@/lib/public-content";
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

export function asBrandItems(value: unknown): BrandShowcaseItem[] {
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

export function renderBlock(block: PageBlock, anchors: Set<string>) {
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
          <PublicHero
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
        <PublicServices
          key={block.order}
          title={text(content, "title", "Hizmetlerimiz")}
          subtitle={text(content, "subtitle")}
          items={asList(content.items)}
        />
      );
    case "featuredProducts":
      return (
        <PublicProducts
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
        <PublicAbout
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
        <PublicCta
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
        <PublicHours
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
        <PublicContact
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
        <PublicSocialFooter
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
