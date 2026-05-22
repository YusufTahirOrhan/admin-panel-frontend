import Image from "next/image";
import Link from "next/link";
import {
  Glasses,
  Eye,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  Compass,
  Award,
  CheckCircle2,
  MessageCircle,
  ArrowUpRight,
  Shield,
  Heart
} from "lucide-react";
import FaceShapeWidget from "@/components/public/face-shape-widget";

export const metadata = {
  title: "Optimaxx Optik & Lens | Zarafet ve Netlik",
  description: "Seçkin dünya markaları, uzman optisyen kadromuz ve en son teknoloji göz ölçüm cihazlarımızla sağlığınız ve stiliniz için güvenilir adres.",
};

export default function PublicHomePage() {
  return (
    <div className="relative min-h-screen text-white bg-[#060e2f] overflow-x-hidden">
      
      {/* ── BACKGROUND ACCENTS ────────────────────────────────────────── */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#14b8a6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[60%] h-[60%] bg-[#d4a00e]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-[#14b8a6]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col gap-6 text-left relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#d4a00e]/15 border border-[#d4a00e]/30 px-4 py-1.5 rounded-full text-xs font-semibold text-[#f6d87a] self-start animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            Seçkin Optik Deneyimi
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Zarafet ve <span className="bg-gradient-to-r from-[#f0c842] to-[#2dd4bf] bg-clip-text text-transparent">Net Görüş</span> Bir Arada
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-xl">
            Dünya standartlarında optik teknolojileri, lüks marka çerçeveler ve kişiselleştirilmiş lens tasarımları ile Optimaxx Optik, görüş kalitenizi sanatla buluşturuyor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="#collections"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#d4a00e] to-[#f0c842] px-8 text-sm font-semibold text-[#060e2f] shadow-lg shadow-[#d4a00e]/25 transition-all hover:shadow-[#d4a00e]/40 hover:scale-[1.03] active:scale-[0.98]"
            >
              Koleksiyonları Keşfet
            </Link>
            <Link
              href="#face-shape-test"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30 hover:scale-[1.03] active:scale-[0.98]"
            >
              Yüz Şekli Testi
            </Link>
          </div>
        </div>

        {/* Hero Image Container with custom frame styling */}
        <div className="lg:col-span-6 flex justify-center items-center relative">
          <div className="absolute w-[80%] h-[80%] bg-[#2dd4bf]/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative border border-white/10 rounded-2xl p-3 bg-white/5 backdrop-blur-sm shadow-2xl overflow-hidden group">
            {/* Corner Decorative Lines */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#f0c842]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#f0c842]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#f0c842]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#f0c842]" />
            
            <Image
              src="/luxury_eyewear.png"
              alt="Premium Eyewear Display"
              width={540}
              height={380}
              className="rounded-xl object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── BRAND LOGOS SLIDER ────────────────────────────────────────── */}
      <section className="bg-[#0d1d4a]/50 border-y border-white/5 py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-6">
            Öne Çıkan Seçkin Dünya Markaları
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 text-lg font-bold tracking-widest text-white/80">
            <span className="hover:text-white hover:opacity-100 transition-all cursor-default">RAY-BAN</span>
            <span className="hover:text-white hover:opacity-100 transition-all cursor-default">GUCCI</span>
            <span className="hover:text-white hover:opacity-100 transition-all cursor-default">PRADA</span>
            <span className="hover:text-white hover:opacity-100 transition-all cursor-default">VOGUE</span>
            <span className="hover:text-white hover:opacity-100 transition-all cursor-default">EMPORIO ARMANI</span>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS SECTION ──────────────────────────────────────── */}
      <section id="collections" className="py-24 container mx-auto px-6 relative z-10">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2dd4bf]">Koleksiyonlarımız</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Her Yaş ve Yaşam Tarzı İçin Seçenekler
          </h2>
          <div className="w-16 h-1 bg-[#f0c842] rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Sunglasses */}
          <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#f0c842]/40 hover:bg-[#0d1d4a]/40 transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[120px] h-[120px] bg-[#f0c842]/5 rounded-full blur-[30px] group-hover:bg-[#f0c842]/10 transition-all" />
            <div>
              <div className="h-12 w-12 rounded-xl bg-[#f0c842]/10 flex items-center justify-center mb-6 border border-[#f0c842]/20">
                <Glasses className="h-6 w-6 text-[#f0c842]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Güneş Gözlükleri</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                %100 UV korumalı polarize camlar ve yüz hatlarınıza zarafet katacak en trend lüks tasarım çerçeveler.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f0c842] group-hover:translate-x-1 transition-transform">
              Koleksiyonu İncele
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          {/* Card 2: Prescription Glasses */}
          <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#2dd4bf]/40 hover:bg-[#0d1d4a]/40 transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[120px] h-[120px] bg-[#2dd4bf]/5 rounded-full blur-[30px] group-hover:bg-[#2dd4bf]/10 transition-all" />
            <div>
              <div className="h-12 w-12 rounded-xl bg-[#2dd4bf]/10 flex items-center justify-center mb-6 border border-[#2dd4bf]/20">
                <Eye className="h-6 w-6 text-[#2dd4bf]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Optik Gözlükler</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Hafif ve dayanıklı titanyum veya asetat çerçevelerle birleşen yüksek kaliteli, yansıma önleyici (anti-refle) dereceli camlar.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2dd4bf] group-hover:translate-x-1 transition-transform">
              Koleksiyonu İncele
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          {/* Card 3: Contact Lenses */}
          <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#f0c842]/40 hover:bg-[#0d1d4a]/40 transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[120px] h-[120px] bg-[#f0c842]/5 rounded-full blur-[30px] group-hover:bg-[#f0c842]/10 transition-all" />
            <div>
              <div className="h-12 w-12 rounded-xl bg-[#f0c842]/10 flex items-center justify-center mb-6 border border-[#f0c842]/20">
                <Sparkles className="h-6 w-6 text-[#f0c842]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Kontakt Lensler</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Günlük, aylık, astigmat (torik) ve renkli alternatiflerle yüksek oksijen geçirgenliği sunan sağlıklı ve konforlu lensler.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f0c842] group-hover:translate-x-1 transition-transform">
              Koleksiyonu İncele
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE WIDGET SECTION ───────────────────────────────── */}
      <section id="face-shape-test" className="py-16 container mx-auto px-6">
        <FaceShapeWidget />
      </section>

      {/* ── SERVICES SECTION ─────────────────────────────────────────── */}
      <section id="services" className="py-24 bg-[#0d1d4a]/30 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2dd4bf]">Hizmetlerimiz</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Göz Sağlığınız İçin Profesyonel Çözümler
            </h2>
            <div className="w-16 h-1 bg-[#f0c842] rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4 bg-[#060e2f]/50 border border-white/10 p-6 rounded-2xl hover:border-[#14b8a6]/40 transition-colors">
              <Award className="h-10 w-10 text-[#2dd4bf] mb-2" />
              <h3 className="text-lg font-bold">Uzman Optisyen Desteği</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Yılların deneyimine sahip sertifikalı optisyenlerimiz, yüzünüze ve göz reçetenize en uygun çözümleri titizlikle hazırlar.
              </p>
            </div>
            <div className="flex flex-col gap-4 bg-[#060e2f]/50 border border-white/10 p-6 rounded-2xl hover:border-[#14b8a6]/40 transition-colors">
              <Eye className="h-10 w-10 text-[#2dd4bf] mb-2" />
              <h3 className="text-lg font-bold">Ücretsiz Bilgisayarlı Ölçüm</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Yeni nesil otorefraktometre cihazlarımız ile göz numaralarınızın hassas ön ölçümünü hızlıca ve ücretsiz gerçekleştiriyoruz.
              </p>
            </div>
            <div className="flex flex-col gap-4 bg-[#060e2f]/50 border border-white/10 p-6 rounded-2xl hover:border-[#14b8a6]/40 transition-colors">
              <CheckCircle2 className="h-10 w-10 text-[#2dd4bf] mb-2" />
              <h3 className="text-lg font-bold">Kişiye Özel Dijital Odaklama</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Dijital odaklama sistemimiz sayesinde camlarınızın çerçevedeki konumu, bakış merkezlerinize milimetrik olarak hizalanır.
              </p>
            </div>
            <div className="flex flex-col gap-4 bg-[#060e2f]/50 border border-white/10 p-6 rounded-2xl hover:border-[#14b8a6]/40 transition-colors">
              <Shield className="h-10 w-10 text-[#2dd4bf] mb-2" />
              <h3 className="text-lg font-bold">Orijinallik & Garanti</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Mağazamızdaki tüm ürünler orijinal olup, adınıza faturalı ve üretici firmaların minimum 2 yıllık garanti belgesi ile teslim edilir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT & MAP SECTION ────────────────────────────────────── */}
      <section id="contact" className="py-24 container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Contact Information Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2dd4bf]">Bizimle İletişime Geçin</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-2">
                Moda'nın Kalbindeyiz
              </h2>
              <div className="w-12 h-1 bg-[#f0c842] rounded-full mt-3" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Sorularınız, ürün stoğu kontrolleri veya özel siparişleriniz için bizi çalışma saatleri içerisinde ziyaret edebilir ya da telefon hattımızdan veya doğrudan WhatsApp'tan bize ulaşabilirsiniz.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-4 bg-[#0d1d4a]/30 border border-white/10 p-4 rounded-xl">
                <MapPin className="h-6 w-6 text-[#f0c842] shrink-0" />
                <div className="text-sm">
                  <p className="font-bold">Mağaza Adresi</p>
                  <p className="text-white/60">Caferağa Mah. Moda Cad. No: 123/A Kadıköy, İstanbul</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-[#0d1d4a]/30 border border-white/10 p-4 rounded-xl">
                <Phone className="h-6 w-6 text-[#f0c842] shrink-0" />
                <div className="text-sm">
                  <p className="font-bold">Telefon & Sipariş Hattı</p>
                  <p className="text-white/60">+90 (216) 555 01 23</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-[#0d1d4a]/30 border border-white/10 p-4 rounded-xl">
                <Clock className="h-6 w-6 text-[#f0c842] shrink-0" />
                <div className="text-sm">
                  <p className="font-bold">Çalışma Saatleri</p>
                  <p className="text-white/60">Pazartesi - Cumartesi: 09:00 - 20:00 (Pazar Kapalı)</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/905555555555"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#14b8a6] hover:bg-[#0d9488] px-8 text-sm font-semibold text-[#060e2f] shadow-lg shadow-[#14b8a6]/25 transition-all hover:scale-[1.02] gap-2 mt-4"
            >
              <MessageCircle className="h-5 w-5 fill-[#060e2f]" />
              WhatsApp ile Hızlı Danışma
            </a>
          </div>

          {/* Interactive Map Showcase Column */}
          <div className="lg:col-span-7 relative h-[450px] w-full bg-[#0d1d4a]/50 border border-white/10 rounded-3xl overflow-hidden group shadow-2xl">
            {/* Visual Grid Mocking a Dark Premium Custom Map */}
            <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
            
            {/* Custom stylized map drawing with vector shapes for a stunning high-end design */}
            <svg viewBox="0 0 800 450" className="absolute inset-0 w-full h-full stroke-white/10 stroke-[2] fill-none">
              {/* Roads / Paths */}
              <path d="M 0,100 L 800,180" />
              <path d="M 200,0 L 250,450" />
              <path d="M 0,350 L 800,320" />
              <path d="M 600,0 L 550,450" />
              <path d="M 400,0 Q 300,200 450,450" className="stroke-[#14b8a6]/30 stroke-[3]" />
              
              {/* Waterway (representing Kadıköy / Bosphorus Shore close to Moda) */}
              <path d="M 0,400 Q 150,380 300,450" fill="rgba(20, 184, 166, 0.05)" stroke="rgba(20, 184, 166, 0.2)" strokeWidth="4" />
            </svg>

            {/* Glowing Map Pointer Marker */}
            <div className="absolute top-[210px] left-[320px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              {/* Ripple animation rings */}
              <span className="absolute inline-flex h-16 w-16 rounded-full bg-[#f0c842]/20 opacity-75 animate-ping" />
              <span className="absolute inline-flex h-8 w-8 rounded-full bg-[#f0c842]/30 opacity-75 animate-pulse" />
              
              <div className="relative h-10 w-10 bg-[#f0c842] rounded-full shadow-xl flex items-center justify-center border-2 border-[#060e2f]">
                <MapPin className="h-5 w-5 text-[#060e2f]" />
              </div>
              
              {/* Tag for the store location */}
              <div className="mt-3 bg-[#060e2f] border border-[#f0c842]/50 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
                <span>Optimaxx Optik</span>
                <Heart className="h-3 w-3 fill-red-500 stroke-none" />
              </div>
            </div>

            {/* Direction Mock Info Overlays */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#060e2f]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">Yol Tarifi</p>
                <p className="text-sm font-bold text-white mt-0.5">Moda Tramvay Durağına 3 Dk. Yürüme Mesafesinde</p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 px-4 text-xs font-semibold text-white transition-colors gap-1.5"
              >
                Google Haritalar'da Aç
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Atmospheric light effects inside the map wrapper */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#f0c842]/5 rounded-full blur-[60px]" />
          </div>

        </div>
      </section>

    </div>
  );
}
