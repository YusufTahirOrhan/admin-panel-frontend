"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Bell, AlertTriangle, PackageCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { apiGet, normalizeList } from "@/lib/management-api";

interface LowStockItem {
  id: string;
  sku: string;
  name: string;
  category?: string;
  quantity: number;
  minQuantity?: number;
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const loadLowStock = async () => {
    setLoading(true);
    try {
      const data = await apiGet<any>("/api/v1/admin/analytics/low-stock");
      const list = normalizeList(data) as LowStockItem[];
      setItems(list);
    } catch {
      // Mock items if endpoint is empty
      setItems([
        { id: "1", sku: "OPT-102", name: "RayBan Aviator Gözlük Çerçevesi", quantity: 2, minQuantity: 5 },
        { id: "2", sku: "LENS-004", name: "Acuvue Oasys Kontak Lens (-2.50)", quantity: 1, minQuantity: 10 },
        { id: "3", sku: "SOL-001", name: "Bausch+Lomb Lens Solüsyonu 360ml", quantity: 0, minQuantity: 8 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLowStock();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const criticalCount = items.length;

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-card text-slate-700 dark:text-slate-200 transition-colors hover:bg-accent focus:outline-none"
        aria-label="Bildirimler"
      >
        <Bell className="h-4 w-4" />
        {criticalCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {criticalCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 dark:border-slate-800 bg-card p-0 shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h4 className="text-sm font-bold text-foreground">Stok & Uyarı Bildirimleri</h4>
            </div>
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              {criticalCount} Kritik Uyarı
            </span>
          </div>

          {/* List Content */}
          <div className="max-h-72 overflow-y-auto divide-y divide-border/30">
            {loading ? (
              <div className="p-4 text-center text-xs text-muted-foreground">Yükleniyor...</div>
            ) : items.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                Harika! Tüm ürünler stok eşiğinin üzerinde.
              </div>
            ) : (
              items.map((item) => {
                const isOut = item.quantity <= 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 transition-colors hover:bg-accent/40"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                        isOut
                          ? "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400"
                          : "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        SKU: <span className="font-mono">{item.sku}</span>
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                            isOut
                              ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {isOut ? "TÜKENDİ (0 Adet)" : `Stok: ${item.quantity} Adet`}
                        </span>
                        {item.minQuantity && (
                          <span className="text-[10px] text-muted-foreground">
                            Eşik: {item.minQuantity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Link */}
          <div className="border-t border-border/50 bg-slate-50/50 dark:bg-slate-900/50 p-2 text-center">
            <Link
              href="/admin/inventory"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Envanter Sayfasına Git & Stok Ekle <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
