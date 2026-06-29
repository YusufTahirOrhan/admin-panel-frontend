import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronRight,
  Clock,
  Eye,
  Glasses,
  Heart,
  Layers,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import FaceShapeWidget from "@/components/public/face-shape-widget";
import LensSimulator from "@/components/public/lens-simulator";
import type { PageBlock, SitePage } from "@/lib/management-api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Optimaxx Optik & Lens | Seçkin Estetik ve Hassas Görüş",
  description:
    "Lüks dünya markaları, kişiye özel hassas cam kesim teknolojileri ve deneyimli optisyen kadromuzla görme kalitenizi sanata dönüştürüyoruz.",
};

const fallbackBlocks: PageBlock[] = [
  {
    type: "hero",
    order: 0,
    enabled: true,
    content: {
      eyebrow: "Seçkin Optik Mühendisliği",
      title: "Görme Sanatı, Lüks Tasarımla Buluşuyor",
      subtitle:
        "Dünya standartlarında optik teknolojileri, el yapımı asetat ve hafif titanyum çerçeveler ile kişiye özel cam tasarımlarını bir araya getiriyoruz.",
      imageUrl: "/luxury_eyewear.png",
    },
  },
  {
    type: "featuredProducts",
    order: 1,
    enabled: true,
    content: {
      title: "Her Yaşam Tarzına Özel Karakteristik Dokunuşlar",
      subtitle: "Koleksiyon Tasarımı",
      items: ["Güneş Gözlükleri", "Optik Çerçeveler", "Kontakt Lensler"],
    },
  },
  {
    type: "services",
    order: 2,
    enabled: true,
    content: {
      title: "Göz Sağlığınız İçin Hassas Çözümler",
      subtitle:
        "Yüksek standartlı laboratuvarımızda her cam, milimetrik odaklama cihazları ile işlenir.",
      items: [
        "Uzman Optisyen Desteği",
        "Bilgisayarlı Hassas Ölçüm",
        "Dijital Odaklama",
        "Resmi Garanti & Orijinallik",
      ],
    },
  },
  {
    type: "about",
    order: 3,
    enabled: true,
    content: {
      title: "Optimaxx Atelier",
      body: "Lüks koleksiyonları, hassas cam teknolojisini ve sakin mağaza deneyimini aynı çatı altında birleştiriyoruz.",
    },
  },
  {
    type: "hours",
    order: 4,
    enabled: true,
    content: {
      title: "Butik Çalışma Saatleri",
      weekdays: "09:00 - 20:00",
      saturday: "09:00 - 19:30",
      sunday: "Kapalı",
    },
  },
  {
    type: "contact",
    order: 5,
    enabled: true,
    content: {
      title: "Moda'nın Zarif Butiğindeyiz",
      phone: "+90 (216) 555 01 23",
      email: "info@optimaxxoptik.com",
      address: "Caferağa Mah. Moda Cad. No: 123/A Kadıköy, İstanbul",
      mapUrl: "",
    },
  },
];

async function getHomeBlocks(): Promise<PageBlock[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

  try {
    const response = await fetch(`${baseUrl}/api/v1/public/pages/home`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackBlocks;
    }

    const page = (await response.json()) as SitePage;
    return page.blocks?.length ? page.blocks : fallbackBlocks;
  } catch {
    return fallbackBlocks;
  }
}

function firstBlock(blocks: PageBlock[], type: string) {
  return blocks
    .filter((block) => block.enabled)
    .sort((a, b) => a.order - b.order)
    .find((block) => block.type === type);
}

function text(block: PageBlock | undefined, key: string, fallback = "") {
  const value = block?.content[key];
  return value === undefined || value === null || value === "" ? fallback : String(value);
}

function list(block: PageBlock | undefined, key: string, fallback: string[]) {
  const value = block?.content[key];
  return Array.isArray(value) && value.length ? value.map(String).filter(Boolean) : fallback;
}

function fallbackBlock(type: string) {
  return fallbackBlocks.find((block) => block.type === type);
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  const [lead, rest] = title.split(/,\s| için | İçin /i);

  return (
    <div className="text-left flex flex-col gap-4 mb-14 max-w-2xl">
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c5a880]">
        {eyebrow}
      </span>
      <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight font-serif leading-tight">
        {rest ? (
          <>
            {lead} <br />
            <span className="italic text-[#c5a880]">{rest}</span>
          </>
        ) : (
          title
        )}
      </h2>
      <div className="w-16 h-[1px] bg-[#c5a880] mt-2" />
    </div>
  );
}

function renderHeroTitle(title: string) {
  const normalized = title.trim();
  if (!normalized.includes(",")) {
    return normalized;
  }

  const [lead, tail] = normalized.split(/,\s(.+)/);
  return (
    <>
      {lead}, <br />
      <span className="font-normal italic text-[#c5a880]">{tail}</span>
    </>
  );
}

