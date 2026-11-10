"use client";

import { useEffect, useState } from "react";
import { ResourcePage } from "@/components/management/resource-page";
import { apiGet, normalizeList } from "@/lib/management-api";
import { auditActionLabel, auditActorName, auditDetail, auditResourceLabel } from "@/lib/audit-events";

/** Who did what, in plain words. Rows are read-only. */
export default function AuditsPage() {
  const [usernames, setUsernames] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    apiGet<unknown>("/api/v1/admin/users")
      .then((data) => {
        if (!active) return;
        setUsernames(Object.fromEntries(normalizeList(data).map((user) => [String(user.id), String(user.username ?? "")])));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <ResourcePage
      title="Denetim Kaydı"
      description="Kim, ne zaman, ne yaptı: girişler, satışlar, iadeler, stok ve personel değişiklikleri."
      listPath="/api/v1/admin/audit/events"
      labels={{ searchPlaceholder: "Olay, kişi veya kayıt ara", detailTitle: "Olay" }}
      defaultSort={{ key: "occurredAt", direction: "desc" }}
      columns={[
        { key: "action", label: "Olay", filterable: true, value: (item) => auditActionLabel(item) },
        { key: "occurredAt", label: "Zaman", format: "datetime" },
        { key: "actor", label: "Kim", value: (item) => auditActorName(item, usernames) ?? "Sistem" },
        { key: "detail", label: "Ayrıntı", sortable: false, value: (item) => auditDetail(item) ?? "" },
        { key: "resourceType", label: "Alan", filterable: true, hideOnMobile: true, value: (item) => auditResourceLabel(item.resourceType) },
      ]}
      emptyText="Henüz kayıtlı olay yok."
    />
  );
}
