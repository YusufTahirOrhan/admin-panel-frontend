"use client";

import { useState } from "react";
import { Eye, Monitor, Sun, Moon } from "lucide-react";

type FilterType = "blue" | "polar" | "antireflective";

export default function LensSimulator() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("blue");
  const [sliderPos, setSliderPos] = useState<number>(50);

  const filters = {
    blue: {
      title: "Mavi Işık Filtresi",
      tagline: "Ekran Koruyucu Teknoloji",
      description: "Telefon, tablet ve bilgisayar ekranlarından yayılan zararlı mavi-mor ışığı bloke eder. Göz yorgunluğunu azaltır ve uyku kalitenizi korur.",
      leftLabel: "Standart Cam (Zararlı Mavi Işık)",
      rightLabel: "Optimaxx BlueShield (Koruyucu)",
    },
    polar: {
      title: "Polarize Kaplama",
      tagline: "Yansıma Önleyici Performans",
      description: "Deniz, asfalt veya kar gibi parlak yüzeylerden yansıyan yatay göz kamaştırıcı parlamaları %99 oranında engeller. Netlik ve kontrast sağlar.",
      leftLabel: "Standart Güneş Camı (Parlama Var)",
      rightLabel: "Optimaxx Polarized (Parlasız Görüş)",
    },
    antireflective: {
      title: "Anti-Refle (Yansıma Önleyici)",
      tagline: "Gece Sürüş Konforu",
      description: "Camın ön ve arka yüzeyindeki yansımaları sıfırlayarak ışık geçirgenliğini %99'a çıkarır. Gece sürüşlerinde far parlamalarını ve harelenmeleri önler.",
      leftLabel: "Kaplamasız Cam (Yansıma & Hare)",
      rightLabel: "Optimaxx Anti-Reflective (Net Görüş)",
    }
  };

  return (
    <div id="simulator" className="py-24 border-b border-[#c5a880]/15 relative z-10">
      <div className="text-center flex flex-col items-center gap-4 mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-[#c5a880]">Teknoloji Laboratuvarı</span>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-serif">
          Görüş Kalitenizi Simüle Edin
        </h2>
        <p className="text-white/60 max-w-xl text-sm leading-relaxed">
          Gelişmiş optik kaplamalarımızın ve cam teknolojilerimizin dünyanızı nasıl netleştirdiğini aşağıdaki simülatörle canlı olarak deneyimleyin.
        </p>
        <div className="w-16 h-[1px] bg-[#c5a880] mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Controls & Text */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c5a880]">
              {filters[activeFilter].tagline}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white font-serif">
              {filters[activeFilter].title}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mt-2">
              {filters[activeFilter].description}
            </p>
          </div>

          {/* Filter Select Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={() => setActiveFilter("blue")}
              className={`flex items-center gap-4 p-4 rounded border text-left transition-all ${
                activeFilter === "blue"
                  ? "bg-[#c5a880]/10 border-[#c5a880] text-white"
                  : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className={`h-8 w-8 rounded flex items-center justify-center ${activeFilter === "blue" ? "bg-[#c5a880] text-[#0a0a0c]" : "bg-white/5"}`}>
                <Monitor className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-sm">Mavi Işık Koruması</p>
                <p className="text-[10px] text-white/40">Ekran başında çalışanlar için</p>
              </div>
            </button>

            <button
              onClick={() => setActiveFilter("polar")}
              className={`flex items-center gap-4 p-4 rounded border text-left transition-all ${
                activeFilter === "polar"
                  ? "bg-[#c5a880]/10 border-[#c5a880] text-white"
                  : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className={`h-8 w-8 rounded flex items-center justify-center ${activeFilter === "polar" ? "bg-[#c5a880] text-[#0a0a0c]" : "bg-white/5"}`}>
                <Sun className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-sm">Polarize Kaplama</p>
                <p className="text-[10px] text-white/40">Güneşli ve parıltılı günler için</p>
              </div>
            </button>

            <button
              onClick={() => setActiveFilter("antireflective")}
              className={`flex items-center gap-4 p-4 rounded border text-left transition-all ${
                activeFilter === "antireflective"
                  ? "bg-[#c5a880]/10 border-[#c5a880] text-white"
                  : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className={`h-8 w-8 rounded flex items-center justify-center ${activeFilter === "antireflective" ? "bg-[#c5a880] text-[#0a0a0c]" : "bg-white/5"}`}>
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-sm">Anti-Refle (Gece Sürüşü)</p>
                <p className="text-[10px] text-white/40">Far parlamalarını önlemek için</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Split Screen Slider */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          <div className="relative h-[380px] w-full max-w-[650px] rounded-2xl border border-white/10 overflow-hidden shadow-2xl select-none">
            
            {/* 1. LAYER: Standart / Unfiltered View (Left Side Content) */}
            <div className="absolute inset-0 bg-[#0c0d12]">
              {/* Scene: Blue Light Unfiltered */}
              {activeFilter === "blue" && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-6 relative">
                  <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none" />
                  <div className="w-64 h-40 bg-zinc-900 border border-blue-500/30 rounded-lg flex flex-col items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <div className="w-12 h-1 bg-zinc-700 rounded-full mb-3" />
                    <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">HARSH BLUE GLOW</span>
                    <div className="mt-4 flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                      <span className="text-[10px] text-blue-300/60 font-semibold">High Strain Spectrum</span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col items-center gap-1">
                    <span className="text-xs text-white/60 font-medium">Telefon & Bilgisayar Ekranı</span>
                    <span className="text-[10px] text-red-400 font-bold">Göz Kuruması & Yorgunluk Riski</span>
                  </div>
                </div>
              )}

              {/* Scene: Polarized Unfiltered */}
              {activeFilter === "polar" && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-cyan-950 relative overflow-hidden">
                  {/* Sun and heavy blinding water glare */}
                  <div className="absolute top-10 right-20 w-16 h-16 rounded-full bg-white/40 blur-[4px]" />
                  
                  {/* Big blinding white reflection covering water */}
                  <div className="absolute top-[120px] w-[90%] h-[150px] bg-white/75 blur-[25px] rounded-full" />
                  
                  {/* Abstract Sailboat (barely visible) */}
                  <div className="absolute bottom-24 left-1/3 opacity-30 text-white/40">
                    <svg className="w-20 h-20 fill-current" viewBox="0 0 100 100">
                      <polygon points="50,10 50,70 15,70" />
                      <polygon points="53,20 53,70 80,70" />
                      <rect x="15" y="72" width="65" height="6" rx="3" />
                    </svg>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 text-left">
                    <span className="text-xs font-bold text-white/80">Deniz Manzarası</span>
                    <p className="text-[10px] text-white/50">Göz Kamaştırıcı Beyaz Parlamalar</p>
                  </div>
                </div>
              )}

              {/* Scene: Anti-Reflective Unfiltered */}
              {activeFilter === "antireflective" && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden">
                  {/* Dark Night Road with massive light halos */}
                  <div className="absolute w-[200%] h-0.5 bg-zinc-800 top-[220px] -rotate-6" />
                  
                  {/* Street lamp with huge glowing halo */}
                  <div className="absolute top-20 left-[200px] flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-yellow-200 shadow-[0_0_80px_35px_rgba(254,240,138,0.7)]" />
                    <div className="w-1.5 h-44 bg-zinc-700 mt-2" />
                  </div>

                  {/* Oncoming car headlight with massive flare */}
                  <div className="absolute bottom-16 right-[150px] flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white shadow-[0_0_100px_45px_rgba(255,255,255,0.9)] animate-pulse" />
                    <div className="w-10 h-10 rounded-full bg-white shadow-[0_0_100px_45px_rgba(255,255,255,0.9)] animate-pulse" />
                  </div>

                  <div className="absolute bottom-6 left-6 text-left">
                    <span className="text-xs font-bold text-white/80">Gece Sürüşü</span>
                    <p className="text-[10px] text-yellow-300/70">Farlar ve Sokak Lambalarında Yoğun Yansıma</p>
                  </div>
                </div>
              )}
            </div>

            {/* 2. LAYER: Premium / Filtered View (Right Side Content, width is dynamically masked) */}
            <div
              className="absolute inset-y-0 right-0 border-l-2 border-[#c5a880] shadow-[0_0_15px_rgba(197,168,128,0.4)] overflow-hidden"
              style={{ left: `${sliderPos}%` }}
            >
              <div
                className="absolute inset-y-0 right-0 bg-[#08090d]"
                style={{ width: "650px", right: 0 }}
              >
                {/* Scene: Blue Light Filtered (Warm, relaxing tone) */}
                {activeFilter === "blue" && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-6 relative">
                    {/* Soft relaxing sepia overlay instead of harsh blue */}
                    <div className="absolute inset-0 bg-[#c5a880]/5 pointer-events-none" />
                    <div className="w-64 h-40 bg-zinc-900 border border-[#c5a880]/30 rounded-lg flex flex-col items-center justify-center shadow-[0_0_20px_rgba(197,168,128,0.15)]">
                      <div className="w-12 h-1 bg-zinc-700 rounded-full mb-3" />
                      <span className="text-xs font-mono text-[#c5a880] font-bold uppercase tracking-wider">PROTECTED VIEW</span>
                      <div className="mt-4 flex gap-1.5 items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        </span>
                        <span className="text-[10px] text-emerald-400/80 font-bold">BlueShield Enabled</span>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col items-center gap-1">
                      <span className="text-xs text-white/80 font-medium">Telefon & Bilgisayar Ekranı</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Rahatlatıcı Sıcak Görüş & Melatonin Koruması</span>
                    </div>
                  </div>
                )}

                {/* Scene: Polarized Filtered (Clear water, no glare) */}
                {activeFilter === "polar" && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0f2d37] to-[#041018] relative overflow-hidden">
                    {/* Sun is defined, but no blinding water reflection */}
                    <div className="absolute top-10 right-20 w-12 h-12 rounded-full bg-yellow-100 shadow-md" />
                    
                    {/* Deep ocean is clear and visible! We draw coral and fish silhouettes */}
                    <div className="absolute bottom-10 w-full flex justify-center gap-12 text-teal-500/40">
                      <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm-5.5 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z" />
                      </svg>
                      <svg className="w-10 h-10 fill-current animate-bounce duration-1000" viewBox="0 0 24 24">
                        <path d="M12 2c-.17 0-.34.02-.5.06l-1 2c-.22.44-.04.98.4 1.2l.6.3L10 8H8c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h2l1.5 2.44c.22.44.76.62 1.2.4l1-2c.16-.04.33-.06.5-.06h2c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1h-2l-1.5-2.44c-.22-.44-.76-.62-1.2-.4l-1 2z" />
                      </svg>
                    </div>

                    {/* Abstract Sailboat (Fully sharp and visible) */}
                    <div className="absolute bottom-24 left-1/3 text-white/90">
                      <svg className="w-20 h-20 fill-current" viewBox="0 0 100 100">
                        <polygon points="50,10 50,70 15,70" className="fill-[#c5a880]" />
                        <polygon points="53,20 53,70 80,70" className="fill-white" />
                        <rect x="15" y="72" width="65" height="6" rx="3" className="fill-zinc-800" />
                      </svg>
                    </div>

                    <div className="absolute bottom-6 right-6 text-right">
                      <span className="text-xs font-bold text-[#c5a880]">Deniz Manzarası</span>
                      <p className="text-[10px] text-emerald-400 font-bold">Parlama Engellendi, Doğal Kontrastlar</p>
                    </div>
                  </div>
                )}

                {/* Scene: Anti-Reflective Filtered (Sharp lights, no halos) */}
                {activeFilter === "antireflective" && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#07080a] relative overflow-hidden">
                    {/* Road */}
                    <div className="absolute w-[200%] h-0.5 bg-zinc-800 top-[220px] -rotate-6" />

                    {/* Street lamp - sharp light, no massive halo */}
                    <div className="absolute top-20 left-[200px] flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-yellow-100 shadow-[0_0_15px_4px_rgba(254,240,138,0.5)] border border-yellow-200" />
                      <div className="w-1.5 h-44 bg-zinc-800 mt-3" />
                    </div>

                    {/* Oncoming car headlight - small, sharp circles with light ray beams */}
                    <div className="absolute bottom-16 right-[150px] flex gap-4">
                      <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_20px_5px_rgba(255,255,255,0.7)]" />
                      <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_20px_5px_rgba(255,255,255,0.7)]" />
                    </div>

                    <div className="absolute bottom-6 right-6 text-right">
                      <span className="text-xs font-bold text-[#c5a880]">Gece Sürüşü</span>
                      <p className="text-[10px] text-emerald-400 font-bold">Yansıma Giderildi, Net Gece Görüşü</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Drag Handle Bar and Icon overlay */}
            <div
              className="absolute inset-y-0 -translate-x-1/2 w-9 flex items-center justify-center pointer-events-none group-hover:scale-105 transition-transform"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="h-10 w-10 rounded-full bg-[#c5a880] border border-[#dfcfb8] flex items-center justify-center shadow-lg text-[#0a0a0c]">
                <Eye className="h-4 w-4" />
              </div>
            </div>
            
            {/* Labels for side comparisons */}
            <div className="absolute top-4 left-4 bg-[#0a0a0c]/80 border border-white/10 px-3 py-1.5 rounded-lg pointer-events-none">
              <span className="text-[10px] font-bold tracking-wider text-white/50">{filters[activeFilter].leftLabel}</span>
            </div>
            <div className="absolute top-4 right-4 bg-[#0a0a0c]/80 border border-[#c5a880]/30 px-3 py-1.5 rounded-lg pointer-events-none">
              <span className="text-[10px] font-bold tracking-wider text-[#c5a880]">{filters[activeFilter].rightLabel}</span>
            </div>
          </div>

          {/* Slider input overlay controller */}
          <div className="w-full max-w-[650px] px-2 mt-6 flex flex-col gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#c5a880] transition-colors focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-white/40 uppercase font-semibold mt-1">
              <span>← Klasik Cam Görünümü</span>
              <span className="text-white/60 tracking-wider">İnteraktif Kaydırıcıyı Sürükleyin</span>
              <span>Premium Cam Teknolojisi →</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
