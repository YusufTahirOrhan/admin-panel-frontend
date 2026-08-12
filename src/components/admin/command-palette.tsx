"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  ShieldCheck,
  BarChart3,
  Globe,
  Sun,
  Moon,
  PlusCircle,
  X,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface NavCommand {
  id: string;
  title: string;
  category: "Navigasyon" | "Hızlı Eylemler";
  icon: any;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands: NavCommand[] = [
    {
      id: "nav-dash",
      title: "Gösterge Paneli Ana Sayfası",
      category: "Navigasyon",
      icon: LayoutDashboard,
      action: () => router.push("/admin"),
    },
    {
      id: "nav-sales",
      title: "Satış İşlemleri & Fişler",
      category: "Navigasyon",
      icon: ShoppingCart,
      action: () => router.push("/admin/transactions"),
    },
    {
      id: "nav-inv",
      title: "Envanter & Stok Yönetimi",
      category: "Navigasyon",
      icon: Package,
      action: () => router.push("/admin/inventory"),
    },
    {
      id: "nav-cust",
      title: "Müşteri Kayıtları & Geçmiş",
      category: "Navigasyon",
      icon: Users,
      action: () => router.push("/admin/customers"),
    },
    {
      id: "nav-sett",
      title: "Sistem & Mağaza Ayarları",
      category: "Navigasyon",
      icon: Settings,
      action: () => router.push("/admin/settings"),
    },
    {
      id: "nav-users",
      title: "Personel & Kullanıcı Hesapları",
      category: "Navigasyon",
      icon: Users,
      action: () => router.push("/admin/users"),
    },
    {
      id: "nav-analytics",
      title: "Raporlar & Analitik",
      category: "Navigasyon",
      icon: BarChart3,
      action: () => router.push("/admin/analytics"),
    },
    {
      id: "nav-audit",
      title: "Sistem Denetim Günlükleri",
      category: "Navigasyon",
      icon: ShieldCheck,
      action: () => router.push("/admin/audits"),
    },
    {
      id: "nav-site",
      title: "Site & Vitrin Düzenleyici",
      category: "Navigasyon",
      icon: Globe,
      action: () => router.push("/admin/site-editor"),
    },
    {
      id: "act-new-sale",
      title: "+ Yeni Satış Kaydı Oluştur",
      category: "Hızlı Eylemler",
      icon: PlusCircle,
      action: () => router.push("/admin/transactions"),
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd: NavCommand) => {
    setOpen(false);
    setQuery("");
    cmd.action();
  };

  return (
    <>
      {/* Trigger Button displayed in top header */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-slate-200/80 dark:hover:bg-slate-800/80"
      >
        <Search className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="hidden sm:inline">Hızlı Komut & Arama...</span>
        <kbd className="pointer-events-none ml-2 hidden rounded border bg-background px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline-block">
          Ctrl K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xl">
          {/* Search Input Bar */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-3">
            <Search className="mr-3 h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <input
              type="text"
              placeholder="Sayfa veya komut arayın... (Örn: Satış, Stok, Müşteri)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Commands List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Aradığınız kriterlere uygun komut veya sayfa bulunamadı.
              </div>
            ) : (
              filteredCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-left">{cmd.title}</span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {cmd.category}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Helper */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-[11px] text-muted-foreground">
            <span>Seçmek için <kbd className="font-semibold">Enter</kbd>, kapatmak için <kbd className="font-semibold">Esc</kbd></span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">OptiMaxx Hızlı Komutlar</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
