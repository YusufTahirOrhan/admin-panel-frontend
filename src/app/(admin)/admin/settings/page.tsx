"use client";

import { ResourcePage } from "@/components/management/resource-page";

export default function SettingsPage() {
  return (
    <ResourcePage
      title="Ayarlar"
      description="Satış türlerini ve operasyon kategorilerini yönetin."
      listPath="/api/v1/admin/transaction-types"
      createPath="/api/v1/admin/transaction-types"
      updatePath={(id) => `/api/v1/admin/transaction-types/${id}`}
      deletePath={(id) => `/api/v1/admin/transaction-types/${id}`}
      fields={[
        { name: "code", label: "Kod", required: true },
        { name: "name", label: "Ad", required: true },
        { name: "category", label: "Kategori", type: "select", options: ["SALE", "REPAIR", "PRESCRIPTION", "OTHER"] },
        { name: "sortOrder", label: "Sıra", type: "number" },
      ]}
      columns={[
        { key: "code", label: "Kod" },
        { key: "name", label: "Ad" },
        { key: "category", label: "Kategori" },
        { key: "active", label: "Aktif" },
      ]}
      emptyText="Satış türü bulunamadı."
    />
  );
}
