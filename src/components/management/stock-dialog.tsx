"use client";

import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Boxes, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { apiPost, friendlyApiError, type ApiRecord } from "@/lib/management-api";
import { toast } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

type Movement = "IN" | "OUT" | "ADJUST";

const MOVEMENTS: { value: Movement; label: string; help: string; icon: typeof ArrowDownToLine }[] = [
  { value: "IN", label: "Giriş", help: "Gelen ürün stoğa eklenir.", icon: ArrowDownToLine },
  { value: "OUT", label: "Çıkış", help: "Fire, kayıp veya iade edilen ürün stoktan düşülür.", icon: ArrowUpFromLine },
  { value: "ADJUST", label: "Sayım", help: "Rafta saydığınız adet yeni stok olur.", icon: ClipboardCheck },
];

/** Stock in / out / count for one item (the item form cannot change the stock count). */
export function StockButton({ item, onChanged }: { item: ApiRecord; onChanged: () => void | Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [movement, setMovement] = useState<Movement>("IN");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const current = Number(item.quantity ?? 0);
  const name = String(item.name ?? item.sku ?? "Ürün");
  const amount = Number(quantity);
  const preview =
    Number.isInteger(amount) && amount > 0
      ? movement === "IN"
        ? current + amount
        : movement === "OUT"
          ? current - amount
          : amount
      : null;

  async function save() {
    if (!Number.isInteger(amount) || amount <= 0) {
      setError("Sıfırdan büyük, tam sayı bir adet girin.");
      return;
    }
    if (movement === "OUT" && amount > current) {
      setError(`Stokta ${current} adet var; daha fazlası düşülemez.`);
      return;
    }
    try {
      const updated = await apiPost<ApiRecord>(`/api/v1/admin/inventory/items/${item.id}/stock`, {
        movementType: movement,
        quantity: amount,
        reason: reason.trim() || undefined,
      });
      setOpen(false);
      toast.success(`${name}: stok ${String(updated.quantity ?? preview)} adet.`);
      await onChanged();
    } catch (exception) {
      setError(friendlyApiError(exception, "Stok güncellenemedi."));
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={`${name} stok hareketi`}
        onClick={() => {
          setMovement("IN");
          setQuantity("");
          setReason("");
          setError(null);
          setOpen(true);
        }}
      >
        <Boxes />
        Stok
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`${name}: stok hareketi`}
        description={`Şu an stokta ${current} adet var.`}
        confirmLabel="Stoğu güncelle"
        onConfirm={save}
      >
        <div role="radiogroup" aria-label="Hareket türü" className="grid grid-cols-3 gap-2">
          {MOVEMENTS.map((option) => {
            const Icon = option.icon;
            const checked = movement === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={checked}
                onClick={() => {
                  setMovement(option.value);
                  setError(null);
                }}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600",
                  checked ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" : "hover:bg-muted",
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{MOVEMENTS.find((option) => option.value === movement)?.help}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`stock-qty-${item.id}`} className="block text-xs font-semibold">
              {movement === "ADJUST" ? "Sayılan adet" : "Adet"}
            </label>
            <Input
              id={`stock-qty-${item.id}`}
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              autoFocus
              className="mt-1.5 h-10"
              value={quantity}
              aria-invalid={Boolean(error) || undefined}
              aria-describedby={error ? `stock-error-${item.id}` : undefined}
              onChange={(event) => {
                setQuantity(event.target.value);
                setError(null);
              }}
            />
          </div>
          <div className="flex flex-col justify-end text-sm">
            <span className="text-xs text-muted-foreground">Yeni stok</span>
            <span className={cn("mt-1.5 flex h-10 items-center text-lg font-semibold tabular-nums", preview !== null && preview < 0 && "text-red-600")}>
              {preview === null ? "—" : `${preview} adet`}
            </span>
          </div>
        </div>
        <label htmlFor={`stock-reason-${item.id}`} className="mt-3 block text-xs font-semibold">
          Açıklama <span className="font-normal text-muted-foreground">(isteğe bağlı)</span>
        </label>
        <Input
          id={`stock-reason-${item.id}`}
          className="mt-1.5 h-10"
          placeholder={movement === "IN" ? "Örn. Tedarikçi teslimatı" : movement === "OUT" ? "Örn. Kırık ürün" : "Örn. Ay sonu sayımı"}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        {error && (
          <p id={`stock-error-${item.id}`} className="mt-2 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </ConfirmDialog>
    </>
  );
}
