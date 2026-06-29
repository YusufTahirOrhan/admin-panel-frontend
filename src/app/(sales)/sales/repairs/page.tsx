"use client";

import { ResourcePage } from "@/components/management/resource-page";

export default function RepairsPage() {
  return (
    <ResourcePage
      title="Tamirler"
      description="Tamir kayıtlarını oluşturun ve durumlarını takip edin."
      listPath="/api/v1/sales/repairs"
      createPath="/api/v1/sales/repairs"
      updatePath={(id) => `/api/v1/sales/repairs/${id}/status`}
      fields={[
        { name: "title", label: "Başlık", required: true },
        { name: "description", label: "Açıklama", type: "textarea" },
        { name: "customerId", label: "Müşteri ID" },
        { name: "transactionTypeId", label: "İşlem türü ID" },
      ]}
      columns={[
        { key: "title", label: "Başlık" },
        { key: "customerName", label: "Müşteri" },
        { key: "status", label: "Durum" },
        { key: "createdAt", label: "Tarih" },
      ]}
    />
  );
}
