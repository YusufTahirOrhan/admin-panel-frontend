"use client";

import { useState } from "react";
import { ResourcePage } from "@/components/management/resource-page";
import { FolderTree, Tag, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShinyText } from "@/components/ui/shiny-text";
import { BlurText } from "@/components/ui/blur-text";

type SettingsTab = "categories" | "transaction-types";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("categories");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <SettingsIcon className="size-6 text-emerald-600" />
            <ShinyText text="Sistem Ayarları & Tanımlamaları" speed={7} />
          </h1>
          <p className="text-sm text-muted-foreground">
            <BlurText text="Optik mağaza stok kategorilerini, satış ve işlem türlerini buradan yönetin." delay={30} animateBy="words" />
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
            activeTab === "categories"
              ? "border-emerald-600 text-emerald-600 font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <FolderTree className="size-4" />
          Ürün & Envanter Kategorileri
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("transaction-types")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
            activeTab === "transaction-types"
              ? "border-emerald-600 text-emerald-600 font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Tag className="size-4" />
          Satış & İşlem Türleri
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "categories" && (
          <ResourcePage
            title="Ürün & Envanter Kategorileri"
            description="Mağazadaki optik çerçeve, gözlük, lens ve solüsyon kategorilerini ekleyin veya silin."
            listPath="/api/v1/admin/inventory/categories"
            createPath="/api/v1/admin/inventory/categories"
            updatePath={(id) => `/api/v1/admin/inventory/categories/${id}`}
            deletePath={(id) => `/api/v1/admin/inventory/categories/${id}`}
            fields={[
              { name: "name", label: "Kategori Adı", required: true, placeholder: "Örn: Güneş Gözlüğü, Kontak Lens" },
              { name: "description", label: "Açıklama", placeholder: "Opsiyonel detay açıklaması..." },
            ]}
            columns={[
              { key: "name", label: "Kategori Adı" },
              { key: "code", label: "Kod" },
              { key: "description", label: "Açıklama" },
              { key: "displayOrder", label: "Sıralama" },
            ]}
            emptyText="Henüz eklenmiş bir kategori bulunamadı."
            hideHeader={true}
          />
        )}

        {activeTab === "transaction-types" && (
          <ResourcePage
            title="Satış & İşlem Türleri"
            description="Mağazada kullanılan satış, bakım ve tamir işlem türlerini yönetin."
            listPath="/api/v1/admin/transaction-types"
            createPath="/api/v1/admin/transaction-types"
            updatePath={(id) => `/api/v1/admin/transaction-types/${id}`}
            deletePath={(id) => `/api/v1/admin/transaction-types/${id}`}
            fields={[
              { name: "code", label: "Kod", required: true, placeholder: "Örn: RETAIL_SALE, REPAIR" },
              { name: "name", label: "İşlem Adı", required: true, placeholder: "Örn: Perakende Satış, Tamir" },
              { name: "category", label: "Kategori", type: "select", options: ["SALE", "REPAIR", "PRESCRIPTION", "OTHER"] },
              { name: "sortOrder", label: "Sıra", type: "number" },
            ]}
            columns={[
              { key: "code", label: "Kod" },
              { key: "name", label: "Ad" },
              { key: "category", label: "Kategori" },
              { key: "active", label: "Aktif" },
            ]}
            emptyText="Henüz tanımlı bir satış türü bulunamadı."
            hideHeader={true}
          />
        )}
      </div>
    </div>
  );
}
