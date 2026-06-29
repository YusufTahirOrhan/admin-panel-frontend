"use client";

import { ResourcePage } from "@/components/management/resource-page";

export default function InventoryPage() {
  return (
    <ResourcePage
      title="Envanter"
      description="Ürünleri, stok miktarlarını ve minimum stok eşiklerini yönetin."
      listPath="/api/v1/admin/inventory/items"
      createPath="/api/v1/admin/inventory/items"
      updatePath={(id) => `/api/v1/admin/inventory/items/${id}`}
      deletePath={(id) => `/api/v1/admin/inventory/items/${id}`}
      fields={[
        { name: "sku", label: "SKU", required: true },
        { name: "name", label: "Ürün adı", required: true },
        { name: "category", label: "Kategori", placeholder: "Çerçeve veya Lens" },
        { name: "quantity", label: "Stok", type: "number" },
        { name: "minQuantity", label: "Minimum stok", type: "number" },
      ]}
      columns={[
        { key: "sku", label: "SKU" },
        { key: "name", label: "Ürün" },
        { key: "category", label: "Kategori" },
        { key: "quantity", label: "Stok" },
        { key: "minQuantity", label: "Minimum" },
      ]}
      emptyText="Envanter kaydı bulunamadı."
    />
  );
}
