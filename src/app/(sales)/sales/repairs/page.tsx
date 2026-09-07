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
      updateFields={[
        { name: "status", label: "Tamir durumu", type: "select", required: true,
          options: ["RECEIVED", "IN_PROGRESS", "READY_FOR_PICKUP", "DELIVERED", "CANCELED"],
          optionLabels: { RECEIVED: "Teslim alındı", IN_PROGRESS: "İşlemde", READY_FOR_PICKUP: "Teslime hazır", DELIVERED: "Teslim edildi", CANCELED: "İptal edildi" } },
      ]}
      fields={[
        { name: "title", label: "Başlık", required: true },
        { name: "description", label: "Açıklama", type: "textarea" },
        { name: "customerId", label: "Müşteri ID", required: true },
        { name: "transactionTypeId", label: "İşlem türü ID", required: true },
      ]}
      columns={[
        { key: "title", label: "Başlık" },
        { key: "customerId", label: "Müşteri ID" },
        { key: "status", label: "Durum" },
        { key: "receivedAt", label: "Teslim alınma tarihi" },
      ]}
    />
  );
}
