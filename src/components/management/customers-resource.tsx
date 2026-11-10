"use client";

import { Phone, Mail } from "lucide-react";
import { ResourcePage } from "@/components/management/resource-page";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useCustomerDirectory } from "@/lib/customer-directory";
import { formatDate, formatMoney, formatPhone } from "@/lib/format";
import type { ApiRecord } from "@/lib/management-api";

const REPAIR_ORDER = ["RECEIVED", "IN_PROGRESS", "READY_FOR_PICKUP", "DELIVERED", "CANCELED"];

/** Customer list with an at-a-glance history (sales, repairs, prescriptions) in the detail panel. */
export function CustomersResource({ allowDelete }: { allowDelete: boolean }) {
  const invalidateDirectory = useCustomerDirectory((state) => state.invalidate);

  return (
    <ResourcePage
      title="Müşteriler"
      description="Müşteri bilgilerini ve geçmişini tek yerde görün."
      listPath="/api/v1/sales/customers"
      createPath="/api/v1/sales/customers"
      updatePath={(id) => `/api/v1/sales/customers/${id}`}
      deletePath={allowDelete ? (id) => `/api/v1/sales/customers/${id}` : undefined}
      detailPath={(id) => `/api/v1/sales/customers/${id}/summary`}
      labels={{
        create: "Müşteri ekle",
        createTitle: "Yeni müşteri",
        updateTitle: "Müşteriyi düzenle",
        created: "Müşteri eklendi.",
        updated: "Müşteri bilgileri güncellendi.",
        deleted: "Müşteri silindi.",
        deleteTitle: "Müşteri silinsin mi?",
        deleteDescription: "kalıcı olarak kaldırılacak. Satış, tamir veya reçetesi olan müşteriler silinemez.",
        searchPlaceholder: "Ad, soyad veya telefon",
        detailTitle: "Müşteri",
      }}
      fields={[
        { name: "firstName", label: "Ad", required: true, autoComplete: "off" },
        { name: "lastName", label: "Soyad", required: true, autoComplete: "off" },
        { name: "phone", label: "Telefon", type: "text", inputMode: "tel", autoComplete: "off", placeholder: "05xx xxx xx xx" },
        { name: "email", label: "E-posta", type: "email", autoComplete: "off" },
        { name: "notes", label: "Not", type: "textarea", wide: true, placeholder: "Tercihler, hatırlatmalar…" },
      ]}
      transformPayload={(form) => {
        // Pickers on other screens should see this change.
        invalidateDirectory();
        return form;
      }}
      defaultSort={{ key: "name", direction: "asc" }}
      columns={[
        {
          key: "name",
          label: "Müşteri",
          value: (item) => `${String(item.firstName ?? "")} ${String(item.lastName ?? "")}`.trim(),
        },
        { key: "phone", label: "Telefon", render: (item) => formatPhone(item.phone) || "-", value: (item) => String(item.phone ?? "") },
        { key: "email", label: "E-posta", hideOnMobile: true },
        { key: "notes", label: "Not", hideOnMobile: true },
      ]}
      renderDetail={(item, loading) => <CustomerSummary item={item} loading={loading} />}
      emptyText="Henüz müşteri yok."
    />
  );
}

function CustomerSummary({ item, loading }: { item: ApiRecord; loading: boolean }) {
  const counts = (item.repairStatusCounts ?? {}) as Record<string, number>;
  const openRepairs = REPAIR_ORDER.filter((status) => status !== "DELIVERED" && status !== "CANCELED" && (counts[status] ?? 0) > 0);
  const stat = (label: string, value: string, sub?: string) => (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-1.5 text-sm">
        {item.phone ? (
          <a className="flex items-center gap-2 font-medium text-emerald-700 hover:underline dark:text-emerald-400" href={`tel:${String(item.phone).replace(/[^\d+]/g, "")}`}>
            <Phone aria-hidden="true" className="size-4" />
            {formatPhone(item.phone)}
          </a>
        ) : null}
        {item.email ? (
          <a className="flex items-center gap-2 text-muted-foreground hover:underline" href={`mailto:${String(item.email)}`}>
            <Mail aria-hidden="true" className="size-4" />
            {String(item.email)}
          </a>
        ) : null}
        {item.notes ? <p className="whitespace-pre-line rounded-lg bg-muted/40 p-3 text-muted-foreground">{String(item.notes)}</p> : null}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : item.salesCount === undefined ? null : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {stat("Toplam alışveriş", formatMoney(item.totalSalesAmount ?? 0), `${Number(item.salesCount ?? 0)} satış`)}
            {stat("Son satış", item.lastSaleAt ? formatDate(item.lastSaleAt) : "—")}
            {stat("Tamir", String(item.repairCount ?? 0), item.lastRepairAt ? `Son: ${formatDate(item.lastRepairAt)}` : undefined)}
            {stat("Reçete", String(item.prescriptionCount ?? 0), item.lastPrescriptionAt ? `Son: ${formatDate(item.lastPrescriptionAt)}` : undefined)}
          </div>
          {openRepairs.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950">
              <p className="font-medium">Açık tamir</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {openRepairs.map((status) => (
                  <StatusBadge key={status} value={status} label={`${counts[status]} · ${statusLabel(status)}`} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function statusLabel(status: string) {
  return { RECEIVED: "Teslim alındı", IN_PROGRESS: "İşlemde", READY_FOR_PICKUP: "Teslime hazır" }[status] ?? status;
}
