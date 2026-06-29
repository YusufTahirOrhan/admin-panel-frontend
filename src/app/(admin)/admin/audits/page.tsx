"use client";

import { ResourcePage } from "@/components/management/resource-page";

export default function AuditsPage() {
  return (
    <ResourcePage
      title="Denetim Kaydı"
      description="Güvenlik ve işlem olaylarını filtreleyin, sıralayın ve detaylarını kontrol edin."
      listPath="/api/v1/admin/audit/events"
      columns={[
        { key: "eventType", label: "Olay" },
        { key: "resourceType", label: "Kaynak" },
        { key: "resourceId", label: "Kaynak ID" },
        { key: "occurredAt", label: "Zaman" },
      ]}
      emptyText="Denetim olayı bulunamadı."
    />
  );
}
