"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  Minus,
  Plus,
  ReceiptText,
  RotateCcw,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiRecord, apiGet, apiPatch, apiPost, normalizeList } from "@/lib/management-api";

type DiscountMode = "PERCENT" | "FIXED";
type PaymentMethod = "CASH" | "CARD" | "TRANSFER";

interface CartItem {
  item: ApiRecord;
  quantity: number;
  unitPrice: number;
}

interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface TransactionType {
  id: string;
  code?: string;
  name?: string;
}

interface SaleTransaction {
  id: string;
  receiptNumber?: string;
  customerName?: string;
  amount?: number;
  refundedAmount?: number;
  status?: string;
  paymentMethod?: string;
  occurredAt?: string;
}

function money(value: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);
}

function recordString(record: ApiRecord, key: string, fallback = "") {
  const value = record[key];
  return value === undefined || value === null ? fallback : String(value);
}

function recordNumber(record: ApiRecord, key: string) {
  const value = Number(record[key]);
  return Number.isFinite(value) ? value : 0;
}

function itemPrice(item: ApiRecord): number {
  const value = recordNumber(item, "price") || recordNumber(item, "amount") || recordNumber(item, "unitPrice");
  return value > 0 ? value : 0;
}

function stockQuantity(item: ApiRecord): number {
  return Math.max(0, Math.floor(recordNumber(item, "quantity")));
}

