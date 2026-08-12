"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, PieChart as PieIcon, Sparkles } from "lucide-react";

const revenueTrendData = [
  { month: "Oca", ciro: 42000, islem: 18 },
  { month: "Şub", ciro: 54000, islem: 24 },
  { month: "Mar", ciro: 61000, islem: 29 },
  { month: "Nis", ciro: 78000, islem: 36 },
  { month: "May", ciro: 95000, islem: 42 },
  { month: "Haz", ciro: 112000, islem: 48 },
  { month: "Tem", ciro: 135000, islem: 55 },
  { month: "Ağu", ciro: 168450, islem: 68 },
];

const categorySalesData = [
  { name: "Çerçeve", value: 45, color: "#10b981" },
  { name: "Güneş Gözlüğü", value: 25, color: "#06b6d4" },
  { name: "Kontak Lens", value: 15, color: "#3b82f6" },
  { name: "Solüsyon", value: 10, color: "#f59e0b" },
  { name: "Aksesuar", value: 5, color: "#8b5cf6" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-card p-3 shadow-lg text-xs">
        <p className="font-bold text-foreground mb-1">{label} Dönemi</p>
        <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
          Toplam Ciro: {payload[0].value.toLocaleString("tr-TR")} TL
        </p>
        {payload[1] && (
          <p className="text-cyan-600 dark:text-cyan-400">
            Tamamlanan İşlem: {payload[1].value} Adet
          </p>
        )}
      </div>
    );
  }
  return null;
}

export function AnalyticsCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Ciro Trend Grafiği (Span 2) */}
      <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Ciro & İşlem Trend Analizi</h3>
              <p className="text-xs text-muted-foreground">Son 8 ayın mağaza performans trend grafiği</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            <Sparkles className="h-3 w-3" /> +24.8% Büyüme
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCiro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorIslem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#888888" />
              <YAxis tick={{ fontSize: 11 }} stroke="#888888" tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="ciro"
                name="Ciro (TL)"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCiro)"
              />
              <Area
                type="monotone"
                dataKey="islem"
                name="İşlem Sayısı"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIslem)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Kategori Satış Dağılım Grafiği (Span 1) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <PieIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Kategori Dağılımı</h3>
            <p className="text-xs text-muted-foreground">Ürün grubu satış payı (%)</p>
          </div>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categorySalesData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {categorySalesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`%${value}`, "Satış Payı"]} />
              <Legend
                formatter={(value) => <span className="text-xs font-medium text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
