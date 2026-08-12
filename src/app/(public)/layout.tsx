import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-white transition-colors group-hover:text-teal-300">
              OptiMaxx
            </span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
            <a
              href="#services"
              className="rounded-lg px-3.5 py-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              Hizmetler
            </a>
            <a
              href="#products"
              className="rounded-lg px-3.5 py-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              Ürünler
            </a>
            <a
              href="#brands"
              className="rounded-lg px-3.5 py-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              Markalar
            </a>
            <a
              href="#hours"
              className="rounded-lg px-3.5 py-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              Saatler
            </a>
            <a
              href="#contact"
              className="ml-2 inline-flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 px-4 text-sm font-bold text-slate-950 transition-all hover:shadow-lg hover:shadow-teal-500/20 hover:scale-105"
            >
              İletişim
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-10 text-sm text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-lg font-bold text-white">OptiMaxx</span>
            <p className="mt-1 text-slate-500">Optik ürünler, cam çözümleri ve mağaza hizmetleri.</p>
          </div>
          <span className="text-slate-500">© {new Date().getFullYear()} OptiMaxx. Tüm hakları saklıdır.</span>
        </div>
      </footer>
    </div>
  );
}
