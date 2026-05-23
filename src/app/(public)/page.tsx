import Image from "next/image";
import Link from "next/link";
import {
  Glasses,
  Eye,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  Award,
  CheckCircle2,
  MessageCircle,
  ArrowUpRight,
  Shield,
  Heart,
  ChevronRight,
  Layers
} from "lucide-react";
import FaceShapeWidget from "@/components/public/face-shape-widget";
import LensSimulator from "@/components/public/lens-simulator";

export const metadata = {
  title: "Optimaxx Optik & Lens | Seçkin Estetik ve Hassas Görüş",
  description: "Lüks dünya markaları, kişiye özel hassas cam kesim teknolojileri ve deneyimli optisyen kadromuzla görme kalitenizi sanata dönüştürüyoruz.",
};

export default function PublicHomePage() {
  return (
    <div className="relative min-h-screen text-white bg-[#0a0a0c] overflow-x-hidden">
      
      {/* ── AMBIENT LUXURY GLOWS ─────────────────────────────────────── */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#c5a880]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[25%] right-[-10%] w-[60%] h-[60%] bg-[#c5a880]/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-5%] w-[45%] h-[45%] bg-[#c5a880]/4 rounded-full blur-[130px] pointer-events-none" />

      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-36 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left text panel */}
        <div className="lg:col-span-7 flex flex-col gap-8 text-left relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-[#c5a880]/10 border border-[#c5a880]/20 px-4 py-1.5 rounded-full text-xs font-semibold text-[#c5a880] self-start tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Seçkin Optik Mühendisliği
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight leading-[1.1] text-white font-serif">
              Görme Sanatı, <br />
              <span className="font-normal italic text-[#c5a880] relative">
                Lüks Tasarımla
              </span> <br />
              Buluşuyor
            </h1>
            <div className="h-[1px] w-24 bg-[#c5a880]/40 mt-6" />
          </div>

          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl">
            Dünya standartlarında optik teknolojileri, el yapımı asetat ve hafif titanyum çerçeveler ile kişiye özel cam tasarımlarını bir araya getiriyoruz. Optimaxx Optik ile dünyayı tüm netliğiyle, hak ettiği zarafetle izleyin.
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
              Cihaz Simülatörü
            </Link>
          </div>
        </div>

        {/* Right image layout (Asymmetric Frame) */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          {/* Subtle gold glow behind image */}
          <div className="absolute w-[90%] h-[90%] bg-[#c5a880]/5 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="relative border border-[#c5a880]/15 rounded p-4 bg-[#121214]/60 backdrop-blur-md shadow-2xl overflow-hidden group max-w-md w-full">
            
            {/* High-end decorative corner brackets */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#c5a880]/60" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#c5a880]/60" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#c5a880]/60" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#c5a880]/60" />
            
            <div className="relative overflow-hidden rounded">
              <Image
                src="/luxury_eyewear.png"
                alt="Optimaxx Luxury Eyewear Collection"
                width={500}
                height={350}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.9]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/80 via-transparent to-transparent opacity-60" />
            </div>

            <div className="mt-4 flex justify-between items-center px-1 text-white/50 text-[10px] uppercase tracking-[0.2em] font-semibold">
              <span>Sınırlı Üretim Serisi</span>
              <span className="text-[#c5a880]">Optimaxx Atelier</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND SHOWCASE ───────────────────────────────────────────── */}
      <section className="bg-[#121214]/40 border-y border-[#c5a880]/10 py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            Öne Çıkan Seçkin Dünya Markaları
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 text-[13px] font-semibold tracking-[0.25em] text-white/80 font-serif">
            <span className="hover:text-[#c5a880] hover:opacity-100 transition-all duration-300 cursor-default">RAY-BAN</span>
            <span className="hover:text-[#c5a880] hover:opacity-100 transition-all duration-300 cursor-default">GUCCI</span>
            <span className="hover:text-[#c5a880] hover:opacity-100 transition-all duration-300 cursor-default">PRADA</span>
            <span className="hover:text-[#c5a880] hover:opacity-100 transition-all duration-300 cursor-default">VOGUE</span>
            <span className="hover:text-[#c5a880] hover:opacity-100 transition-all duration-300 cursor-default">TOM FORD</span>
            <span className="hover:text-[#c5a880] hover:opacity-100 transition-all duration-300 cursor-default">PERSOL</span>
          </div>
        </div>
      </section>

      {/* ── LENS SIMULATOR SECTION (INTERACTIVE) ───────────────────────── */}
      <section className="container mx-auto px-6">
        <LensSimulator />
      </section>

      {/* ── COLLECTIONS SECTION ──────────────────────────────────────── 
          Designed as asymmetric modern blocks to look like an high-fashion boutique. */}
      <section id="collections" className="py-28 container mx-auto px-6 relative z-10 border-b border-[#c5a880]/15">
        <div className="text-left flex flex-col gap-4 mb-20 max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c5a880]">Koleksiyon Tasarımı</span>
          <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight font-serif leading-tight">
            Her Yaşam Tarzına Özel <br />
            <span className="italic text-[#c5a880]">Karakteristik Dokunuşlar</span>
          </h2>
          <div className="w-16 h-[1px] bg-[#c5a880] mt-2" />
        </div>

        {/* Asymmetric Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Sunglasses */}
          <div className="group bg-[#121214]/40 border border-[#c5a880]/10 rounded p-8 hover:border-[#c5a880]/40 hover:bg-[#121214]/80 transition-all duration-500 flex flex-col justify-between shadow-lg relative overflow-hidden min-h-[380px]">
            <div className="absolute top-[-20%] right-[-10%] w-[120px] h-[120px] bg-[#c5a880]/3 rounded-full blur-[30px] group-hover:bg-[#c5a880]/6 transition-all" />
            <div>
              <div className="h-10 w-10 rounded bg-[#c5a880]/10 flex items-center justify-center mb-8 border border-[#c5a880]/20">
                <Glasses className="h-5 w-5 text-[#c5a880]" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#c5a880]/60 uppercase">01 / Koruyucu Estetik</span>
              <h3 className="text-2xl font-normal text-white font-serif mt-2 mb-4">Güneş Gözlükleri</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
                %100 UV400 korumalı, parlama önleyici polarize cam teknolojileri ve yüz hatlarınızı en ideal şekilde dengeleyen lüks tasarım hatları.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c5a880] group-hover:translate-x-1.5 transition-transform duration-300 mt-4 cursor-pointer">
              Koleksiyonu İncele
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Card 2: Prescription Glasses (Offset down on larger screens for visual asymmetry) */}
          <div className="group bg-[#121214]/40 border border-[#c5a880]/10 rounded p-8 hover:border-[#c5a880]/40 hover:bg-[#121214]/80 transition-all duration-500 flex flex-col justify-between shadow-lg relative overflow-hidden min-h-[380px] lg:translate-y-4">
            <div className="absolute top-[-20%] right-[-10%] w-[120px] h-[120px] bg-[#c5a880]/3 rounded-full blur-[30px] group-hover:bg-[#c5a880]/6 transition-all" />
            <div>
              <div className="h-10 w-10 rounded bg-[#c5a880]/10 flex items-center justify-center mb-8 border border-[#c5a880]/20">
                <Eye className="h-5 w-5 text-[#c5a880]" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#c5a880]/60 uppercase">02 / Net Odak</span>
              <h3 className="text-2xl font-normal text-white font-serif mt-2 mb-4">Optik Çerçeveler</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
                Hafif ve dayanıklı titanyum gövdeler, antialerjik özel asetat çerçeveler ve yüksek optik geçirgenliğe sahip yansıma korumalı reçeteli camlar.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c5a880] group-hover:translate-x-1.5 transition-transform duration-300 mt-4 cursor-pointer">
              Koleksiyonu İncele
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Card 3: Contact Lenses */}
          <div className="group bg-[#121214]/40 border border-[#c5a880]/10 rounded p-8 hover:border-[#c5a880]/40 hover:bg-[#121214]/80 transition-all duration-500 flex flex-col justify-between shadow-lg relative overflow-hidden min-h-[380px]">
            <div className="absolute top-[-20%] right-[-10%] w-[120px] h-[120px] bg-[#c5a880]/3 rounded-full blur-[30px] group-hover:bg-[#c5a880]/6 transition-all" />
            <div>
              <div className="h-10 w-10 rounded bg-[#c5a880]/10 flex items-center justify-center mb-8 border border-[#c5a880]/20">
                <Layers className="h-5 w-5 text-[#c5a880]" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#c5a880]/60 uppercase">03 / Doğal Temas</span>
              <h3 className="text-2xl font-normal text-white font-serif mt-2 mb-4">Kontakt Lensler</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
                Yüksek oksijen geçirgenliği sunan su dengeli günlük, aylık, multifokal ve astigmat (torik) kontakt lens alternatifleri.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c5a880] group-hover:translate-x-1.5 transition-transform duration-300 mt-4 cursor-pointer">
              Koleksiyonu İncele
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE FACE SHAPE TEST ────────────────────────────────── */}
      <section id="face-shape-test" className="py-24 container mx-auto px-6">
        <FaceShapeWidget />
      </section>

      {/* ── SERVICES / PILLARS SECTION ───────────────────────────────── */}
      <section id="services" className="py-28 bg-[#121214]/20 border-y border-[#c5a880]/15 relative z-10">
        <div className="container mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
            <div className="lg:col-span-5 text-left flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c5a880]">Optik Sanatı</span>
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight font-serif">
                Göz Sağlığınız İçin <br />
                <span className="italic text-[#c5a880]">Hassas Çözümler</span>
              </h2>
            </div>
            <div className="lg:col-span-7 pt-2">
              <p className="text-white/60 text-sm md:text-base leading-relaxed font-light">
                Optimaxx Optik olarak, sadece bir gözlük satmıyoruz; size en net görüş konforunu ve tarzınızı tamamlayacak lüks aksesuarı hazırlıyoruz. Yüksek standartlı laboratuvarımızda her cam, milimetrik odaklama cihazları ile işlenir.
              </p>
            </div>
          </div>

          {/* Clean modern line-separated list representing pillars */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
            
            <div className="flex flex-col gap-4 border-t border-[#c5a880]/20 pt-6 group">
              <div className="text-[11px] font-bold text-[#c5a880] tracking-widest font-serif transition-transform duration-300 group-hover:-translate-y-1">01 / DANIŞMANLIK</div>
              <h3 className="text-lg font-normal text-white font-serif">Uzman Optisyen Desteği</h3>
              <p className="text-white/50 text-xs leading-relaxed font-light">
                Sertifikalı uzmanlarımız reçetenizi analiz eder ve yüz yapınıza en uygun çerçeve ile cam alternatiflerini belirler.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 border-t border-[#c5a880]/20 pt-6 group">
              <div className="text-[11px] font-bold text-[#c5a880] tracking-widest font-serif transition-transform duration-300 group-hover:-translate-y-1">02 / TEKNOLOJİ</div>
              <h3 className="text-lg font-normal text-white font-serif">Bilgisayarlı Hassas Ölçüm</h3>
              <p className="text-white/50 text-xs leading-relaxed font-light">
                Yeni nesil otorefraktometre ve topografi donanımları ile göz yapınızın ön analizini tamamen ücretsiz gerçekleştiriyoruz.
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#c5a880]/20 pt-6 group">
              <div className="text-[11px] font-bold text-[#c5a880] tracking-widest font-serif transition-transform duration-300 group-hover:-translate-y-1">03 / MÜHENDİSLİK</div>
              <h3 className="text-lg font-normal text-white font-serif">Dijital Odaklama</h3>
              <p className="text-white/50 text-xs leading-relaxed font-light">
                Camların çerçevenizdeki duruş açısı ve odak noktası, dijital ölçüm aparatımız yardımıyla milimetrik olarak hizalanır.
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#c5a880]/20 pt-6 group">
              <div className="text-[11px] font-bold text-[#c5a880] tracking-widest font-serif transition-transform duration-300 group-hover:-translate-y-1">04 / GÜVENCE</div>
              <h3 className="text-lg font-normal text-white font-serif">Resmi Garanti & Orijinallik</h3>
              <p className="text-white/50 text-xs leading-relaxed font-light">
                Mağazamızdaki tüm ürünler orijinal olup, adınıza faturalı ve 2 yıllık distribütör garanti belgeleri ile birlikte sunulur.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── CONTACT & HARİTA SECTION (REDESIGNED MAP USING LUXURY BRONZE) ── */}
      <section id="contact" className="py-28 container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Info Details column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c5a880]">Bize Ulaşın</span>
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight font-serif">
                Moda'nın <br />
                <span className="italic text-[#c5a880]">Zarif Butiğindeyiz</span>
              </h2>
              <div className="w-12 h-[1px] bg-[#c5a880] mt-4" />
            </div>
            
            <p className="text-white/60 text-sm leading-relaxed font-light">
              Lüks koleksiyonlarımızı yakından deneyimlemek, gözlük ayarlamalarınızı yaptırmak veya özel siparişleriniz için Kadıköy Moda'daki butik mağazamıza davetlisiniz.
            </p>

            <div className="flex flex-col gap-4">
              
              <div className="flex items-center gap-4 bg-[#121214]/60 border border-[#c5a880]/15 p-4 rounded">
                <MapPin className="h-5 w-5 text-[#c5a880] shrink-0" />
                <div className="text-sm font-light">
                  <p className="font-semibold text-white">Mağaza Adresi</p>
                  <p className="text-white/60 text-xs mt-0.5">Caferağa Mah. Moda Cad. No: 123/A Kadıköy, İstanbul</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-[#121214]/60 border border-[#c5a880]/15 p-4 rounded">
                <Phone className="h-5 w-5 text-[#c5a880] shrink-0" />
                <div className="text-sm font-light">
                  <p className="font-semibold text-white">İletişim Hattı</p>
                  <p className="text-white/60 text-xs mt-0.5">+90 (216) 555 01 23</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-[#121214]/60 border border-[#c5a880]/15 p-4 rounded">
                <Clock className="h-5 w-5 text-[#c5a880] shrink-0" />
                <div className="text-sm font-light">
                  <p className="font-semibold text-white">Butik Çalışma Saatleri</p>
                  <p className="text-white/60 text-xs mt-0.5">Pazartesi - Cumartesi: 09:00 - 20:00 (Pazar Kapalı)</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/905555555555"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded bg-[#c5a880] hover:bg-[#dfcfb8] px-8 text-xs font-bold uppercase tracking-widest text-[#0a0a0c] shadow-lg shadow-[#c5a880]/10 transition-all hover:scale-[1.02] gap-2.5 self-start mt-2"
            >
              <MessageCircle className="h-4.5 w-4.5 fill-[#0a0a0c]" />
              WhatsApp Hızlı Destek
            </a>
          </div>

          {/* Luxury styled dark map panel */}
          <div className="lg:col-span-7 relative h-[480px] w-full bg-[#121214]/60 border border-[#c5a880]/15 rounded overflow-hidden group shadow-2xl">
            
            {/* Fine custom grid backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(#c5a880_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.12]" />
            
            {/* Custom map SVG with matching gold stroke paths */}
            <svg viewBox="0 0 800 450" className="absolute inset-0 w-full h-full stroke-[#c5a880]/15 stroke-[1.5] fill-none">
              {/* Paths representing blocks and roads */}
              <path d="M 0,80 L 800,150" />
              <path d="M 180,0 L 220,450" />
              <path d="M 0,330 L 800,290" />
              <path d="M 580,0 L 520,450" />
              <path d="M 380,0 Q 280,180 420,450" className="stroke-[#c5a880]/25 stroke-[2]" />
              
              {/* Sea view representing the shore near Moda */}
              <path d="M 0,380 Q 140,360 280,450" fill="rgba(197, 168, 128, 0.02)" stroke="rgba(197, 168, 128, 0.1)" strokeWidth="3" />
            </svg>

            {/* Glowing Map Pin Indicator */}
            <div className="absolute top-[200px] left-[310px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              {/* Pulsing luxury bronze rings */}
              <span className="absolute inline-flex h-14 w-14 rounded-full bg-[#c5a880]/20 opacity-70 animate-ping" />
              <span className="absolute inline-flex h-7 w-7 rounded-full bg-[#c5a880]/30 opacity-75 animate-pulse" />
              
              <div className="relative h-9 w-9 bg-[#c5a880] rounded-full shadow-2xl flex items-center justify-center border border-[#dfcfb8]">
                <MapPin className="h-4.5 w-4.5 text-[#0a0a0c]" />
              </div>
              
              {/* Label Tag */}
              <div className="mt-3 bg-[#0a0a0c] border border-[#c5a880]/40 text-white px-3 py-1.5 rounded text-[10px] font-bold shadow-2xl flex items-center gap-1.5 whitespace-nowrap tracking-wider uppercase">
                <span>Optimaxx Optik</span>
                <Heart className="h-3 w-3 fill-[#c5a880] stroke-none" />
              </div>
            </div>

            {/* Bottom info banner (Floating glassmorphic banner) */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#0a0a0c]/90 backdrop-blur-md border border-[#c5a880]/20 rounded p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <p className="text-[9px] font-bold text-[#c5a880] uppercase tracking-[0.2em]">Ulaşım Kolaylığı</p>
                <p className="text-xs font-normal text-white mt-1">Kadıköy Moda Tramvayı durağına 3 dakika yürüme mesafesinde.</p>
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

            {/* Light ambient lighting at top corner */}
            <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-[#c5a880]/5 rounded-full blur-[50px]" />
          </div>

        </div>
      </section>

    </div>
  );
}
