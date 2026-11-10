"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Download, Loader2, Minus, Plus, ReceiptText, ScanBarcode, ShoppingBag, Trash2, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { CustomerPicker } from "@/components/management/customer-picker";
import { MissingTypeNotice } from "@/components/management/missing-type-notice";
import { SaleActionButtons, invoiceUrl } from "@/components/sales/sale-actions";
import { ApiRecord, apiGet, apiPost, friendlyApiError, normalizeList, translateEnum } from "@/lib/management-api";
import { customerName, useCustomerDirectory } from "@/lib/customer-directory";
import { formatDateTime, formatMoney } from "@/lib/format";
import { computeTotals, filterProducts, parseAmount, productForEnter, round2, type DiscountMode } from "@/lib/pos";
import { useTransactionTypes } from "@/lib/use-transaction-types";
import { toast } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

type PaymentMethod = "CASH" | "CARD" | "TRANSFER";

interface Product {
  id: string;
  sku: string;
  name: string;
  category?: string;
  quantity: number;
  salePrice: number | null;
}

interface CartLine {
  product: Product;
  quantity: number;
  /** Text so "1.250,50" can be typed freely. */
  priceText: string;
}

interface Sale {
  id: string;
  receiptNumber?: string;
  customerName?: string;
  amount?: number;
  refundedAmount?: number | null;
  status?: string;
  paymentMethod?: string;
  occurredAt?: string;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Nakit" },
  { value: "CARD", label: "Kart" },
  { value: "TRANSFER", label: "Havale/EFT" },
];
const TAX_RATES = [20, 10, 1, 0];

function toProduct(record: ApiRecord): Product | null {
  if (!record.id) return null;
  const price = record.salePrice === null || record.salePrice === undefined ? null : Number(record.salePrice);
  return {
    id: String(record.id),
    sku: String(record.sku ?? ""),
    name: String(record.name ?? record.sku ?? "Ürün"),
    category: record.category ? String(record.category) : undefined,
    quantity: Math.max(0, Math.floor(Number(record.quantity ?? 0))),
    salePrice: price !== null && Number.isFinite(price) && price > 0 ? price : null,
  };
}

function toSale(record: ApiRecord): Sale | null {
  if (!record.id) return null;
  return {
    id: String(record.id),
    receiptNumber: record.receiptNumber ? String(record.receiptNumber) : undefined,
    customerName: record.customerName ? String(record.customerName) : undefined,
    amount: Number(record.amount ?? 0),
    refundedAmount: record.refundedAmount === null || record.refundedAmount === undefined ? null : Number(record.refundedAmount),
    status: record.status ? String(record.status) : undefined,
    paymentMethod: record.paymentMethod ? String(record.paymentMethod) : undefined,
    occurredAt: record.occurredAt ? String(record.occurredAt) : undefined,
  };
}

function priceToText(price: number | null) {
  return price === null ? "" : price.toFixed(2).replace(".", ",");
}

