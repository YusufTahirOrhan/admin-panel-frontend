"use client";

import { ResourcePage } from "@/components/management/resource-page";

export default function SalesCustomersPage() {
  return (
    <ResourcePage
      title="Müşteriler"
      description="Müşteri kayıtlarını arayın, oluşturun ve güncelleyin."
      listPath="/api/v1/sales/customers"
      createPath="/api/v1/sales/customers"
      updatePath={(id) => `/api/v1/sales/customers/${id}`}
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
    />
  );
}
