"use client";

import { useState } from "react";
import { Smile, Check, Sparkles } from "lucide-react";

interface FaceShape {
  id: string;
  name: string;
  description: string;
  recommendations: string[];
  tips: string;
  svgPath: string;
}

const FACE_SHAPES: FaceShape[] = [
  {
    id: "oval",
    name: "Oval Yüz",
    description: "Dengeli oranları, hafifçe daralan çene ve yüksek elmacık kemikleri ile en çok yönlü yüz şeklidir.",
    recommendations: ["Dikdörtgen & Kare Çerçeveler", "Aviator (Damla) Modeller", "Geometrik Tasarımlar"],
    tips: "Hemen hemen her model size yakışır. Yüzünüzün doğal dengesini bozmamak için yüzünüzün en geniş kısmı kadar geniş çerçeveler seçin.",
    svgPath: "M40,5 C55,5 65,15 65,25 C65,33 55,37 40,37 C25,37 15,33 15,25 C15,15 25,5 40,5 Z"
  },
  {
    id: "round",
    name: "Yuvarlak Yüz",
    description: "Benzer genişlik ve uzunluğa sahip, yumuşak kıvrımlı ve belirgin köşeleri olmayan yüz şeklidir.",
    recommendations: ["Köşeli & Dikdörtgen Çerçeveler", "Wayfarer Modelleri", "Kalın Çerçeveler"],
    tips: "Yüzünüzü daha uzun ve ince göstermek için kontrast oluşturacak köşeli ve geniş çerçeveleri tercih edin. Yuvarlak modellerden kaçının.",
    svgPath: "M40,5 C58,5 63,12 63,21 C63,30 58,37 40,37 C22,37 17,30 17,21 C17,12 22,5 40,5 Z"
  },
  {
    id: "square",
    name: "Kare Yüz",
    description: "Geniş alın, belirgin elmacık kemikleri ve güçlü, köşeli bir çene hattı ile karakterize edilir.",
    recommendations: ["Yuvarlak & Oval Çerçeveler", "Kedi Gözü (Cat-Eye)", "İnce Metal Çerçeveler"],
    tips: "Güçlü yüz hatlarınızı yumuşatmak için yuvarlak veya oval çerçeveler seçin. Keskin köşeli çerçeveler yüzünüzü daha sert gösterebilir.",
    svgPath: "M40,5 C52,5 60,7 60,20 C60,33 52,37 40,37 C28,37 20,33 20,20 C20,7 28,5 40,5 Z"
  },
  {
    id: "heart",
    name: "Kalp Yüz",
    description: "Geniş bir alın ve yüksek elmacık kemiklerinden sivri, dar bir çeneye doğru süzülen yüz şeklidir.",
    recommendations: ["Çerçevesiz Modeller", "Alt Kısmı Geniş Çerçeveler", "Açık Renkli Çerçeveler"],
    tips: "Alnınızın genişliğini dengelemek için alt kısmı daha ağır veya geniş modelleri seçin. Üst kısmı aşırı detaylı çerçevelerden kaçının.",
    svgPath: "M40,7 C48,4 61,4 61,19 C61,29 51,34 40,37 C29,34 19,29 19,19 C19,4 32,4 40,7 Z"
  }
];

export default function FaceShapeWidget() {
  const [selectedShape, setSelectedShape] = useState<FaceShape>(FACE_SHAPES[0]);

  return (
    <div className="bg-gradient-to-b from-[#0d1d4a] to-[#060e2f] rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#14b8a6]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Side: Shapes Selector */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-[#14b8a6]/10 text-[#2dd4bf] px-4 py-1.5 rounded-full text-xs font-semibold self-start border border-[#14b8a6]/20">
            <Sparkles className="h-3.5 w-3.5" />
            Akıllı Rehber
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Yüz Şeklinizi Seçin, En Yakışan Çerçeveyi Keşfedin
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Yüz hatlarınızın geometrisi, size en uygun gözlüğü seçerken en önemli rehberdir. Yüz şeklinizi seçerek uzman önerilerimizi görebilirsiniz.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-2">
            {FACE_SHAPES.map((shape) => (
              <button
                key={shape.id}
                onClick={() => setSelectedShape(shape)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300 ${
                  selectedShape.id === shape.id
                    ? "bg-[#14b8a6] border-[#14b8a6] text-[#060e2f] shadow-lg shadow-[#14b8a6]/20 scale-[1.02]"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {/* Face outline mini SVG */}
                <svg
                  viewBox="0 0 80 42"
                  className={`h-8 w-12 stroke-[2] fill-none ${
                    selectedShape.id === shape.id ? "stroke-[#060e2f]" : "stroke-white/60"
                  }`}
                >
                  <path d={shape.svgPath} />
                </svg>
                <span className="font-semibold text-sm">{shape.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Recommendation Card */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative">
          <div className="absolute top-4 right-4 text-white/10">
            <Smile className="h-20 w-20" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#f0c842]">Analiz Sonucu</span>
            <h4 className="text-2xl font-bold text-white mt-1">{selectedShape.name} İçin Öneriler</h4>
            <p className="text-white/70 text-sm mt-3 leading-relaxed">{selectedShape.description}</p>
          </div>

          <div className="border-t border-white/10 pt-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2dd4bf]">Önerilen Gözlük Tipleri</span>
            <div className="flex flex-wrap gap-2.5 mt-3">
              {selectedShape.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] px-3.5 py-1.5 rounded-full text-xs font-semibold"
                >
                  <Check className="h-3.5 w-3.5" />
                  {rec}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#f0c842]/10 border border-[#f0c842]/20 rounded-xl p-4 mt-2">
            <p className="text-xs font-bold text-[#f0c842] uppercase tracking-wider mb-1">Stil Tüyosu</p>
            <p className="text-xs text-white/80 leading-relaxed">{selectedShape.tips}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
