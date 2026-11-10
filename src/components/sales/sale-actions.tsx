"use client";

import { useState } from "react";
import { Ban, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { apiPatch, apiPost, friendlyApiError } from "@/lib/management-api";
import { apiUrl } from "@/lib/api-base";
import { formatMoney, toNumber } from "@/lib/format";
import { toast } from "@/stores/toast-store";

export interface SaleSummary {
  id: string;
  receiptNumber?: string;
  amount?: number;
  refundedAmount?: number | null;
  status?: string;
}

export function refundableAmount(sale: SaleSummary): number {
  return Math.max(0, Math.round(((sale.amount ?? 0) - (sale.refundedAmount ?? 0)) * 100) / 100);
}

export function invoiceUrl(saleId: string): string {
  return apiUrl(`/api/v1/sales/transactions/${saleId}/invoice`);
}

/** Invoice, refund and cancel for one sale; used by the POS and the sales list. */
export function SaleActionButtons({ sale, onChanged, compact = false }: { sale: SaleSummary; onChanged: () => void | Promise<void>; compact?: boolean }) {
  const [refundOpen, setRefundOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [refundInput, setRefundInput] = useState("");
  const [refundError, setRefundError] = useState<string | null>(null);
  const remaining = refundableAmount(sale);
  const canceled = sale.status === "CANCELED";
  const receipt = sale.receiptNumber || "Satış";

  async function refund() {
    const amount = toNumber(refundInput);
    if (amount === null || amount <= 0) {
      setRefundError("Sıfırdan büyük bir tutar girin.");
      return;
    }
    if (amount > remaining) {
      setRefundError(`En fazla ${formatMoney(remaining)} iade edilebilir.`);
      return;
    }
    try {
      await apiPost(`/api/v1/sales/transactions/${sale.id}/refund`, { amount: Math.round(amount * 100) / 100, reason: "İade" });
      setRefundOpen(false);
      toast.success(`${receipt}: ${formatMoney(amount)} iade edildi. Ürünler stoğa geri eklendi.`);
      await onChanged();
    } catch (error) {
      setRefundError(friendlyApiError(error, "İade kaydedilemedi."));
    }
  }

  async function cancel() {
    try {
      await apiPatch(`/api/v1/sales/transactions/${sale.id}/status`, { status: "CANCELED" });
      setCancelOpen(false);
      toast.success(`${receipt} iptal edildi. Ürünler stoğa geri eklendi.`);
      await onChanged();
    } catch (error) {
      setCancelOpen(false);
      toast.error(friendlyApiError(error, "Satış iptal edilemedi."));
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={`${receipt} faturasını indir`}
        title="Fatura (PDF)"
        onClick={() => window.open(invoiceUrl(sale.id), "_blank", "noopener,noreferrer")}
      >
        <Download />
        {!compact && "Fatura"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={canceled || remaining <= 0}
        aria-label={`${receipt} için iade`}
        title="İade"
        onClick={() => {
          setRefundInput(remaining.toFixed(2).replace(".", ","));
          setRefundError(null);
          setRefundOpen(true);
        }}
      >
        <RotateCcw />
        {!compact && "İade"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-red-700 hover:bg-red-50 hover:text-red-800 dark:text-red-300 dark:hover:bg-red-950"
        disabled={canceled || sale.status === "REFUNDED"}
        aria-label={`${receipt} satışını iptal et`}
        title="İptal"
        onClick={() => setCancelOpen(true)}
      >
        <Ban />
        {!compact && "İptal"}
      </Button>

      <ConfirmDialog
        open={refundOpen}
        onOpenChange={setRefundOpen}
        title={`${receipt} için iade`}
        description={`İade edilebilecek tutar: ${formatMoney(remaining)}. İlk iadede satıştaki ürünler stoğa geri eklenir.`}
        confirmLabel="İadeyi kaydet"
        onConfirm={refund}
      >
        <label htmlFor={`refund-${sale.id}`} className="block text-xs font-semibold">
          İade tutarı (₺)
        </label>
        <Input
          id={`refund-${sale.id}`}
          inputMode="decimal"
          autoFocus
          className="mt-1.5 h-10"
          value={refundInput}
          aria-invalid={Boolean(refundError) || undefined}
          aria-describedby={refundError ? `refund-${sale.id}-error` : undefined}
          onChange={(event) => {
            setRefundInput(event.target.value);
            setRefundError(null);
          }}
        />
        {refundError && (
          <p id={`refund-${sale.id}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {refundError}
          </p>
        )}
      </ConfirmDialog>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title={`${receipt} iptal edilsin mi?`}
        description="Satış iptal olarak işaretlenir ve stoktan düşülen ürünler geri eklenir. Bu işlem geri alınamaz."
        confirmLabel="Satışı iptal et"
        cancelLabel="Vazgeç"
        destructive
        onConfirm={cancel}
      />
    </>
  );
}