export function PosPage() {
  const { types, loaded: typesLoaded, reload: reloadTypes } = useTransactionTypes("SALE");
  const customers = useCustomerDirectory((state) => state.customers);
  const [products, setProducts] = useState<Product[]>([]);
  const [recent, setRecent] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [typeChoice, setTypeChoice] = useState("");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [walkInName, setWalkInName] = useState("");
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [discountMode, setDiscountMode] = useState<DiscountMode>("PERCENT");
  const [discountText, setDiscountText] = useState("");
  const [taxRate, setTaxRate] = useState(20);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [paymentReference, setPaymentReference] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  // Missing prices are only marked as errors after an attempt to finish the sale.
  const [priceCheck, setPriceCheck] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const transactionTypeId = types.some((type) => type.id === typeChoice) ? typeChoice : types[0]?.id ?? "";

  const loadProducts = useCallback(async () => {
    const data = await apiGet<unknown>("/api/v1/admin/inventory/items");
    setProducts(normalizeList(data).map(toProduct).filter((product): product is Product => product !== null));
  }, []);

  const loadRecent = useCallback(async () => {
    const data = await apiGet<unknown>("/api/v1/sales/transactions?size=6&sort=occurredAt,desc");
    setRecent(normalizeList(data).map(toSale).filter((sale): sale is Sale => sale !== null));
  }, []);

  const refresh = useCallback(async () => {
    try {
      await Promise.all([loadProducts(), loadRecent()]);
    } catch (error) {
      toast.error(friendlyApiError(error, "Ürünler yüklenemedi."));
    } finally {
      setLoading(false);
    }
  }, [loadProducts, loadRecent]);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  // Ready for the barcode scanner at the till; on phones the keyboard should not pop up by itself.
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) searchRef.current?.focus();
  }, []);

  const filtered = useMemo(() => filterProducts(products, query), [products, query]);
  const lines = cart.map((line) => ({ unitPrice: Math.max(0, parseAmount(line.priceText) || 0), quantity: line.quantity }));
  const discountValue = Math.max(0, parseAmount(discountText) || 0);
  const totals = computeTotals(lines, discountMode, discountValue, taxRate);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const missingPrice = cart.find((line) => !(parseAmount(line.priceText) > 0));
  const selectedCustomer = customers.find((customer) => customer.id === customerId) ?? null;

  function add(product: Product) {
    if (product.quantity <= 0) {
      toast.error(`${product.name} stokta yok.`);
      return;
    }
    const existing = cart.find((line) => line.product.id === product.id);
    if (existing && existing.quantity >= product.quantity) {
      toast.error(`${product.name}: stokta ${product.quantity} adet var.`);
      return;
    }
    setLastSale(null);
    setCart((current) =>
      existing
        ? current.map((line) => (line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line))
        : [...current, { product, quantity: 1, priceText: priceToText(product.salePrice) }],
    );
  }

  function changeQuantity(productId: string, delta: number) {
    setCart((current) =>
      current
        .map((line) => {
          if (line.product.id !== productId) return line;
          const next = line.quantity + delta;
          if (next > line.product.quantity) {
            toast.error(`${line.product.name}: stokta ${line.product.quantity} adet var.`);
            return line;
          }
          return { ...line, quantity: next };
        })
        .filter((line) => line.quantity > 0),
    );
  }

  function startNewSale() {
    setLastSale(null);
    searchRef.current?.focus();
  }

  async function completeSale() {
    if (cart.length === 0 || saving) return;
    if (!transactionTypeId) {
      toast.error("Satış türü yok. Önce bir satış türü ekleyin.");
      return;
    }
    if (missingPrice) {
      setPriceCheck(true);
      toast.error(`${missingPrice.product.name} için fiyat girin.`);
      document.getElementById(`pos-price-${missingPrice.product.id}`)?.focus();
      return;
    }
    if (totals.total <= 0) {
      toast.error("Toplam tutar sıfırdan büyük olmalı.");
      return;
    }

    setSaving(true);
    try {
      const name = selectedCustomer ? customerName(selectedCustomer) : walkInName.trim() || "Perakende müşteri";
      const record = await apiPost<ApiRecord>("/api/v1/sales/transactions", {
        transactionTypeId,
        customerId: selectedCustomer?.id,
        customerName: name,
        amount: totals.total,
        paymentMethod,
        paymentReference: paymentMethod !== "CASH" && paymentReference.trim() ? paymentReference.trim() : undefined,
        items: cart.map((line, index) => ({
          inventoryItemId: line.product.id,
          name: line.product.name,
          sku: line.product.sku,
          quantity: line.quantity,
          unitPrice: round2(lines[index].unitPrice),
          lineTotal: round2(lines[index].unitPrice * line.quantity),
        })),
        notes: [
          `Ara toplam: ${totals.subtotal.toFixed(2)}`,
          totals.discount > 0 ? `İndirim: ${totals.discount.toFixed(2)} (${discountMode === "PERCENT" ? `%${discountValue}` : "tutar"})` : null,
          `KDV dahil: ${totals.tax.toFixed(2)} (%${taxRate})`,
          `Ürünler: ${cart.map((line) => `${line.quantity} x ${line.product.name}`).join(", ")}`,
        ]
          .filter(Boolean)
          .join(" | "),
      });
      const sale = toSale(record);
      setCart([]);
      setCustomerId(null);
      setWalkInName("");
      setShowWalkIn(false);
      setDiscountText("");
      // Each sale starts from cash so a card choice is never carried over by accident.
      setPaymentMethod("CASH");
      setPaymentReference("");
      setPriceCheck(false);
      setLastSale(sale);
      toast.success(`Satış tamamlandı${sale?.receiptNumber ? `: ${sale.receiptNumber}` : "."}`);
      await refresh();
    } catch (error) {
      toast.error(friendlyApiError(error, "Satış kaydedilemedi."));
    } finally {
      setSaving(false);
    }
  }

  return (
    // DOM order is products, cart, recent sales: on phones the cart comes right after the products.
    // On large screens the cart sits in its own column spanning both rows.
    <div className="grid gap-4 pb-24 lg:grid-cols-[minmax(0,1fr)_360px] lg:grid-rows-[auto_1fr] lg:pb-0 xl:grid-cols-[minmax(0,1fr)_400px]">
      <section aria-labelledby="pos-products" className="min-w-0 rounded-xl border bg-card shadow-sm lg:col-start-1 lg:row-start-1">
        <h2 id="pos-products" className="sr-only">
          Ürünler
        </h2>
        <div className="border-b p-3 sm:p-4">
          <label htmlFor="pos-search" className="sr-only">
            Ürün ara veya barkod okut
          </label>
          <div className="relative">
            <ScanBarcode aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="pos-search"
              ref={searchRef}
              autoComplete="off"
              enterKeyHint="search"
              className="h-12 pl-10 text-base"
              placeholder="Barkod okutun veya ürün adı yazın"
              value={query}
              aria-describedby="pos-search-help"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const product = productForEnter(products, query);
                  if (product) {
                    add(product);
                    setQuery("");
                  } else if (query.trim()) {
                    toast.info(filtered.length === 0 ? `“${query.trim()}” ile eşleşen ürün yok.` : "Birden fazla ürün eşleşti; listeden seçin.");
                  }
                } else if (event.key === "Escape") {
                  setQuery("");
                }
              }}
            />
            {query && (
              <button
                type="button"
                aria-label="Aramayı temizle"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <p id="pos-search-help" className="mt-1.5 text-xs text-muted-foreground">
            Enter: okutulan ürünü sepete ekler.
          </p>
        </div>
        <div className="p-3 sm:p-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-28 rounded-lg" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Envanterde ürün yok. Ürünleri Envanter sayfasından ekleyin.</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">“{query.trim()}” ile eşleşen ürün yok.</div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              {filtered.map((product) => {
                const inCart = cart.find((line) => line.product.id === product.id)?.quantity ?? 0;
                const out = product.quantity <= 0;
                return (
                  <li key={product.id}>
                    <button
                      type="button"
                      className={cn(
                        "flex h-full w-full flex-col rounded-lg border bg-background p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-55",
                        inCart > 0 ? "border-emerald-500 ring-1 ring-emerald-500" : "hover:border-emerald-400",
                      )}
                      onClick={() => {
                        add(product);
                        searchRef.current?.focus();
                      }}
                      disabled={out}
                      aria-label={`${product.name}, ${product.salePrice === null ? "fiyat girilmemiş" : formatMoney(product.salePrice)}, stok ${product.quantity}${inCart ? `, sepette ${inCart}` : ""}`}
                    >
                      <span className="line-clamp-2 font-medium leading-snug">{product.name}</span>
                      <span className="mt-0.5 truncate text-xs text-muted-foreground">{product.sku}</span>
                      <span className="mt-auto flex items-end justify-between gap-2 pt-3">
                        <span className={cn("font-semibold tabular-nums", product.salePrice === null && "text-sm font-normal text-muted-foreground")}>
                          {product.salePrice === null ? "Fiyat yok" : formatMoney(product.salePrice)}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-xs tabular-nums",
                            out ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200" : product.quantity <= 2 ? "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200" : "bg-muted text-muted-foreground",
                          )}
                        >
                          {out ? "Tükendi" : `${product.quantity} adet`}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section ref={cartRef} id="sepet" aria-labelledby="pos-cart" className="scroll-mt-4 self-start rounded-xl border bg-card shadow-sm lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 id="pos-cart" className="flex items-center gap-2 font-semibold">
            <ShoppingBag aria-hidden="true" className="size-4 text-emerald-600" />
            Sepet
          </h2>
          {cart.length > 0 && (
            <button type="button" className="text-xs font-medium text-muted-foreground hover:text-foreground" onClick={() => setCart([])}>
              Sepeti boşalt
            </button>
          )}
        </div>

        <div className="space-y-4 p-4">
          {lastSale && cart.length === 0 && (
            <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
              <p className="flex items-center gap-2 font-semibold">
                <CheckCircle2 aria-hidden="true" className="size-4" />
                {lastSale.receiptNumber} · {formatMoney(lastSale.amount)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => window.open(invoiceUrl(lastSale.id), "_blank", "noopener,noreferrer")}>
                  <Download />
                  Fatura
                </Button>
                <Button type="button" size="sm" onClick={startNewSale}>
                  Yeni satış
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="pos-customer" className="flex items-center gap-2 text-sm font-medium">
              <UserRound aria-hidden="true" className="size-4 text-muted-foreground" />
              Müşteri <span className="font-normal text-muted-foreground">(isteğe bağlı)</span>
            </label>
            <CustomerPicker id="pos-customer" value={customerId} onChange={(id) => setCustomerId(id)} placeholder="Kayıtlı müşteri ara" />
            {!customerId &&
              (showWalkIn ? (
                <Input aria-label="Kayıtsız müşteri adı" placeholder="Fişe yazılacak ad" value={walkInName} onChange={(event) => setWalkInName(event.target.value)} className="h-10" />
              ) : (
                <button type="button" className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400" onClick={() => setShowWalkIn(true)}>
                  Kayıt açmadan ad yaz
                </button>
              ))}
          </div>

          {cart.length === 0 ? (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Sepet boş. Ürün okutun veya listeden seçin.</p>
          ) : (
            <ul className="space-y-2" aria-label="Sepetteki ürünler">
              {cart.map((line, index) => {
                const lineTotal = lines[index].unitPrice * line.quantity;
                const noPrice = !(parseAmount(line.priceText) > 0);
                return (
                  <li key={line.product.id} className="rounded-lg border p-3">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{line.product.name}</p>
                        <p className="text-xs text-muted-foreground">{line.product.sku}</p>
                      </div>
                      <button
                        type="button"
                        className="-m-1 rounded p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                        aria-label={`${line.product.name} sepetten çıkar`}
                        onClick={() => setCart((current) => current.filter((item) => item.product.id !== line.product.id))}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="relative min-w-0 flex-1">
                        <span aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          ₺
                        </span>
                        <Input
                          id={`pos-price-${line.product.id}`}
                          inputMode="decimal"
                          aria-label={`${line.product.name} birim fiyatı`}
                          aria-invalid={(priceCheck && noPrice) || undefined}
                          placeholder="Fiyat"
                          className={cn("h-9 pl-6 tabular-nums", noPrice && "border-amber-500")}
                          value={line.priceText}
                          onChange={(event) => setCart((current) => current.map((item) => (item.product.id === line.product.id ? { ...item, priceText: event.target.value } : item)))}
                        />
                      </div>
                      <div className="flex items-center rounded-lg border">
                        <button type="button" className="flex size-9 items-center justify-center hover:bg-muted" aria-label={`${line.product.name} adedini azalt`} onClick={() => changeQuantity(line.product.id, -1)}>
                          <Minus className="size-4" />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums" aria-live="polite" aria-label={`${line.quantity} adet`}>
                          {line.quantity}
                        </span>
                        <button type="button" className="flex size-9 items-center justify-center hover:bg-muted" aria-label={`${line.product.name} adedini artır`} onClick={() => changeQuantity(line.product.id, 1)}>
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-right text-sm font-semibold tabular-nums">{noPrice ? <span className="font-normal text-amber-700 dark:text-amber-400">Fiyat girin</span> : formatMoney(lineTotal)}</p>
                  </li>
                );
              })}
            </ul>
          )}

          <fieldset className="space-y-1.5">
            <legend className="text-sm font-medium">Ödeme</legend>
            <div role="radiogroup" aria-label="Ödeme yöntemi" className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={cn(
                    "rounded-md px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600",
                    paymentMethod === method.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {method.label}
                </button>
              ))}
            </div>
            {paymentMethod !== "CASH" && (
              <Input
                aria-label={paymentMethod === "CARD" ? "Slip numarası" : "Dekont numarası"}
                placeholder={paymentMethod === "CARD" ? "Slip no (isteğe bağlı)" : "Dekont no (isteğe bağlı)"}
                className="h-9"
                value={paymentReference}
                onChange={(event) => setPaymentReference(event.target.value)}
              />
            )}
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="pos-discount" className="block text-xs font-medium text-muted-foreground">
                İndirim
              </label>
              <div className="flex">
                <Input
                  id="pos-discount"
                  inputMode="decimal"
                  placeholder="0"
                  className="h-9 rounded-r-none tabular-nums"
                  value={discountText}
                  onChange={(event) => setDiscountText(event.target.value)}
                />
                <select
                  aria-label="İndirim türü"
                  className="h-9 rounded-r-lg border border-l-0 border-input bg-background px-2 text-sm"
                  value={discountMode}
                  onChange={(event) => setDiscountMode(event.target.value as DiscountMode)}
                >
                  <option value="PERCENT">%</option>
                  <option value="FIXED">₺</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="pos-tax" className="block text-xs font-medium text-muted-foreground">
                KDV (fiyata dahil)
              </label>
              <select id="pos-tax" className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm" value={taxRate} onChange={(event) => setTaxRate(Number(event.target.value))}>
                {TAX_RATES.map((rate) => (
                  <option key={rate} value={rate}>
                    %{rate}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {typesLoaded && types.length > 1 && (
            <div className="space-y-1.5">
              <label htmlFor="pos-type" className="block text-xs font-medium text-muted-foreground">
                Satış türü
              </label>
              <select id="pos-type" className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm" value={transactionTypeId} onChange={(event) => setTypeChoice(event.target.value)}>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <dl className="space-y-1.5 border-t pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Ara toplam</dt>
              <dd className="tabular-nums">{formatMoney(totals.subtotal)}</dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">İndirim</dt>
                <dd className="tabular-nums">−{formatMoney(totals.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">KDV (dahil, %{taxRate})</dt>
              <dd className="tabular-nums">{formatMoney(totals.tax)}</dd>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <dt className="font-semibold">Toplam</dt>
              <dd className="text-2xl font-semibold tabular-nums">{formatMoney(totals.total)}</dd>
            </div>
          </dl>

          {typesLoaded && types.length === 0 ? (
            <MissingTypeNotice category="SALE" onAdded={reloadTypes} />
          ) : (
            <Button type="button" className="h-12 w-full text-base" onClick={() => void completeSale()} disabled={saving || cart.length === 0 || !typesLoaded}>
              {saving && <Loader2 className="animate-spin" />}
              {cart.length === 0 ? "Satışı tamamla" : `Satışı tamamla · ${formatMoney(totals.total)}`}
            </Button>
          )}
        </div>
      </section>

      <section aria-labelledby="pos-recent" className="min-w-0 self-start rounded-xl border bg-card shadow-sm lg:col-start-1 lg:row-start-2">
        <h2 id="pos-recent" className="flex items-center gap-2 border-b px-4 py-3 font-semibold">
          <ReceiptText aria-hidden="true" className="size-4 text-emerald-600" />
          Son satışlar
        </h2>
        {recent.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">Henüz satış yok. Tamamlanan satışlar burada görünür.</p>
        ) : (
          <ul className="divide-y">
            {recent.map((sale) => (
              <li key={sale.id} className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {sale.receiptNumber ?? "Satış"}
                    <StatusBadge value={sale.status ?? "COMPLETED"} />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {sale.customerName || "Perakende müşteri"} · {translateEnum(sale.paymentMethod ?? "CASH")} · {formatDateTime(sale.occurredAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 font-semibold tabular-nums">{formatMoney(sale.amount)}</span>
                  <SaleActionButtons sale={sale} onChanged={refresh} compact />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-[0_-4px_12px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">{itemCount} ürün</p>
              <p className="text-lg font-semibold tabular-nums">{formatMoney(totals.total)}</p>
            </div>
            <Button type="button" className="h-11 px-5" onClick={() => cartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
              Sepete git
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
