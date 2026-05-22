import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-[#060e2f] text-white border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Information */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0d1d4a] shadow-md">
              <svg
                viewBox="0 0 80 40"
                className="h-4 w-8 fill-none stroke-white stroke-[3.5]"
                aria-hidden="true"
              >
                <circle cx="20" cy="20" r="14" />
                <circle cx="60" cy="20" r="14" />
                <path d="M34 20 C37 17 43 17 46 20" />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              Opti<span className="text-[#f0c842]">Maxx</span>
            </span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Seçkin dünya markaları, yüksek teknolojili kişiye özel cam kesimi ve uzman optisyen kadromuzla göz sağlığınızı en üst düzeyde koruyoruz.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#f0c842] hover:text-[#060e2f] transition-all"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#f0c842] hover:text-[#060e2f] transition-all"
              aria-label="Facebook"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            <a
              href="https://wa.me/905555555555"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#14b8a6] hover:text-[#060e2f] transition-all"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-[#f0c842] mb-6">Hızlı Bağlantılar</h3>
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            <li>
              <Link href="#collections" className="hover:text-white transition-colors">
                Koleksiyonlar
              </Link>
            </li>
            <li>
              <Link href="#services" className="hover:text-white transition-colors">
                Hizmetlerimiz
              </Link>
            </li>
            <li>
              <Link href="#face-shape-test" className="hover:text-white transition-colors">
                Yüz Şekli Testi
              </Link>
            </li>
            <li>
              <Link href="#contact" className="hover:text-white transition-colors">
                İletişim & Konum
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-[#f0c842] mb-6">İletişim</h3>
          <ul className="flex flex-col gap-4 text-sm text-white/70">
            <li className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-[#14b8a6]" />
              <div>
                <p className="font-semibold text-white">Telefon</p>
                <p className="text-white/60">+90 (216) 555 01 23</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Mail className="h-5 w-5 shrink-0 text-[#14b8a6]" />
              <div>
                <p className="font-semibold text-white">E-posta</p>
                <p className="text-white/60">info@optimaxxoptik.com</p>
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-[#14b8a6]" />
              <div>
                <p className="font-semibold text-white">Adres</p>
                <p className="text-white/60">Caferağa Mah. Moda Cad. No: 123/A Kadıköy, İstanbul</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Working Hours */}
        <div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-[#f0c842] mb-6">Çalışma Saatleri</h3>
          <ul className="flex flex-col gap-4 text-sm text-white/70">
            <li className="flex gap-3">
              <Clock className="h-5 w-5 shrink-0 text-[#14b8a6]" />
              <div>
                <p className="font-semibold text-white">Hafta İçi</p>
                <p className="text-white/60">09:00 - 20:00</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Clock className="h-5 w-5 shrink-0 text-[#14b8a6]" />
              <div>
                <p className="font-semibold text-white">Cumartesi</p>
                <p className="text-white/60">09:00 - 19:30</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Clock className="h-5 w-5 shrink-0 text-red-400" />
              <div>
                <p className="font-semibold text-white">Pazar</p>
                <p className="text-white/60">Kapalı</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 border-t border-white/10 mt-12 pt-8 text-center text-xs text-white/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} OptiMaxx Optik & Lens. Tüm hakları saklıdır.</p>
        <p>Sağlığınız İçin Güvenilir Optik Çözümler.</p>
      </div>
    </footer>
  );
}
