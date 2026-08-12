"use client";

import { useEffect, useState } from "react";
import { ResourcePage } from "@/components/management/resource-page";
import { apiGet } from "@/lib/management-api";
import { Settings as SettingsIcon, Package } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export default function InventoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  async function loadCategories() {
    try {
      const data = await apiGet<Category[]>("/api/v1/admin/inventory/categories");
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      } else {
        setCategories([
          { id: "1", name: "Çerçeve", code: "CERCEVE" },
          { id: "2", name: "Güneş Gözlüğü", code: "GUNES_GOZLUGU" },
          { id: "3", name: "Kontak Lens", code: "KONTAK_LENS" },
          { id: "4", name: "Bakım Solüsyonu", code: "SOLUSYON" },
          { id: "5", name: "Aksesuar", code: "AKSESUAR" },
          { id: "6", name: "Yedek Parça", code: "YEDEK_PARCA" },
        ]);
      }
    } catch {
      setCategories([
        { id: "1", name: "Çerçeve", code: "CERCEVE" },
        { id: "2", name: "Güneş Gözlüğü", code: "GUNES_GOZLUGU" },
        { id: "3", name: "Kontak Lens", code: "KONTAK_LENS" },
        { id: "4", name: "Bakım Solüsyonu", code: "SOLUSYON" },
        { id: "5", name: "Aksesuar", code: "AKSESUAR" },
        { id: "6", name: "Yedek Parça", code: "YEDEK_PARCA" },
      ]);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const categoryOptions = categories.map((c) => c.name);

  return (
    <div className="space-y-6">
      {/* Single Clean Header */}
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Package className="size-6 text-emerald-600" />
            Envanter & Stok Yönetimi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stoktaki optik ürünleri ekleyin, stok miktarlarını ve minimum uyarı eşiklerini düzenleyin.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <SettingsIcon className="size-3.5 text-emerald-600" />
          Kategorileri Ayarlarda Yönet
        </Link>
      </div>

      <ResourcePage
        title="Envanter Ürünleri"
        description="Stoktaki optik ürünleri ekleyin ve düzenleyin."
        listPath="/api/v1/admin/inventory/items"
        createPath="/api/v1/admin/inventory/items"
        updatePath={(id) => `/api/v1/admin/inventory/items/${id}`}
        deletePath={(id) => `/api/v1/admin/inventory/items/${id}`}
        hideHeader={true}
        fields={[
          { name: "sku", label: "SKU / Barkod", required: true },
          { name: "name", label: "Ürün Adı", required: true },
          {
            name: "category",
            label: "Kategori",
            type: "select",
            options: categoryOptions.length > 0 ? categoryOptions : ["Çerçeve", "Güneş Gözlüğü", "Kontak Lens", "Bakım Solüsyonu", "Aksesuar", "Yedek Parça"],
            required: true,
          },
          { name: "quantity", label: "Mevcut Stok Miktarı", type: "number", required: true },
          { name: "minQuantity", label: "Minimum Stok Eşiği", type: "number" },
        ]}
        columns={[
          { key: "sku", label: "SKU / Barkod" },
          { key: "name", label: "Ürün Adı" },
          { key: "category", label: "Kategori" },
          { key: "quantity", label: "Stok Miktarı" },
          { key: "minQuantity", label: "Minimum Eşik" },
        ]}
        emptyText="Envanterde henüz ürün kaydı bulunamadı."
      />
    </div>
  );
}