function renderHeroImage(src: string) {
  return (
    <div className="relative border border-[#c5a880]/15 rounded p-4 bg-[#121214]/60 backdrop-blur-md shadow-2xl overflow-hidden group max-w-md w-full">
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#c5a880]/60" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#c5a880]/60" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#c5a880]/60" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#c5a880]/60" />

      <div className="relative overflow-hidden rounded">
        <Image
          src={src || "/luxury_eyewear.png"}
          alt="Optimaxx gözlük koleksiyonu"
          width={500}
          height={350}
          unoptimized
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.9]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/80 via-transparent to-transparent opacity-60" />
      </div>

      <div className="mt-4 flex justify-between items-center px-1 text-white/50 text-[10px] uppercase tracking-[0.2em] font-semibold">
        <span>Sınırlı Üretim Serisi</span>
        <span className="text-[#c5a880]">Optimaxx Atelier</span>
      </div>
    </div>
  );
}

function MapPanel({ mapUrl }: { mapUrl: string }) {
  if (mapUrl) {
    return (
      <div className="lg:col-span-7 h-[480px] w-full bg-[#121214]/60 border border-[#c5a880]/15 rounded overflow-hidden shadow-2xl">
        <iframe
          title="Optimaxx Optik mağaza haritası"
          src={mapUrl}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return (
    <div className="lg:col-span-7 relative h-[480px] w-full bg-[#121214]/60 border border-[#c5a880]/15 rounded overflow-hidden group shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(#c5a880_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.12]" />
      <svg viewBox="0 0 800 450" className="absolute inset-0 w-full h-full stroke-[#c5a880]/15 stroke-[1.5] fill-none">
        <path d="M 0,80 L 800,150" />
        <path d="M 180,0 L 220,450" />
        <path d="M 0,330 L 800,290" />
        <path d="M 580,0 L 520,450" />
        <path d="M 380,0 Q 280,180 420,450" className="stroke-[#c5a880]/25 stroke-[2]" />
        <path d="M 0,380 Q 140,360 280,450" fill="rgba(197, 168, 128, 0.02)" stroke="rgba(197, 168, 128, 0.1)" strokeWidth="3" />
      </svg>

      <div className="absolute top-[200px] left-[310px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <span className="absolute inline-flex h-14 w-14 rounded-full bg-[#c5a880]/20 opacity-70 animate-ping" />
        <span className="absolute inline-flex h-7 w-7 rounded-full bg-[#c5a880]/30 opacity-75 animate-pulse" />
        <div className="relative h-9 w-9 bg-[#c5a880] rounded-full shadow-2xl flex items-center justify-center border border-[#dfcfb8]">
          <MapPin className="h-4.5 w-4.5 text-[#0a0a0c]" />
        </div>
        <div className="mt-3 bg-[#0a0a0c] border border-[#c5a880]/40 text-white px-3 py-1.5 rounded text-[10px] font-bold shadow-2xl flex items-center gap-1.5 whitespace-nowrap tracking-wider uppercase">
          <span>Optimaxx Optik</span>
          <Heart className="h-3 w-3 fill-[#c5a880] stroke-none" />
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 bg-[#0a0a0c]/90 backdrop-blur-md border border-[#c5a880]/20 rounded p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <p className="text-[9px] font-bold text-[#c5a880] uppercase tracking-[0.2em]">
            Ulaşım Kolaylığı
          </p>
          <p className="text-xs font-normal text-white mt-1">
            Kadıköy Moda Tramvayı durağına 3 dakika yürüme mesafesinde.
          </p>
        </div>
        <a
          href="https://maps.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center justify-center rounded bg-white/5 hover:bg-[#c5a880]/20 border border-[#c5a880]/30 px-4 text-[10px] font-bold uppercase tracking-widest text-white transition-colors gap-1.5"
        >
          Haritada Aç
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

export default async function PublicHomePage() {
  const blocks = await getHomeBlocks();
  const hero = firstBlock(blocks, "hero") ?? fallbackBlock("hero");
  const featured = firstBlock(blocks, "featuredProducts") ?? fallbackBlock("featuredProducts");
  const services = firstBlock(blocks, "services") ?? fallbackBlock("services");
  const about = firstBlock(blocks, "about") ?? fallbackBlock("about");
  const hours = firstBlock(blocks, "hours") ?? fallbackBlock("hours");
  const contact = firstBlock(blocks, "contact") ?? fallbackBlock("contact");

  const featuredItems = list(featured, "items", [
    "Güneş Gözlükleri",
    "Optik Çerçeveler",
    "Kontakt Lensler",
  ]);
  const serviceItems = list(services, "items", [
    "Uzman Optisyen Desteği",
    "Bilgisayarlı Hassas Ölçüm",
    "Dijital Odaklama",
    "Resmi Garanti & Orijinallik",
  ]);

  const contactAddress = text(
    contact,
    "address",
    "Caferağa Mah. Moda Cad. No: 123/A Kadıköy, İstanbul",
  );
  const contactPhone = text(contact, "phone", "+90 (216) 555 01 23");
  const mapUrl = text(contact, "mapUrl");
  const whatsappPhone = contactPhone.replace(/\D/g, "") || "905555555555";

  return (
    <div className="relative min-h-screen text-white bg-[#0a0a0c] overflow-x-hidden">
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-36 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 flex flex-col gap-8 text-left relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#c5a880]/10 border border-[#c5a880]/20 px-4 py-1.5 rounded-full text-xs font-semibold text-[#c5a880] self-start tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            {text(hero, "eyebrow", "Seçkin Optik Mühendisliği")}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight leading-[1.1] text-white font-serif">
              {renderHeroTitle(text(hero, "title", "Görme Sanatı, Lüks Tasarımla Buluşuyor"))}
            </h1>
            <div className="h-[1px] w-24 bg-[#c5a880]/40 mt-6" />
          </div>

          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl">
            {text(
              hero,
              "subtitle",
              "Dünya standartlarında optik teknolojileri, el yapımı asetat ve hafif titanyum çerçeveler ile kişiye özel cam tasarımlarını bir araya getiriyoruz.",
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="#collections"
              className="inline-flex h-12 items-center justify-center rounded bg-[#c5a880] px-8 text-xs font-bold uppercase tracking-widest text-[#0a0a0c] shadow-lg shadow-[#c5a880]/10 transition-all hover:bg-[#dfcfb8] hover:scale-[1.02] active:scale-[0.98]"
            >
              Koleksiyonları Keşfet
            </Link>
            <Link
              href="#simulator"
              className="inline-flex h-12 items-center justify-center rounded border border-[#c5a880]/30 bg-white/5 px-8 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:border-[#c5a880] hover:scale-[1.02] active:scale-[0.98]"
            >
              Cam Simülatörü
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center items-center relative">
          {renderHeroImage(text(hero, "imageUrl", "/luxury_eyewear.png"))}
        </div>
      </section>

      <section className="bg-[#121214]/40 border-y border-[#c5a880]/10 py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            Öne Çıkan Seçkin Dünya Markaları
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 text-[13px] font-semibold tracking-[0.25em] text-white/80 font-serif">
            {["RAY-BAN", "GUCCI", "PRADA", "VOGUE", "TOM FORD", "PERSOL"].map((brand) => (
              <span key={brand} className="hover:text-[#c5a880] hover:opacity-100 transition-all duration-300 cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6">
        <LensSimulator />
      </section>

      <section id="collections" className="py-28 container mx-auto px-6 relative z-10 border-b border-[#c5a880]/15">
        <SectionTitle
          eyebrow={text(featured, "subtitle", "Koleksiyon Tasarımı")}
          title={text(featured, "title", "Her Yaşam Tarzına Özel Karakteristik Dokunuşlar")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredItems.slice(0, 3).map((item, index) => {
            const Icon = [Glasses, Eye, Layers][index] ?? Glasses;
            const descriptions = [
              "%100 UV400 korumalı, parlama önleyici polarize cam teknolojileri ve yüz hatlarınızı dengeleyen lüks tasarım hatları.",
              "Hafif titanyum gövdeler, antialerjik özel asetat çerçeveler ve yüksek optik geçirgenliğe sahip reçeteli camlar.",
              "Yüksek oksijen geçirgenliği sunan günlük, aylık, multifokal ve astigmat kontakt lens alternatifleri.",
            ];

            return (
              <div
                key={item}
                className={`group bg-[#121214]/40 border border-[#c5a880]/10 rounded p-8 hover:border-[#c5a880]/40 hover:bg-[#121214]/80 transition-all duration-500 flex flex-col justify-between shadow-lg relative overflow-hidden min-h-[380px] ${
                  index === 1 ? "lg:translate-y-4" : ""
                }`}
              >
                <div>
                  <div className="h-10 w-10 rounded bg-[#c5a880]/10 flex items-center justify-center mb-8 border border-[#c5a880]/20">
                    <Icon className="h-5 w-5 text-[#c5a880]" />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#c5a880]/60 uppercase">
                    {String(index + 1).padStart(2, "0")} / Koleksiyon
                  </span>
                  <h3 className="text-2xl font-normal text-white font-serif mt-2 mb-4">{item}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
                    {descriptions[index] ?? "Mağazada güncel model ve stok seçenekleriyle deneyimlenebilir."}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c5a880] group-hover:translate-x-1.5 transition-transform duration-300 mt-4">
                  Koleksiyonu İncele
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="face-shape-test" className="py-24 container mx-auto px-6">
        <FaceShapeWidget />
      </section>

      <section id="services" className="py-28 bg-[#121214]/20 border-y border-[#c5a880]/15 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
            <div className="lg:col-span-5 text-left flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c5a880]">
                Optik Sanatı
              </span>
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight font-serif">
                {text(services, "title", "Göz Sağlığınız İçin Hassas Çözümler")}
              </h2>
            </div>
            <div className="lg:col-span-7 pt-2">
              <p className="text-white/60 text-sm md:text-base leading-relaxed font-light">
                {text(
                  services,
                  "subtitle",
                  "Optimaxx Optik olarak size en net görüş konforunu ve tarzınızı tamamlayacak lüks aksesuarı hazırlıyoruz.",
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
            {serviceItems.slice(0, 4).map((item, index) => (
              <div key={item} className="flex flex-col gap-4 border-t border-[#c5a880]/20 pt-6 group">
                <div className="text-[11px] font-bold text-[#c5a880] tracking-widest font-serif transition-transform duration-300 group-hover:-translate-y-1">
                  {String(index + 1).padStart(2, "0")} / HİZMET
                </div>
                <h3 className="text-lg font-normal text-white font-serif">{item}</h3>
                <p className="text-white/50 text-xs leading-relaxed font-light">
                  Uzman ekibimiz ihtiyaçlarınızı analiz eder ve mağaza içinde size en uygun çözümü net bir dille sunar.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {about ? (
        <section className="py-24 container mx-auto px-6 border-b border-[#c5a880]/15">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <SectionTitle
                eyebrow="Hakkımızda"
                title={text(about, "title", "Optimaxx Atelier")}
              />
            </div>
            <p className="lg:col-span-7 text-white/60 text-sm md:text-base leading-relaxed font-light">
              {text(
                about,
                "body",
                "Lüks koleksiyonları, hassas cam teknolojisini ve sakin mağaza deneyimini aynı çatı altında birleştiriyoruz.",
              )}
            </p>
          </div>
        </section>
      ) : null}

      <section id="contact" className="py-28 container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c5a880]">
                Bize Ulaşın
              </span>
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight font-serif">
                {text(contact, "title", "Moda'nın Zarif Butiğindeyiz")}
              </h2>
              <div className="w-12 h-[1px] bg-[#c5a880] mt-4" />
            </div>

            <p className="text-white/60 text-sm leading-relaxed font-light">
              Lüks koleksiyonlarımızı yakından deneyimlemek, gözlük ayarlamalarınızı yaptırmak veya özel siparişleriniz için butik mağazamıza davetlisiniz.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-[#121214]/60 border border-[#c5a880]/15 p-4 rounded">
                <MapPin className="h-5 w-5 text-[#c5a880] shrink-0" />
                <div className="text-sm font-light">
                  <p className="font-semibold text-white">Mağaza Adresi</p>
                  <p className="text-white/60 text-xs mt-0.5">{contactAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#121214]/60 border border-[#c5a880]/15 p-4 rounded">
                <Phone className="h-5 w-5 text-[#c5a880] shrink-0" />
                <div className="text-sm font-light">
                  <p className="font-semibold text-white">İletişim Hattı</p>
                  <p className="text-white/60 text-xs mt-0.5">{contactPhone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#121214]/60 border border-[#c5a880]/15 p-4 rounded">
                <Clock className="h-5 w-5 text-[#c5a880] shrink-0" />
                <div className="text-sm font-light">
                  <p className="font-semibold text-white">{text(hours, "title", "Butik Çalışma Saatleri")}</p>
                  <p className="text-white/60 text-xs mt-0.5">
                    Hafta içi: {text(hours, "weekdays", "09:00 - 20:00")} · Cumartesi:{" "}
                    {text(hours, "saturday", "09:00 - 19:30")} · Pazar:{" "}
                    {text(hours, "sunday", "Kapalı")}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded bg-[#c5a880] hover:bg-[#dfcfb8] px-8 text-xs font-bold uppercase tracking-widest text-[#0a0a0c] shadow-lg shadow-[#c5a880]/10 transition-all hover:scale-[1.02] gap-2.5 self-start mt-2"
            >
              <MessageCircle className="h-4.5 w-4.5" />
              WhatsApp Hızlı Destek
            </a>
          </div>

          <MapPanel mapUrl={mapUrl} />
        </div>
      </section>
    </div>
  );
}
