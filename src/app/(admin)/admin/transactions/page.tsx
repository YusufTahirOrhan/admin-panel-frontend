"use client";

import { ResourcePage } from "@/components/management/resource-page";

export default function AdminTransactionsPage() {
  return (
    <ResourcePage
      title="Satışlar"
      description="Satış kayıtlarını izleyin, ödeme türlerine göre filtreleyin ve detaylarını inceleyin."
      listPath="/api/v1/sales/transactions"
      createPath="/api/v1/sales/transactions"
      detailPath={(id) => `/api/v1/sales/transactions/${id}`}
      fields={[
        { name: "customerName", label: "Müşteri adı", required: true },
        { name: "amount", label: "Tutar", type: "number", required: true },
        { name: "paymentMethod", label: "Ödeme", type: "select", options: ["CASH", "CARD", "TRANSFER"] },
        { name: "notes", label: "Not", type: "textarea" },
      ]}
      columns={[
        { key: "receiptNumber", label: "Fiş No" },
        { key: "customerName", label: "Müşteri" },
        { key: "amount", label: "Tutar" },
        { key: "paymentMethod", label: "Ödeme" },
        { key: "status", label: "Durum" },
      ]}
      emptyText="Satış kaydı bulunamadı."
    />
  );
}