function customerLabel(customer: Customer) {
  return `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() || "Müşteri";
}

function asTransactions(data: unknown): SaleTransaction[] {
  return normalizeList(data)
    .map((record) => ({
      id: recordString(record, "id"),
      receiptNumber: recordString(record, "receiptNumber"),
      customerName: recordString(record, "customerName"),
      amount: recordNumber(record, "amount"),
      refundedAmount: recordNumber(record, "refundedAmount"),
      status: recordString(record, "status"),
      paymentMethod: recordString(record, "paymentMethod"),
      occurredAt: recordString(record, "occurredAt"),
    }))
    .filter((sale) => sale.id);
}

export function PosPage() {
  const [products, setProducts] = useState<ApiRecord[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
  const [transactionTypeId, setTransactionTypeId] = useState("");
  const [transactions, setTransactions] = useState<SaleTransaction[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [query, setQuery] = useState("");
  const [customerQuery, setCustomerQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [quickCustomerName, setQuickCustomerName] = useState("");
  const [discountMode, setDiscountMode] = useState<DiscountMode>("PERCENT");
  const [discountValue, setDiscountValue] = useState(0);
  const [taxRate, setTaxRate] = useState(20);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [paymentReference, setPaymentReference] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refundId, setRefundId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSale, setLastSale] = useState<SaleTransaction | null>(null);

  const loadProducts = useCallback(async () => {
    const data = await apiGet<unknown>("/api/v1/admin/inventory/items");
    setProducts(normalizeList(data));
  }, []);

  const loadTransactions = useCallback(async () => {
    const data = await apiGet<unknown>("/api/v1/sales/transactions?size=8&sort=occurredAt,desc");
    setTransactions(asTransactions(data));
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const [typesData] = await Promise.all([
          apiGet<unknown>("/api/v1/sales/transaction-types"),
          loadProducts(),
          loadTransactions(),
        ]);
        const nextTypes = normalizeList(typesData)
          .map((record) => ({
            id: recordString(record, "id"),
            code: recordString(record, "code"),
            name: recordString(record, "name"),
          }))
          .filter((type) => type.id);
        setTransactionTypes(nextTypes);
        setTransactionTypeId(nextTypes[0]?.id ?? "");
      } catch (exception) {
        setError(exception instanceof Error ? exception.message : "POS verileri yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }
    void loadInitialData();
  }, [loadProducts, loadTransactions]);

  useEffect(() => {
    const needle = customerQuery.trim();
    if (needle.length < 2) {
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        const data = await apiGet<unknown>(`/api/v1/sales/customers?q=${encodeURIComponent(needle)}`);
        setCustomers(
          normalizeList(data)
            .map((record) => ({
              id: recordString(record, "id"),
              firstName: recordString(record, "firstName"),
              lastName: recordString(record, "lastName"),
              phone: recordString(record, "phone"),
            }))
            .filter((customer) => customer.id),
        );
      } catch {
        setCustomers([]);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [customerQuery]);

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((product) =>
      [product.name, product.sku, product.category].some((value) => String(value ?? "").toLowerCase().includes(needle)),
    );
  }, [products, query]);

  const subtotal = cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const discountAmount = Math.min(
    subtotal,
    Math.max(0, discountMode === "PERCENT" ? subtotal * (discountValue / 100) : discountValue),
  );
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * (Math.max(0, taxRate) / 100);
  const total = taxableAmount + taxAmount;
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  function setNotice(nextMessage: string | null, nextError: string | null = null) {
    setMessage(nextMessage);
    setError(nextError);
  }

  function addToCart(item: ApiRecord) {
    const available = stockQuantity(item);
    if (available <= 0) {
      setNotice(null, "Bu ürün için stok bulunmuyor.");
      return;
    }

    setCart((current) => {
      const existing = current.find((line) => line.item.id === item.id);
      if (existing) {
        if (existing.quantity >= available) {
          setNotice(null, `Stok yetersiz. ${recordString(item, "name", "Ürün")} için en fazla ${available} adet satılabilir.`);
          return current;
        }
        return current.map((line) => (line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line));
      }
      return [...current, { item, quantity: 1, unitPrice: itemPrice(item) }];
    });
  }

  function changeQuantity(id: unknown, delta: number) {
    setCart((current) =>
      current
        .map((line) => {
          if (line.item.id !== id) return line;
          const nextQuantity = line.quantity + delta;
          const available = stockQuantity(line.item);
          if (nextQuantity > available) {
            setNotice(null, `Stok yetersiz. Bu satır için en fazla ${available} adet seçilebilir.`);
            return line;
          }
          return { ...line, quantity: nextQuantity };
        })
        .filter((line) => line.quantity > 0),
    );
  }

  function changeUnitPrice(id: unknown, value: string) {
    const nextPrice = Math.max(0, Number(value) || 0);
    setCart((current) => current.map((line) => (line.item.id === id ? { ...line, unitPrice: nextPrice } : line)));
  }

  async function completeSale() {
    if (cart.length === 0) {
      setNotice(null, "Satış için sepete en az bir ürün ekleyin.");
      return;
    }
    if (!transactionTypeId) {
      setNotice(null, "Satış türü bulunamadı. Lütfen satış işlem türlerini kontrol edin.");
      return;
    }
    const overStocked = cart.find((line) => line.quantity > stockQuantity(line.item));
    if (overStocked) {
      setNotice(null, `${recordString(overStocked.item, "name", "Ürün")} için stok yetersiz.`);
      return;
    }

    setSaving(true);
    setNotice(null);
    try {
      const sale = await apiPost<SaleTransaction>("/api/v1/sales/transactions", {
        transactionTypeId,
        customerId: selectedCustomer?.id,
        customerName: selectedCustomer ? customerLabel(selectedCustomer) : quickCustomerName.trim() || "Perakende müşteri",
        amount: Number(total.toFixed(2)),
        paymentMethod,
        paymentReference: paymentReference.trim() || undefined,
        items: cart.map((line) => ({
          inventoryItemId: line.item.id,
          name: recordString(line.item, "name", "Ürün"),
          sku: recordString(line.item, "sku"),
          quantity: line.quantity,
          unitPrice: Number(line.unitPrice.toFixed(2)),
          lineTotal: Number((line.unitPrice * line.quantity).toFixed(2)),
        })),
        notes: [
          `Ara toplam: ${subtotal.toFixed(2)}`,
          `İndirim: ${discountAmount.toFixed(2)} (${discountMode === "PERCENT" ? `%${discountValue}` : "sabit"})`,
          `KDV: ${taxAmount.toFixed(2)} (%${taxRate})`,
          `Satırlar: ${cart.map((line) => `${line.quantity} x ${recordString(line.item, "name", recordString(line.item, "sku"))}`).join(", ")}`,
        ].join(" | "),
      });
      setCart([]);
      setQuickCustomerName("");
      setSelectedCustomer(null);
      setCustomerQuery("");
      setPaymentReference("");
      setDiscountValue(0);
      setLastSale(sale);
      setNotice("Satış kaydedildi ve stok hareketleri işlendi.");
      await Promise.all([loadProducts(), loadTransactions()]);
    } catch (exception) {
      const fallback = "Satış kaydedilemedi.";
      const detail = exception instanceof Error ? exception.message : fallback;
      setNotice(null, detail.toLowerCase().includes("insufficient stock") ? "Stok yetersiz. Sepetteki adetleri kontrol edin." : detail);
    } finally {
      setSaving(false);
    }
  }

  async function refundSale(transaction: SaleTransaction) {
    const refundable = Math.max(0, (transaction.amount ?? 0) - (transaction.refundedAmount ?? 0));
    if (refundable <= 0) {
      setNotice(null, "Bu satış için iade edilebilir tutar kalmadı.");
      return;
    }
    const value = window.prompt("İade tutarı", refundable.toFixed(2));
    if (!value) return;
    const amount = Number(value.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0 || amount > refundable) {
      setNotice(null, "Geçerli bir iade tutarı girin.");
      return;
    }

    setRefundId(transaction.id);
    setNotice(null);
    try {
      await apiPost(`/api/v1/sales/transactions/${transaction.id}/refund`, {
        amount: Number(amount.toFixed(2)),
        reason: "POS iade",
      });
      setNotice("İade kaydedildi ve ilgili stoklar geri alındı.");
      await Promise.all([loadProducts(), loadTransactions()]);
    } catch (exception) {
      setNotice(null, exception instanceof Error ? exception.message : "İade kaydedilemedi.");
    } finally {
      setRefundId(null);
    }
  }

  async function cancelSale(transaction: SaleTransaction) {
    setRefundId(transaction.id);
    setNotice(null);
    try {
      await apiPatch(`/api/v1/sales/transactions/${transaction.id}/status`, { status: "CANCELED" });
      setNotice("Satış iptal edildi ve stoklar geri alındı.");
      await Promise.all([loadProducts(), loadTransactions()]);
    } catch (exception) {
      setNotice(null, exception instanceof Error ? exception.message : "Satış iptal edilemedi.");
    } finally {
      setRefundId(null);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-4">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ürün adı, barkod veya SKU" />
            </div>
            <select
              value={transactionTypeId}
              onChange={(event) => setTransactionTypeId(event.target.value)}
              className="h-8 rounded-lg border bg-background px-2 text-sm"
            >
              {transactionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name || type.code || "Satış"}
                </option>
              ))}
            </select>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-32 rounded-lg" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Ürün bulunamadı.</div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const available = stockQuantity(product);
                  return (
                    <button
                      key={String(product.id ?? product.sku)}
                      type="button"
                      className="rounded-lg border bg-background p-3 text-left transition-colors hover:border-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => addToCart(product)}
                      disabled={available <= 0}
                    >
                      <p className="font-medium">{recordString(product, "name", "-")}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{recordString(product, "sku")}</p>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span>{money(itemPrice(product))}</span>
                        <span className={available > 0 ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700" : "rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700"}>
                          {available} adet
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2 font-semibold">
              <ReceiptText className="h-4 w-4 text-teal-600" />
              Son Satışlar
            </div>
          </div>
          <div className="divide-y">
            {transactions.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">Henüz satış kaydı yok.</div>
            ) : (
              transactions.map((sale) => {
                const refundable = Math.max(0, (sale.amount ?? 0) - (sale.refundedAmount ?? 0));
                return (
                  <div key={sale.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium">{sale.receiptNumber || sale.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.customerName || "Perakende müşteri"} · {sale.paymentMethod || "CASH"} · {sale.status || "COMPLETED"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{money(sale.amount ?? 0)}</span>
                      <Button type="button" variant="outline" size="sm" onClick={() => window.open(`/api/v1/sales/transactions/${sale.id}/invoice`, "_blank", "noopener,noreferrer")}>
                        <Download />
                        Fatura
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => void refundSale(sale)} disabled={refundId === sale.id || refundable <= 0 || sale.status === "CANCELED"}>
                        {refundId === sale.id ? <Loader2 className="animate-spin" /> : <RotateCcw />}
                        İade
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => void cancelSale(sale)} disabled={refundId === sale.id || sale.status === "CANCELED" || sale.status === "REFUNDED"}>
                        İptal
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-sm xl:sticky xl:top-4 xl:self-start">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-4 w-4 text-teal-600" />
            Sepet
          </div>
          <span className="text-xs text-muted-foreground">{cartCount} ürün</span>
        </div>
        <div className="space-y-4 p-4">
          {message && (
            <div className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4" />
              {message}
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              {error}
            </div>
          )}
          {lastSale && (
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <p className="font-medium">Fiş: {lastSale.receiptNumber || lastSale.id}</p>
              <a className="mt-2 inline-flex items-center gap-1 text-teal-700 hover:underline" href={`/api/v1/sales/transactions/${lastSale.id}/invoice`} target="_blank" rel="noreferrer">
                <Download className="h-4 w-4" />
                Fatura indir
              </a>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              Müşteri
            </div>
            <Input value={customerQuery} onChange={(event) => setCustomerQuery(event.target.value)} placeholder="Kayıtlı müşteri ara" />
            {customerQuery.trim().length >= 2 && customers.length > 0 && (
              <div className="max-h-36 overflow-auto rounded-lg border">
                {customers.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setCustomerQuery(customerLabel(customer));
                      setCustomers([]);
                    }}
                  >
                    <span>{customerLabel(customer)}</span>
                    <span className="text-xs text-muted-foreground">{customer.phone}</span>
                  </button>
                ))}
              </div>
            )}
            <Input value={quickCustomerName} onChange={(event) => setQuickCustomerName(event.target.value)} placeholder="Hızlı müşteri adı" disabled={selectedCustomer !== null} />
            {selectedCustomer && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>
                Seçimi temizle
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Sepet boş. Ürün kartlarına dokunarak satışa başlayın.</div>
            ) : (
              cart.map((line) => (
                <div key={String(line.item.id)} className="rounded-lg border p-3">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{recordString(line.item, "name", recordString(line.item, "sku"))}</p>
                      <p className="text-xs text-muted-foreground">Stok: {stockQuantity(line.item)} · {recordString(line.item, "sku")}</p>
                    </div>
                    <Button type="button" variant="destructive" size="icon-sm" title="Satırı sil" onClick={() => setCart((current) => current.filter((item) => item.item.id !== line.item.id))}>
                      <Trash2 />
                    </Button>
                  </div>
                  <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                    <Input type="number" min="0" step="0.01" value={line.unitPrice} onChange={(event) => changeUnitPrice(line.item.id, event.target.value)} aria-label="Birim fiyat" />
                    <div className="flex items-center gap-1">
                      <Button type="button" variant="outline" size="icon-sm" title="Azalt" onClick={() => changeQuantity(line.item.id, -1)}>
                        <Minus />
                      </Button>
                      <span className="w-7 text-center text-sm">{line.quantity}</span>
                      <Button type="button" variant="outline" size="icon-sm" title="Artır" onClick={() => changeQuantity(line.item.id, 1)}>
                        <Plus />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-right text-sm font-semibold">{money(line.unitPrice * line.quantity)}</div>
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select value={discountMode} onChange={(event) => setDiscountMode(event.target.value as DiscountMode)} className="h-8 rounded-lg border bg-background px-2 text-sm">
              <option value="PERCENT">Yüzde indirim</option>
              <option value="FIXED">Sabit indirim</option>
            </select>
            <Input type="number" min="0" value={discountValue} onChange={(event) => setDiscountValue(Math.max(0, Number(event.target.value) || 0))} placeholder="İndirim" />
            <Input type="number" min="0" value={taxRate} onChange={(event) => setTaxRate(Math.max(0, Number(event.target.value) || 0))} placeholder="KDV %" />
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)} className="h-8 rounded-lg border bg-background px-2 text-sm">
              <option value="CASH">Nakit</option>
              <option value="CARD">Kart</option>
              <option value="TRANSFER">Havale/transfer</option>
            </select>
          </div>
          <Input value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} placeholder="Ödeme referansı" />

          <div className="space-y-2 border-t pt-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Ara toplam</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>İndirim</span>
              <span>-{money(discountAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>KDV</span>
              <span>{money(taxAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Toplam</span>
              <span>{money(total)}</span>
            </div>
            <Button className="mt-3 w-full" type="button" onClick={() => void completeSale()} disabled={saving || cart.length === 0}>
              {saving && <Loader2 className="animate-spin" />}
              Satışı Tamamla
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
