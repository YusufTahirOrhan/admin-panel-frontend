"use client";

import Link from "next/link";
import { Receipt, ShoppingCart } from "lucide-react";
import { ResourcePage } from "@/components/management/resource-page";
import { ShinyText } from "@/components/ui/shiny-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SaleActionButtons, invoiceUrl, refundableAmount, type SaleSummary } from "@/components/sales/sale-actions";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime, formatMoney } from "@/lib/format";
import { translateEnum, type ApiRecord } from "@/lib/management-api";
import { cn } from "@/lib/utils";

const TIMELINE_LABELS: Record<string, string> = {
  SALE_TRANSACTION_CREATED: "Satış oluşturuldu",
  SALE_STOCK_DEDUCTED: "Ürün stoktan düşüldü",
  SALE_TRANSACTION_REFUNDED: "İade yapıldı",
  SALE_TRANSACTION_CANCELED: "Satış iptal edildi",
};

function toSale(item: ApiRecord): SaleSummary {
  return {
    id: String(item.id),
    receiptNumber: item.receiptNumber ? String(item.receiptNumber) : undefined,
    amount: typeof item.amount === "number" ? item.amount : Number(item.amount ?? 0),
    refundedAmount: item.refundedAmount === null || item.refundedAmount === undefined ? null : Number(item.refundedAmount),
    status: item.status ? String(item.status) : undefined,
  };
}

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Receipt className="size-6 text-emerald-600" />
            <ShinyText text="Satışlar" speed={6} />
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Fişleri arayın, fatura indirin, iade ve iptal yapın.</p>
        </div>
        <Link href="/sales" className={cn(buttonVariants(), "h-10 px-4")}>
          <ShoppingCart />
          Kasada yeni satış
        </Link>
      </div>

      <ResourcePage
        title="Satışlar"
        description="Satış kayıtları"
        listPath="/api/v1/sales/transactions?sort=occurredAt,desc"
        detailPath={(id) => `/api/v1/sales/transactions/${id}`}
        hideHeader
        hideInlineForm
        defaultSort={{ key: "occurredAt", direction: "desc" }}
        labels={{ searchPlaceholder: "Fiş no veya müşteri ara", detailTitle: "Satış detayı" }}
        columns={[
          { key: "receiptNumber", label: "Fiş no" },
          { key: "occurredAt", label: "Tarih", format: "datetime" },
          { key: "customerName", label: "Müşteri" },
          { key: "amount", label: "Tutar", format: "money", align: "right" },
          { key: "paymentMethod", label: "Ödeme", filterable: true, hideOnMobile: true },
          { key: "status", label: "Durum", format: "badge", filterable: true, value: (item) => translateEnum(item.status) },
        ]}
        rowActions={(item, { reload }) => <SaleActionButtons sale={toSale(item)} onChanged={reload} compact />}
        renderDetail={(item, loading) => <SaleDetail item={item} loading={loading} />}
        emptyText="Henüz satış yok. Kasadan ilk satışı yaptığınızda burada görünür."
      />
    </div>
  );
}

function SaleDetail({ item, loading }: { item: ApiRecord; loading: boolean }) {
  const sale = toSale(item);
  const refunded = sale.refundedAmount ?? 0;
  const timeline = Array.isArray(item.timeline) ? (item.timeline as ApiRecord[]) : [];
  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{String(item.customerName ?? "Perakende müşteri")}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{formatMoney(sale.amount)}</p>
          </div>
          <StatusBadge value={item.status ?? "COMPLETED"} />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Tarih</dt>
          <dd className="text-right">{formatDateTime(item.occurredAt)}</dd>
          <dt className="text-muted-foreground">Ödeme</dt>
          <dd className="text-right">{translateEnum(item.paymentMethod ?? "CASH")}</dd>
          {item.paymentReference ? (
            <>
              <dt className="text-muted-foreground">Ödeme referansı</dt>
              <dd className="text-right">{String(item.paymentReference)}</dd>
            </>
          ) : null}
          {refunded > 0 && (
            <>
              <dt className="text-muted-foreground">İade edilen</dt>
              <dd className="text-right tabular-nums">{formatMoney(refunded)}</dd>
              <dt className="text-muted-foreground">Kalan</dt>
              <dd className="text-right tabular-nums">{formatMoney(refundableAmount(sale))}</dd>
            </>
          )}
        </dl>
        {item.notes ? <p className="mt-3 border-t pt-3 text-xs leading-5 text-muted-foreground">{String(item.notes)}</p> : null}
        <a className="mt-3 inline-flex text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400" href={invoiceUrl(sale.id)} target="_blank" rel="noreferrer">
          Faturayı indir (PDF)
        </a>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Geçmiş</h3>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : timeline.length === 0 ? (
          <p className="text-sm text-muted-foreground">Kayıtlı hareket yok.</p>
        ) : (
          <ol className="space-y-2 border-l pl-4">
            {timeline.map((event) => (
              <li key={String(event.id)} className="text-sm">
                <p className="font-medium">{TIMELINE_LABELS[String(event.eventType)] ?? String(event.eventType)}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(event.occurredAt)}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
