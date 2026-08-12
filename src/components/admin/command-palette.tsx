"use client";

import { useEffect, useState, useMemo } from "react";
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
  PlusCircle,
  X,
  User,
  Tag,
  Loader2,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { apiGet, normalizeList } from "@/lib/management-api";

interface NavCommand {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigasyon" | "Hızlı Eylemler" | "Müşteriler" | "Envanter Ürünleri";
  icon: any;
  badge?: string;
  action: () => void;
}

interface CustomerRecord {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

interface InventoryItemRecord {
  id: string;
  sku: string;
  name: string;
  category?: string;
  quantity: number;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItemRecord[]>([]);
  const [loadingData, setLoadingData] = useState(false);
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

  // Debounced Live Backend Search when user types query
  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();

    // If query is empty or less than 2 chars, clear customer/item search to avoid loading 100k items
    if (trimmed.length < 2) {
      setCustomers([]);
      setInventory([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingData(true);
      try {
        const searchParam = encodeURIComponent(trimmed);
        const [custRes, invRes] = await Promise.allSettled([
          apiGet<any>(`/api/v1/sales/customers?search=${searchParam}&size=8`),
          apiGet<any>(`/api/v1/admin/inventory/items?search=${searchParam}&size=8`),
        ]);

        if (custRes.status === "fulfilled") {
          const list = normalizeList(custRes.value) as unknown as CustomerRecord[];
          // Client-side fallback filter & slice to max 8 items for performance
          const filtered = list.filter((c) =>
            `${c.firstName} ${c.lastName} ${c.phone || ""} ${c.email || ""}`
              .toLowerCase()
              .includes(trimmed.toLowerCase())
          ).slice(0, 8);
          setCustomers(filtered);
        }

        if (invRes.status === "fulfilled") {
          const list = normalizeList(invRes.value) as unknown as InventoryItemRecord[];
          // Client-side fallback filter & slice to max 8 items for performance
          const filtered = list.filter((item) =>
            `${item.name} ${item.sku} ${item.category || ""}`
              .toLowerCase()
              .includes(trimmed.toLowerCase())
          ).slice(0, 8);
          setInventory(filtered);
        }
      } catch {
        // Ignore search errors
      } finally {
        setLoadingData(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [open, query]);

  const navCommands: NavCommand[] = [
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

  const customerCommands: NavCommand[] = useMemo(() => {
    return customers.map((c) => ({
      id: `cust-${c.id}`,
      title: `${c.firstName} ${c.lastName}`,
      subtitle: [c.phone, c.email].filter(Boolean).join(" • "),
      category: "Müşteriler" as const,
      icon: User,
      badge: "Müşteri",
      action: () => router.push("/admin/customers"),
    }));
  }, [customers, router]);

  const inventoryCommands: NavCommand[] = useMemo(() => {
    return inventory.map((item) => ({
      id: `inv-${item.id}`,
      title: item.name,
      subtitle: `SKU: ${item.sku} ${item.category ? `• ${item.category}` : ""}`,
      category: "Envanter Ürünleri" as const,
      icon: Tag,
      badge: `Stok: ${item.quantity} Adet`,
      action: () => router.push("/admin/inventory"),
    }));
  }, [inventory, router]);

  const filteredNavCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return navCommands;
    return navCommands.filter((cmd) => cmd.title.toLowerCase().includes(q));
  }, [query, navCommands]);

  const allCommands = useMemo(() => {
    return [...filteredNavCommands, ...customerCommands, ...inventoryCommands];
  }, [filteredNavCommands, customerCommands, inventoryCommands]);

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
        <span className="hidden sm:inline">Canlı Arama & Komutlar...</span>
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
              placeholder="Aramak için en az 2 harf yazın (Örn: Ahmet, OPT-102, Lens)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
            {loadingData ? (
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600 mr-2" />
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Commands & Search Results List */}
          <div className="max-h-96 overflow-y-auto p-2 space-y-1">
            {allCommands.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                <Search className="h-8 w-8 opacity-40 text-emerald-600" />
                Aradığınız kriterlere uygun ürün, müşteri veya sayfa bulunamadı.
              </div>
            ) : (
              allCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="truncate text-sm font-semibold">{cmd.title}</p>
                      {cmd.subtitle && (
                        <p className="truncate text-[11px] text-muted-foreground">{cmd.subtitle}</p>
                      )}
                    </div>
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 shrink-0">
                      {cmd.badge || cmd.category}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Helper */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-[11px] text-muted-foreground">
            <span>Seçmek için <kbd className="font-semibold">Click / Enter</kbd></span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {query.trim().length >= 2
                ? `Debounced Server Search Active (${customers.length} Müşteri, ${inventory.length} Ürün)`
                : "Navigasyon & Hızlı Komutlar"}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
