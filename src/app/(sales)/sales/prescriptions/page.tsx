"use client";

import { useEffect } from "react";
import { ResourcePage } from "@/components/management/resource-page";
import { CustomerPicker } from "@/components/management/customer-picker";
import { MissingTypeNotice } from "@/components/management/missing-type-notice";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiRecord, ResourceField } from "@/lib/management-api";
import { customerName, useCustomerDirectory } from "@/lib/customer-directory";
import { useTransactionTypes } from "@/lib/use-transaction-types";
import { formatDateTime } from "@/lib/format";
import {
  axisRequired,
  eyeFormula,
  normalizeAxis,
  normalizeDiopter,
  normalizePd,
  validateAxis,
  validateDiopter,
  validatePd,
} from "@/lib/prescription";

function eyeFields(side: "right" | "left", group: string): ResourceField[] {
  const cylinder = `${side}Cylinder`;
  const axis = `${side}Axis`;
  return [
    { name: `${side}Sphere`, label: "SPH", group, inputMode: "decimal", placeholder: "-1.25", autoComplete: "off", validate: validateDiopter, normalize: normalizeDiopter },
    { name: cylinder, label: "CYL", group, inputMode: "decimal", placeholder: "-0.50", autoComplete: "off", validate: validateDiopter, normalize: normalizeDiopter },
    {
      name: axis,
      label: "AX (°)",
      group,
      inputMode: "numeric",
      placeholder: "90",
      autoComplete: "off",
      normalize: normalizeAxis,
      validate: (value) => validateAxis(value),
    },
  ];
}

const EYE_AND_NOTES: ResourceField[] = [
  ...eyeFields("right", "Sağ göz (OD)"),
  ...eyeFields("left", "Sol göz (OS)"),
  { name: "pd", label: "PD (mm)", inputMode: "decimal", placeholder: "62 veya 31/31", autoComplete: "off", validate: validatePd, normalize: normalizePd },
  { name: "notes", label: "Not", type: "textarea", wide: true, placeholder: "Kullanım amacı, cam tercihi, doktor adı…" },
];

/** An axis is only checked by `validate` when typed; this adds the "missing axis" rule. */
function withAxisRules(fields: ResourceField[]): ResourceField[] {
  return fields.map((field) => {
    if (field.name !== "rightCylinder" && field.name !== "leftCylinder") return field;
    const side = field.name.startsWith("right") ? "right" : "left";
    return {
      ...field,
      validate: (value, form) => validateDiopter(value) ?? axisRequired(value, form[`${side}Axis`]),
    };
  });
}

export default function PrescriptionsPage() {
  const { types, loaded, reload: reloadTypes, defaultTypeId } = useTransactionTypes("PRESCRIPTION");
  const { customers, load: loadCustomers } = useCustomerDirectory();

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const nameOf = (item: ApiRecord) => customerName(customers.find((customer) => customer.id === item.customerId)) || "—";
  const noType = loaded && types.length === 0;
  const editFields = withAxisRules(EYE_AND_NOTES);

  return (
    <ResourcePage
      title="Reçeteler"
      description="Göz reçetelerini müşteriye bağlı olarak kaydedin."
      listPath="/api/v1/sales/prescriptions"
      createPath="/api/v1/sales/prescriptions"
      updatePath={(id) => `/api/v1/sales/prescriptions/${id}`}
      labels={{
        create: "Reçete ekle",
        createTitle: "Yeni reçete",
        updateTitle: "Reçeteyi düzenle",
        submitCreate: "Reçeteyi kaydet",
        created: "Reçete kaydedildi.",
        updated: "Reçete güncellendi.",
        searchPlaceholder: "Müşteri ara",
        detailTitle: "Reçete",
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
          ? [{ name: "transactionTypeId", label: "Reçete türü", type: "select" as const, required: true, options: types.map((type) => type.id), optionLabels: Object.fromEntries(types.map((type) => [type.id, type.name])) }]
          : []),
        ...editFields,
      ]}
      updateFields={editFields}
      defaultValues={defaultTypeId ? { transactionTypeId: defaultTypeId } : undefined}
      transformPayload={(form, original) => (original ? form : { ...form, transactionTypeId: form.transactionTypeId || defaultTypeId })}
      formNotice={noType ? <MissingTypeNotice category="PRESCRIPTION" onAdded={reloadTypes} /> : undefined}
      formDisabled={noType}
      defaultSort={{ key: "recordedAt", direction: "desc" }}
      columns={[
        { key: "customerId", label: "Müşteri", value: nameOf, render: nameOf },
        { key: "right", label: "Sağ (OD)", sortable: false, value: (item) => eyeFormula(item.rightSphere, item.rightCylinder, item.rightAxis) },
        { key: "left", label: "Sol (OS)", sortable: false, value: (item) => eyeFormula(item.leftSphere, item.leftCylinder, item.leftAxis) },
        { key: "pd", label: "PD", hideOnMobile: true },
        { key: "recordedAt", label: "Tarih", format: "datetime" },
      ]}
      renderDetail={(item, loading) => <PrescriptionCard item={item} customer={nameOf(item)} loading={loading} />}
      emptyText="Henüz reçete yok."
    />
  );
}

function PrescriptionCard({ item, customer, loading }: { item: ApiRecord; customer: string; loading: boolean }) {
  if (loading) return <Skeleton className="h-48 w-full" />;
  const cell = (value: unknown) => (value === null || value === undefined || String(value).trim() === "" ? "—" : String(value));
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-medium">{customer}</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(item.recordedAt)}</p>
      </div>
      <table className="w-full overflow-hidden rounded-lg border text-sm">
        <caption className="sr-only">Reçete değerleri</caption>
        <thead className="bg-muted/50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left font-semibold">
              Göz
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              SPH
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              CYL
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">
              AX
            </th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          <tr className="border-t">
            <th scope="row" className="px-3 py-2 text-left font-medium">
              Sağ (OD)
            </th>
            <td className="px-3 py-2 text-right">{cell(item.rightSphere)}</td>
            <td className="px-3 py-2 text-right">{cell(item.rightCylinder)}</td>
            <td className="px-3 py-2 text-right">{cell(item.rightAxis)}</td>
          </tr>
          <tr className="border-t">
            <th scope="row" className="px-3 py-2 text-left font-medium">
              Sol (OS)
            </th>
            <td className="px-3 py-2 text-right">{cell(item.leftSphere)}</td>
            <td className="px-3 py-2 text-right">{cell(item.leftCylinder)}</td>
            <td className="px-3 py-2 text-right">{cell(item.leftAxis)}</td>
          </tr>
        </tbody>
      </table>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-muted-foreground">PD</dt>
        <dd>{cell(item.pd)}</dd>
        {item.notes ? (
          <>
            <dt className="text-muted-foreground">Not</dt>
            <dd className="whitespace-pre-line">{String(item.notes)}</dd>
          </>
        ) : null}
      </dl>
    </div>
  );
}
