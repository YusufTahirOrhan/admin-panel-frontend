"use client";

import React, { useEffect, useState } from "react";
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
import { TrendingUp, PieChart as PieIcon, Sparkles, ShoppingBag } from "lucide-react";
import { apiGet, normalizeList } from "@/lib/management-api";

interface Transaction {
  id: string;
  totalAmount?: number;
  quantity?: number;
  transactionDate?: string;
  createdDate?: string;
  itemCategory?: string;
  category?: string;
  type?: { name?: string };
}

const MONTH_NAMES = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

const CATEGORY_COLORS = ["#10b981", "#06b6d4", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-card p-3 shadow-lg text-xs">
        <p className="font-bold text-foreground mb-1">{label} Dönemi</p>
        <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
          Toplam Ciro: {(payload[0]?.value || 0).toLocaleString("tr-TR")} TL
        </p>
        {payload[1] && (
          <p className="text-cyan-600 dark:text-cyan-400">
            Tamamlanan İşlem: {payload[1]?.value || 0} Adet
          </p>
        )}
      </div>
    );
  }
  return null;
}

export function AnalyticsCharts() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await apiGet<any>("/api/v1/sales/transactions?size=200");
        const list = normalizeList(res) as unknown as Transaction[];
        setTransactions(list);
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute last 6 months dynamic trend data from real backend transactions
  const currentDate = new Date();
  const monthlyTrendMap = new Map<string, { ciro: number; islem: number }>();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const label = `${MONTH_NAMES[d.getMonth()]}`;
    monthlyTrendMap.set(label, { ciro: 0, islem: 0 });
  }

  // Aggregate backend transactions by month & category
  const categoryMap = new Map<string, number>();

  transactions.forEach((tx) => {
    const dateStr = tx.transactionDate || tx.createdDate;
    const amount = Number(tx.totalAmount) || 0;
    const cat = tx.itemCategory || tx.category || tx.type?.name || "Diğer";

    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);

    if (dateStr) {
      const txDate = new Date(dateStr);
      const mLabel = MONTH_NAMES[txDate.getMonth()];
      if (monthlyTrendMap.has(mLabel)) {
        const curr = monthlyTrendMap.get(mLabel)!;
        monthlyTrendMap.set(mLabel, {
          ciro: curr.ciro + amount,
          islem: curr.islem + 1,
        });
      }
    }
  });

  const revenueTrendData = Array.from(monthlyTrendMap.entries()).map(([month, val]) => ({
    month,
    ciro: val.ciro,
    islem: val.islem,
  }));

  const categorySalesData = Array.from(categoryMap.entries()).map(([name, count], index) => ({
    name,
    value: count,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  const totalSalesCount = transactions.length;

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
              <h3 className="text-base font-bold text-foreground">Canlı Ciro & İşlem Trend Analizi</h3>
              <p className="text-xs text-muted-foreground">Veritabanındaki gerçek satış kayıtlarına göre canlı performans</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            <Sparkles className="h-3 w-3" /> {totalSalesCount > 0 ? `${totalSalesCount} Canlı Satış` : "Canlı Veri (Henüz Satış Yok)"}
          </span>
        </div>

        {loading ? (
          <div className="h-72 w-full flex items-center justify-center text-xs text-muted-foreground">
            Canlı veriler yükleniyor...
          </div>
        ) : (
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
        )}
      </div>

      {/* Kategori Satış Dağılım Grafiği (Span 1) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <PieIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Canlı Kategori Dağılımı</h3>
            <p className="text-xs text-muted-foreground">İşlemlerin kategori bazlı adetsel dağılımı</p>
          </div>
        </div>

        {loading ? (
          <div className="h-64 w-full flex items-center justify-center text-xs text-muted-foreground">
            Veriler hesaplanıyor...
          </div>
        ) : categorySalesData.length === 0 ? (
          <div className="h-64 w-full flex flex-col items-center justify-center gap-2 text-center p-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-xs font-semibold text-muted-foreground">Henüz Satış Kaydı Yok</p>
            <p className="text-[11px] text-muted-foreground/80">
              Yeni Satış Kaydı oluşturduğunuzda kategori dağılımı burada otomatik çizilecektir.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySalesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categorySalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} Adet Satış`, "Kategori"]} />
                <Legend
                  formatter={(value) => <span className="text-xs font-medium text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
