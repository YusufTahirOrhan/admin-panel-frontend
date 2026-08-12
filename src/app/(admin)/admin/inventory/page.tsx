"use client";

import { useEffect, useState } from "react";
import { ResourcePage } from "@/components/management/resource-page";
import { apiGet, apiPost } from "@/lib/management-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tags } from "lucide-react";

interface Category {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export default function InventoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [catSaving, setCatSaving] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  async function loadCategories() {
    try {
      const data = await apiGet<Category[]>("/api/v1/admin/inventory/categories");
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      } else {
        setCategories([
          { id: "1", name: "Çerçeve", code: "CERCEVE" },
          { id: "2", name: "Güneş Gözlüğü", code: "GUNES_GOZLUGU" },
          { id: "3", name: "Kontak Lens", code: "KONTAK_LENS" },
          { id: "4", name: "Bakım Solüsyonu", code: "SOLUSYON" },
          { id: "5", name: "Aksesuar", code: "AKSESUAR" },
          { id: "6", name: "Yedek Parça", code: "YEDEK_PARCA" },
        ]);
      }
    } catch {
      setCategories([
        { id: "1", name: "Çerçeve", code: "CERCEVE" },
        { id: "2", name: "Güneş Gözlüğü", code: "GUNES_GOZLUGU" },
        { id: "3", name: "Kontak Lens", code: "KONTAK_LENS" },
        { id: "4", name: "Bakım Solüsyonu", code: "SOLUSYON" },
        { id: "5", name: "Aksesuar", code: "AKSESUAR" },
        { id: "6", name: "Yedek Parça", code: "YEDEK_PARCA" },
      ]);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreateCategory() {
    if (!newCatName.trim()) return;
    setCatSaving(true);
    setCatError(null);
    try {
      const created = await apiPost<Category>("/api/v1/admin/inventory/categories", {
        name: newCatName.trim(),
        description: newCatDesc.trim() || undefined,
      });
      setCategories((prev) => [...prev, created]);
      setNewCatName("");
      setNewCatDesc("");
      setCategoryModalOpen(false);
    } catch (e) {
      setCatError(e instanceof Error ? e.message : "Kategori oluşturulamadı.");
    } finally {
      setCatSaving(false);
    }
  }

  const categoryOptions = categories.map((c) => c.name);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Envanter & Stok Yönetimi</h1>
          <p className="text-sm text-slate-500">Ürünleri, kategorileri, stok miktarlarını ve minimum eşikleri yönetin.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setCategoryModalOpen(true)}
          className="flex items-center gap-2 border-teal-600/30 text-teal-700 hover:bg-teal-50"
        >
          <Tags className="h-4 w-4" />
          + Yeni Kategori Ekle
        </Button>
      </div>

      <ResourcePage
        title="Envanter Ürünleri"
        description="Stoktaki optik ürünleri ekleyin ve düzenleyin."
        listPath="/api/v1/admin/inventory/items"
        createPath="/api/v1/admin/inventory/items"
        updatePath={(id) => `/api/v1/admin/inventory/items/${id}`}
        deletePath={(id) => `/api/v1/admin/inventory/items/${id}`}
        fields={[
          { name: "sku", label: "SKU / Barkod", required: true },
          { name: "name", label: "Ürün Adı", required: true },
          {
            name: "category",
            label: "Kategori",
            type: "select",
            options: categoryOptions.length > 0 ? categoryOptions : ["Çerçeve", "Güneş Gözlüğü", "Kontak Lens", "Bakım Solüsyonu", "Aksesuar", "Yedek Parça"],
            required: true,
          },
          { name: "quantity", label: "Mevcut Stok Miktarı", type: "number", required: true },
          { name: "minQuantity", label: "Minimum Stok Eşiği", type: "number" },
        ]}
        columns={[
          { key: "sku", label: "SKU / Barkod" },
          { key: "name", label: "Ürün Adı" },
          { key: "category", label: "Kategori" },
          { key: "quantity", label: "Stok Miktarı" },
          { key: "minQuantity", label: "Minimum Eşik" },
        ]}
        emptyText="Envanterde henüz ürün kaydı bulunamadı."
      />

      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5 text-teal-600" />
              Yeni Envanter Kategorisi Ekle
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {catError ? (
              <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600">{catError}</div>
            ) : null}
            <div>
              <label className="text-xs font-semibold text-slate-700">Kategori Adı *</label>
              <Input
                placeholder="Örn: Mavi Işık Filtreli Camlar"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Açıklama (İsteğe bağlı)</label>
              <Input
                placeholder="Örn: Bilgisayar kullanımı için özel kaplamalı camlar"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCategoryModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleCreateCategory} disabled={catSaving || !newCatName.trim()}>
              {catSaving ? "Kaydediliyor..." : "Kategori Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
