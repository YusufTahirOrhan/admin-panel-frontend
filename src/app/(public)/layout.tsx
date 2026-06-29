import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 border-b bg-white/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-950">
            OptiMaxx
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
            <a href="#services" className="transition-colors hover:text-slate-950">
              Hizmetler
            </a>
            <a href="#products" className="transition-colors hover:text-slate-950">
              Ürünler
            </a>
            <a href="#brands" className="transition-colors hover:text-slate-950">
              Markalar
            </a>
            <a href="#hours" className="transition-colors hover:text-slate-950">
              Saatler
            </a>
            <a href="#contact" className="transition-colors hover:text-slate-950">
              İletişim
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-slate-950 px-6 py-8 text-sm text-slate-300">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} OptiMaxx. Tüm hakları saklıdır.</span>
          <span>Optik ürünler, cam çözümleri ve mağaza hizmetleri.</span>
        </div>
      </footer>
    </div>
  );
}
