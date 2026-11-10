"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Settings as SettingsIcon } from "lucide-react";
import { ResourcePage } from "@/components/management/resource-page";
import { StockButton } from "@/components/management/stock-dialog";
import { ShinyText } from "@/components/ui/shiny-text";
import { apiGet, normalizeList, type ApiRecord } from "@/lib/management-api";
import { formatMoney, toNumber } from "@/lib/format";

const FALLBACK_CATEGORIES = ["Çerçeve", "Güneş Gözlüğü", "Kontak Lens", "Bakım Solüsyonu", "Aksesuar", "Yedek Parça"];

function isLow(item: ApiRecord) {
  return Number(item.quantity ?? 0) <= Number(item.minQuantity ?? 0);
}

export default function InventoryPage() {
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    let active = true;
    apiGet<unknown>("/api/v1/admin/inventory/categories")
      .then((data) => {
        const names = normalizeList(data).map((category) => String(category.name ?? "")).filter(Boolean);
        if (active && names.length > 0) setCategories(names);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Package className="size-6 text-emerald-600" />
            <ShinyText text="Envanter" speed={6} />
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Ürünleri, satış fiyatlarını ve stok adetlerini yönetin.</p>
        </div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <SettingsIcon className="size-3.5 text-emerald-600" />
          Kategorileri düzenle
        </Link>
      </div>

      <ResourcePage
        title="Ürünler"
        description="Envanter ürünleri"
        listPath="/api/v1/admin/inventory/items"
        createPath="/api/v1/admin/inventory/items"
        updatePath={(id) => `/api/v1/admin/inventory/items/${id}`}
        deletePath={(id) => `/api/v1/admin/inventory/items/${id}`}
        hideHeader
        labels={{
          create: "Ürün ekle",
          createTitle: "Yeni ürün",
          updateTitle: "Ürünü düzenle",
          created: "Ürün eklendi.",
          updated: "Ürün güncellendi.",
          deleted: "Ürün silindi.",
          deleteTitle: "Ürün silinsin mi?",
          deleteDescription: "envanterden kaldırılacak. Geçmiş satışlar etkilenmez.",
          searchPlaceholder: "Ürün adı, SKU veya kategori",
          detailTitle: "Ürün",
        }}
        fields={[
          { name: "name", label: "Ürün adı", required: true, placeholder: "Örn. Ray-Ban Aviator RB3025" },
          { name: "sku", label: "SKU / barkod", required: true, help: "Barkod okuyucuyla okutabilirsiniz.", autoComplete: "off", hideOnEdit: true },
          { name: "category", label: "Kategori", type: "select", options: categories, required: true },
          {
            name: "salePrice",
            label: "Satış fiyatı (KDV dahil, ₺)",
            // Text, not number: a number input drops "1.499,90" on browsers set to English.
            type: "text",
            inputMode: "decimal",
            autoComplete: "off",
            placeholder: "Örn. 1499,90",
            help: "Kasada sepete bu fiyatla eklenir. Boş bırakılırsa kasada elle girilir.",
            normalize: (value) => (value === "" || value === undefined || value === null ? null : toNumber(value)),
            validate: (value) => {
              const number = toNumber(value);
              return number === null || number < 0 ? "Geçerli bir fiyat girin (örn. 1499,90)." : null;
            },
          },
          {
            name: "quantity",
            label: "Başlangıç stoku",
            type: "number",
            inputMode: "numeric",
            min: 0,
            step: 1,
            required: true,
            hideOnEdit: true,
            help: "Sonraki değişiklikler listedeki Stok düğmesiyle yapılır.",
            validate: (value) => (Number.isInteger(Number(value)) && Number(value) >= 0 ? null : "0 veya daha büyük bir tam sayı girin."),
          },
          {
            name: "minQuantity",
            label: "Uyarı eşiği",
            type: "number",
            inputMode: "numeric",
            min: 0,
            step: 1,
            help: "Stok bu sayıya düşünce panelde uyarı görünür.",
          },
        ]}
        defaultValues={{ quantity: 0, minQuantity: 1 }}
        columns={[
          { key: "name", label: "Ürün" },
          { key: "sku", label: "SKU", hideOnMobile: true },
          { key: "category", label: "Kategori", filterable: true },
          {
            key: "salePrice",
            label: "Fiyat",
            align: "right",
            value: (item) => (item.salePrice === null || item.salePrice === undefined ? "" : formatMoney(item.salePrice)),
            render: (item) =>
              item.salePrice === null || item.salePrice === undefined ? (
                <span className="text-muted-foreground">Fiyat yok</span>
              ) : (
                formatMoney(item.salePrice)
              ),
          },
          {
            key: "quantity",
            label: "Stok",
            align: "right",
            value: (item) => String(item.quantity ?? 0),
            render: (item) => (
              <span className="inline-flex items-center justify-end gap-1.5 tabular-nums">
                {isLow(item) && (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                    {Number(item.quantity ?? 0) === 0 ? "Tükendi" : "Az"}
                  </span>
                )}
                {String(item.quantity ?? 0)}
              </span>
            ),
          },
          { key: "minQuantity", label: "Uyarı eşiği", align: "right", hideOnMobile: true },
        ]}
        rowActions={(item, { reload }) => <StockButton item={item} onChanged={reload} />}
        emptyText="Henüz ürün yok. İlk ürünü ekleyin; kasada satışa hazır olur."
      />
    </div>
  );
}
