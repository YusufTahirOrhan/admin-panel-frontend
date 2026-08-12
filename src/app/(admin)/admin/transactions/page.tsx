"use client";

import { useEffect, useState } from "react";
import { ResourcePage } from "@/components/management/resource-page";
import { apiGet, apiPost, normalizeList, translateEnum } from "@/lib/management-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ShoppingCart, UserCheck, PackageCheck, AlertCircle, Tag, Receipt } from "lucide-react";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category?: string;
  quantity: number;
}

interface TransactionType {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export default function AdminTransactionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
  
  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [quickCustomerName, setQuickCustomerName] = useState<string>("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [notes, setNotes] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [cData, iData, tData] = await Promise.all([
          apiGet<unknown>("/api/v1/sales/customers?size=200"),
          apiGet<unknown>("/api/v1/admin/inventory/items"),
          apiGet<unknown>("/api/v1/sales/transaction-types"),
        ]);
        
        setCustomers(
          normalizeList(cData).map((rec) => ({
            id: String(rec.id || ""),
            firstName: String(rec.firstName || ""),
            lastName: String(rec.lastName || ""),
            phone: String(rec.phone || ""),
          })).filter((c) => c.id)
        );

        setInventoryItems(
          normalizeList(iData).map((rec) => ({
            id: String(rec.id || ""),
            sku: String(rec.sku || ""),
            name: String(rec.name || ""),
            category: String(rec.category || ""),
            quantity: Number(rec.quantity || 0),
          })).filter((i) => i.id)
        );

        const loadedTypes = normalizeList(tData).map((rec) => ({
          id: String(rec.id || ""),
          code: String(rec.code || ""),
          name: String(rec.name || rec.code || ""),
          description: String(rec.description || ""),
        })).filter((t) => t.id);

        setTransactionTypes(loadedTypes);
        if (loadedTypes.length > 0 && !selectedTypeId) {
          setSelectedTypeId(loadedTypes[0].id);
        }
      } catch {
        // Ignored
      }
    }
    if (modalOpen) {
      loadData();
    }
  }, [modalOpen, selectedTypeId]);

  function handleProductSelect(itemId: string) {
    setSelectedItemId(itemId);
    const item = inventoryItems.find((i) => i.id === itemId);
    if (item && item.quantity <= 0) {
      setError(`"${item.name}" stokta tükenmiş.`);
    } else {
      setError(null);
    }
  }

  async function handleCreateSale() {
    if (!selectedItemId) {
      setError("Lütfen satılacak ürünü seçin.");
      return;
    }

    const item = inventoryItems.find((i) => i.id === selectedItemId);
    if (!item) {
      setError("Seçilen ürün envanterde bulunamadı.");
      return;
    }

    if (quantity <= 0) {
      setError("Satış miktarı en az 1 olmalıdır.");
      return;
    }

    if (quantity > item.quantity) {
      setError(`Stok yetersiz. En fazla ${item.quantity} adet satabilirsiniz.`);
      return;
    }

    const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
    const customerName = selectedCustomer
      ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`.trim()
      : quickCustomerName.trim() || "Perakende Müşteri";

    const totalAmount = unitPrice > 0 ? unitPrice * quantity : 100 * quantity;

    setSaving(true);
    setError(null);

    try {
      await apiPost("/api/v1/sales/transactions", {
        transactionTypeId: selectedTypeId || undefined,
        customerId: selectedCustomerId || undefined,
        customerName: customerName,
        amount: totalAmount,
        paymentMethod: paymentMethod,
        items: [
          {
            inventoryItemId: item.id,
            name: item.name,
            sku: item.sku,
            quantity: quantity,
            unitPrice: unitPrice > 0 ? unitPrice : 100,
            lineTotal: totalAmount,
          },
        ],
        notes: notes.trim() || `Ürün: ${item.name} (${item.sku}) x ${quantity}`,
      });

      setModalOpen(false);
      setSelectedCustomerId("");
      setQuickCustomerName("");
      setSelectedItemId("");
      setQuantity(1);
      setUnitPrice(0);
      setNotes("");
      setRefreshKey((prev) => prev + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Satış kaydı oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Single Clean Header Bar */}
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Receipt className="size-6 text-emerald-600" />
            Satış İşlemleri & Fişler
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kayıtlı müşterilere, tanımlı satış türlerine ve envanter ürünlerine göre güvenle satış gerçekleştirin.
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
        >
          <ShoppingCart className="h-4 w-4" />
          + Yeni Satış Kaydı
        </Button>
      </div>

      <ResourcePage
        key={refreshKey}
        title="Satış Kayıtları"
        description="Tamamlanan satışları, işlem türlerini, müşteri ve ödeme detaylarını inceleyin."
        listPath="/api/v1/sales/transactions"
        createPath="/api/v1/sales/transactions"
        detailPath={(id) => `/api/v1/sales/transactions/${id}`}
        hideHeader={true}
        hideInlineForm={true}
        fields={[]}
        columns={[
          { key: "receiptNumber", label: "Fiş No" },
          { key: "customerName", label: "Müşteri" },
          { key: "transactionType", label: "Satış Türü" },
          { key: "amount", label: "Tutar (TL)" },
          { key: "paymentMethod", label: "Ödeme Yöntemi" },
          { key: "status", label: "Durum" },
        ]}
        emptyText="Henüz bir satış kaydı oluşturulmadı."
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
              Yeni Satış Kaydı Oluştur
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {error ? (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            ) : null}

            {/* Transaction Type Selection */}
            {transactionTypes.length > 0 && (
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Tag className="h-4 w-4 text-emerald-600" /> Satış / İşlem Türü Seçin *
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  value={selectedTypeId}
                  onChange={(e) => setSelectedTypeId(e.target.value)}
                >
                  {transactionTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Registered Customer Selection */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <UserCheck className="h-4 w-4 text-emerald-600" /> Kayıtlı Müşteri Seçin
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  if (e.target.value) setQuickCustomerName("");
                }}
              >
                <option value="">-- Kayıtlı Müşterilerden Seç (Veya Perakende) --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} {c.phone ? `(${c.phone})` : ""}
                  </option>
                ))}
              </select>
              {!selectedCustomerId && (
                <Input
                  placeholder="Veya Hızlı Perakende Müşteri Adı Yazın"
                  value={quickCustomerName}
                  onChange={(e) => setQuickCustomerName(e.target.value)}
                  className="mt-1 text-xs"
                />
              )}
            </div>

            {/* Inventory Product Selection */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <PackageCheck className="h-4 w-4 text-emerald-600" /> Envanterdeki Kayıtlı Ürün *
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                value={selectedItemId}
                onChange={(e) => handleProductSelect(e.target.value)}
              >
                <option value="">-- Envanterden Ürün Seçin --</option>
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id} disabled={item.quantity <= 0}>
                    {item.name} [{item.sku}] - Stok: {item.quantity} Adet {item.quantity <= 0 ? "(TÜKENDİ)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Satış Miktarı (Adet)</label>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Birim Fiyat (TL)</label>
                <Input
                  type="number"
                  min={0}
                  placeholder="Örn: 250"
                  value={unitPrice || ""}
                  onChange={(e) => setUnitPrice(Math.max(0, Number(e.target.value) || 0))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Ödeme Yöntemi</label>
                <select
                  className="mt-1 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="CASH">{translateEnum("CASH")}</option>
                  <option value="CARD">{translateEnum("CARD")}</option>
                  <option value="TRANSFER">{translateEnum("TRANSFER")}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Hesaplanan Toplam Tutar</label>
                <div className="mt-1 flex h-10 items-center rounded-md border bg-slate-50 px-3 text-sm font-bold text-emerald-700">
                  {((unitPrice || 100) * quantity).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Not / Satış Açıklaması</label>
              <Input
                placeholder="Örn: Garanti kartı verildi, kılıf hediye edildi"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleCreateSale}
              disabled={saving || !selectedItemId}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saving ? "Satış Yapılıyor..." : "Satışı Tamamla & Stoğu Düş"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
