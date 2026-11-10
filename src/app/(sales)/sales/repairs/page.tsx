"use client";

import { useEffect, useState } from "react";
import { Ban, Check, PackageCheck, Wrench } from "lucide-react";
import { ResourcePage } from "@/components/management/resource-page";
import { CustomerPicker } from "@/components/management/customer-picker";
import { MissingTypeNotice } from "@/components/management/missing-type-notice";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { apiPatch, friendlyApiError, translateEnum, type ApiRecord } from "@/lib/management-api";
import { customerName, useCustomerDirectory } from "@/lib/customer-directory";
import { useTransactionTypes } from "@/lib/use-transaction-types";
import { toast } from "@/stores/toast-store";

/** The one sensible next step for each state; cancel is separate (it needs confirmation). */
const NEXT_STEP: Record<string, { status: string; label: string; done: string; icon: typeof Wrench }> = {
  RECEIVED: { status: "IN_PROGRESS", label: "İşleme al", done: "Tamir işleme alındı.", icon: Wrench },
  IN_PROGRESS: { status: "READY_FOR_PICKUP", label: "Hazır", done: "Tamir hazır; müşteriyi arayabilirsiniz.", icon: PackageCheck },
  READY_FOR_PICKUP: { status: "DELIVERED", label: "Teslim et", done: "Gözlük müşteriye teslim edildi.", icon: Check },
};

export default function RepairsPage() {
  const { types, loaded, reload: reloadTypes, defaultTypeId } = useTransactionTypes("REPAIR");
  const { customers, load: loadCustomers } = useCustomerDirectory();

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const nameOf = (item: ApiRecord) => customerName(customers.find((customer) => customer.id === item.customerId)) || "—";
  const noType = loaded && types.length === 0;

  return (
    <ResourcePage
      title="Tamirler"
      description="Gözlük tamirlerini kaydedin ve her adımı tek dokunuşla ilerletin."
      listPath="/api/v1/sales/repairs"
      createPath="/api/v1/sales/repairs"
      labels={{
        create: "Tamir kaydı aç",
        createTitle: "Yeni tamir kaydı",
        submitCreate: "Tamir kaydını aç",
        created: "Tamir kaydı açıldı.",
        searchPlaceholder: "Müşteri veya iş ara",
        detailTitle: "Tamir kaydı",
      }}
      fields={[
        {
          name: "customerId",
          label: "Müşteri",
          required: true,
          wide: true,
          render: ({ value, setValue, id }) => <CustomerPicker id={id} value={value ? String(value) : null} onChange={(customerId) => setValue(customerId)} required />,
        },
        ...(types.length > 1
          ? [{ name: "transactionTypeId", label: "Tamir türü", type: "select" as const, required: true, options: types.map((type) => type.id), optionLabels: Object.fromEntries(types.map((type) => [type.id, type.name])) }]
          : []),
        { name: "title", label: "Yapılacak iş", required: true, placeholder: "Örn. Sap değişimi, vida sıkma" },
        { name: "description", label: "Not", type: "textarea", wide: true, placeholder: "Gözlüğün durumu, müşteriye söylenen teslim günü…" },
      ]}
      defaultValues={defaultTypeId ? { transactionTypeId: defaultTypeId } : undefined}
      transformPayload={(form) => ({ ...form, transactionTypeId: form.transactionTypeId || defaultTypeId })}
      formNotice={noType ? <MissingTypeNotice category="REPAIR" onAdded={reloadTypes} /> : undefined}
      formDisabled={noType}
      defaultSort={{ key: "receivedAt", direction: "desc" }}
      columns={[
        { key: "customerId", label: "Müşteri", value: nameOf, render: nameOf },
        { key: "title", label: "İş" },
        { key: "status", label: "Durum", format: "badge", filterable: true, value: (item) => translateEnum(item.status) },
        { key: "receivedAt", label: "Teslim alındı", format: "datetime" },
        { key: "description", label: "Not", hideOnMobile: true },
      ]}
      rowActions={(item, { reload }) => <RepairActions item={item} customer={nameOf(item)} onChanged={reload} />}
      emptyText="Henüz tamir kaydı yok."
    />
  );
}

function RepairActions({ item, customer, onChanged }: { item: ApiRecord; customer: string; onChanged: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const status = String(item.status ?? "");
  const next = NEXT_STEP[status];
  const cancellable = status === "RECEIVED" || status === "IN_PROGRESS";

  async function move(target: string, done: string) {
    setBusy(true);
    try {
      await apiPatch(`/api/v1/sales/repairs/${item.id}/status`, { status: target });
      toast.success(done);
      await onChanged();
    } catch (error) {
      toast.error(friendlyApiError(error, "Durum değiştirilemedi."));
    } finally {
      setBusy(false);
    }
  }

  if (!next && !cancellable) return null;

  const Icon = next?.icon;
  return (
    <>
      {next && Icon && (
        <Button type="button" size="sm" disabled={busy} onClick={() => void move(next.status, next.done)} aria-label={`${customer}: ${next.label}`}>
          <Icon />
          {next.label}
        </Button>
      )}
      {cancellable && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={busy}
          className="text-red-700 hover:bg-red-50 hover:text-red-800 dark:text-red-300 dark:hover:bg-red-950"
          onClick={() => setCancelOpen(true)}
          aria-label={`${customer}: tamiri iptal et`}
        >
          <Ban />
          <span className="sr-only sm:not-sr-only">İptal</span>
        </Button>
      )}
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Tamir iptal edilsin mi?"
        description={`${customer ? `${customer} için ` : ""}“${String(item.title ?? "tamir")}” kaydı iptal edilecek. Ayrılan parça varsa stoğa geri eklenir. Bu işlem geri alınamaz.`}
        confirmLabel="Tamiri iptal et"
        destructive
        onConfirm={async () => {
          await move("CANCELED", "Tamir iptal edildi.");
          setCancelOpen(false);
        }}
      />
    </>
  );
}
