"use client";

import { ResourcePage } from "@/components/management/resource-page";

export default function PrescriptionsPage() {
  return (
    <ResourcePage
      title="Reçeteler"
      description="Lens reçetelerini oluşturun ve güncelleyin."
      listPath="/api/v1/sales/prescriptions"
      createPath="/api/v1/sales/prescriptions"
      updatePath={(id) => `/api/v1/sales/prescriptions/${id}`}
      fields={[
        { name: "customerId", label: "Müşteri ID", required: true },
        { name: "transactionTypeId", label: "İşlem türü ID" },
        { name: "rightSphere", label: "Sağ SPH" },
        { name: "leftSphere", label: "Sol SPH" },
        { name: "rightCylinder", label: "Sağ CYL" },
        { name: "leftCylinder", label: "Sol CYL" },
        { name: "pd", label: "PD" },
        { name: "notes", label: "Not", type: "textarea" },
      ]}
      columns={[
        { key: "customerName", label: "Müşteri" },
        { key: "rightSphere", label: "Sağ SPH" },
        { key: "leftSphere", label: "Sol SPH" },
        { key: "pd", label: "PD" },
      ]}
    />
  );
}
