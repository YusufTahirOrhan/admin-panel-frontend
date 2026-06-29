"use client";

import { ResourcePage } from "@/components/management/resource-page";

export default function AdminCustomersPage() {
  return (
    <ResourcePage
      title="Müşteriler"
      description="Müşteri kayıtlarını satış API'si üzerinden oluşturun, düzenleyin ve takip edin."
      listPath="/api/v1/sales/customers"
      createPath="/api/v1/sales/customers"
      updatePath={(id) => `/api/v1/sales/customers/${id}`}
      deletePath={(id) => `/api/v1/sales/customers/${id}`}
      detailPath={(id) => `/api/v1/sales/customers/${id}/summary`}
      fields={[
        { name: "firstName", label: "Ad", required: true },
        { name: "lastName", label: "Soyad", required: true },
        { name: "phone", label: "Telefon" },
        { name: "email", label: "E-posta", type: "email" },
        { name: "notes", label: "Notlar", type: "textarea" },
      ]}
      columns={[
        { key: "firstName", label: "Ad" },
        { key: "lastName", label: "Soyad" },
        { key: "phone", label: "Telefon" },
        { key: "email", label: "E-posta" },
      ]}
      emptyText="Müşteri bulunamadı."
    />
  );
}
