"use client";

import { ResourcePage } from "@/components/management/resource-page";

export default function AnalyticsPage() {
  return (
    <ResourcePage
      title="Analitik"
      description="Düşük stok uyarılarını arayın, sıralayın ve ürün detaylarını inceleyin."
      listPath="/api/v1/admin/analytics/low-stock"
      columns={[
        { key: "sku", label: "SKU" },
        { key: "name", label: "Ürün" },
        { key: "quantity", label: "Stok" },
        { key: "minQuantity", label: "Minimum" },
      ]}
      emptyText="Düşük stok uyarısı bulunamadı."
    />
  );
}
