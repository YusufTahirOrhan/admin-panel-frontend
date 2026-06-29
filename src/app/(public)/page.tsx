import Image from "next/image";
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
    type: "about",
    order: 3,
    enabled: true,
    content: {
      title: "Net görüş için sakin, özenli bir deneyim",
      body: "OptiMaxx, optik ürün seçimini karmaşık olmaktan çıkarıp ihtiyaca uygun, anlaşılır ve güvenilir bir sürece dönüştürür.",
      imageUrl: "",
    },
  },
  {
    type: "hours",
    order: 4,
    enabled: true,
    content: {
      title: "Çalışma Saatleri",
      weekdays: "09:00 - 19:00",
      saturday: "10:00 - 17:00",
      sunday: "Kapalı",
    },
  },
  {
    type: "contact",
    order: 5,
    enabled: true,
    content: {
      title: "Mağazamız",
      phone: "+90 555 123 4567",
      email: "contact@optimaxx.com",
      address: "Merkez Mahallesi, Optik Caddesi No: 1",
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
    if (!response.ok) return fallbackBlocks;
    const page = (await response.json()) as SitePage;
    return page.blocks?.length ? page.blocks : fallbackBlocks;
  } catch {
    return fallbackBlocks;
  }
}

function text(content: PageBlock["content"], key: string, fallback = "") {
  const value = content[key];
  return value === undefined || value === null ? fallback : String(value);
}

function asList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
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

function renderMap(src: string) {
  if (!src) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-lg border bg-slate-100 p-6 text-center text-sm text-slate-500">
        Harita bağlantısı site editöründen eklendiğinde burada görünecek.
      </div>
    );
  }

  return (
    <iframe
      title="OptiMaxx mağaza haritası"
      src={src}
      className="min-h-80 w-full rounded-lg border"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

function renderBlock(block: PageBlock) {
  const content = block.content;
  switch (block.type) {
    case "hero":
      return (
        <section key={block.order} className="bg-slate-950 text-white">
          <div className="mx-auto grid min-h-[72vh] max-w-6xl content-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
                {text(content, "eyebrow", "Optik mağazası")}
              </p>
              <h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
                {text(content, "title", "OptiMaxx Optik")}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {text(content, "subtitle")}
              </p>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-center text-sm">
                {["Optik cam", "Çerçeve", "Bakım"].map((label) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/5 px-3 py-4">
                    <span className="font-semibold text-white">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 p-3">
              {renderImage(text(content, "imageUrl"), "aspect-[4/3] w-full rounded-lg object-cover") ?? (
                <div className="aspect-[4/3] rounded-lg bg-[radial-gradient(circle_at_30%_20%,#5eead4,transparent_28%),linear-gradient(135deg,#0f172a,#1e293b)]" />
              )}
            </div>
          </div>
        </section>
      );
    case "services":
      return (
        <section id="services" key={block.order} className="border-b bg-white px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tight">{text(content, "title", "Hizmetlerimiz")}</h2>
            <p className="mt-3 max-w-2xl text-slate-600">{text(content, "subtitle")}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {asList(content.items).map((item) => (
                <div key={item} className="rounded-lg border p-5 shadow-sm">
                  <h3 className="font-semibold">{item}</h3>
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
        <section id="products" key={block.order} className="border-b bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tight">{text(content, "title", "Öne Çıkanlar")}</h2>
            <p className="mt-3 max-w-2xl text-slate-600">{text(content, "subtitle")}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {asList(content.items).map((item) => (
                <div key={item} className="rounded-lg border bg-white p-5 shadow-sm">
                  <h3 className="font-semibold">{item}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Stok ve model seçenekleri mağaza içinde güncel olarak paylaşılır.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "about":
    case "cta":
      return (
        <section key={block.order} className="border-b bg-white px-6 py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{text(content, "title", "OptiMaxx")}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {text(content, block.type === "about" ? "body" : "subtitle")}
              </p>
            </div>
            {renderImage(text(content, "imageUrl"), "aspect-video w-full rounded-lg object-cover shadow-sm") ?? (
              <div className="aspect-video rounded-lg border bg-slate-100" />
            )}
          </div>
        </section>
      );
    case "hours":
      return (
        <section key={block.order} className="border-b bg-slate-50 px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tight">{text(content, "title", "Çalışma Saatleri")}</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                ["Hafta içi", text(content, "weekdays")],
                ["Cumartesi", text(content, "saturday")],
                ["Pazar", text(content, "sunday")],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border bg-white p-5">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-1 text-lg font-semibold">{value}</p>
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
