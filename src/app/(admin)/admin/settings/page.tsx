"use client";

import { useEffect, useState } from "react";
import { FolderTree, Loader2, Settings as SettingsIcon, Sparkles, Tag } from "lucide-react";
import { ResourcePage } from "@/components/management/resource-page";
import { ShinyText } from "@/components/ui/shiny-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { apiGet, apiPatch, friendlyApiError, normalizeList, type ApiRecord } from "@/lib/management-api";
import {
  CATEGORY_HELP,
  CATEGORY_LABELS,
  PRESET_TYPES,
  addMissingPresetTypes,
  isCategory,
  toTransactionType,
  transactionTypePayload,
  type TransactionType,
} from "@/lib/transaction-types";
import { toast } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

type SettingsTab = "transaction-types" | "categories";

const TABS: { id: SettingsTab; label: string; icon: typeof Tag }[] = [
  { id: "transaction-types", label: "İşlem türleri", icon: Tag },
  { id: "categories", label: "Ürün kategorileri", icon: FolderTree },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("transaction-types");

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <SettingsIcon className="size-6 text-emerald-600" />
          <ShinyText text="Ayarlar" speed={7} />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Satış, tamir ve reçete türlerini; ürün kategorilerini yönetin.</p>
      </div>

      <div role="tablist" aria-label="Ayar bölümleri" className="flex border-b border-border">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600",
                selected ? "border-emerald-600 font-semibold text-emerald-700 dark:text-emerald-400" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {activeTab === "transaction-types" ? <TransactionTypesSettings /> : <CategorySettings />}
      </div>
    </div>
  );
}

function TransactionTypesSettings() {
  const [types, setTypes] = useState<TransactionType[] | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let active = true;
    apiGet<unknown>("/api/v1/admin/transaction-types")
      .then((data) => {
        if (active) setTypes(normalizeList(data).map(toTransactionType).filter((type): type is TransactionType => type !== null));
      })
      .catch(() => {
        if (active) setTypes([]);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const missing = types ? PRESET_TYPES.filter((preset) => !types.some((type) => type.category === preset.category)) : [];

  async function addPresets() {
    if (!types) return;
    setAdding(true);
    try {
      const added = await addMissingPresetTypes(types);
      toast.success(`${added} işlem türü eklendi. Artık satış, tamir ve reçete girebilirsiniz.`);
      setReloadKey((key) => key + 1);
    } catch (error) {
      toast.error(friendlyApiError(error, "İşlem türleri eklenemedi."));
    } finally {
      setAdding(false);
    }
  }

  async function toggleActive(item: ApiRecord, reload: () => Promise<void>) {
    const next = item.active === false;
    try {
      await apiPatch(`/api/v1/admin/transaction-types/${item.id}`, { active: next });
      toast.success(next ? `${String(item.name)} tekrar kullanımda.` : `${String(item.name)} pasif; yeni kayıtlarda seçilemez.`);
      await reload();
      setReloadKey((key) => key + 1);
    } catch (error) {
      toast.error(friendlyApiError(error, "Durum değiştirilemedi."));
    }
  }

  return (
    <div className="space-y-4">
      {missing.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          <div>
            <p className="font-semibold">Satış, tamir ve reçete için birer işlem türü gerekli.</p>
            <p className="mt-1 text-emerald-900/80 dark:text-emerald-100/80">
              Eksik olanlar: {missing.map((preset) => preset.name).join(", ")}. Tek tıkla ekleyip sonra adlarını değiştirebilirsiniz.
            </p>
          </div>
          <Button type="button" onClick={() => void addPresets()} disabled={adding} className="shrink-0">
            {adding ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Önerilenleri ekle
          </Button>
        </div>
      )}

      <ResourcePage
        title="İşlem türleri"
        description="İşlem türleri"
        listPath="/api/v1/admin/transaction-types"
        createPath="/api/v1/admin/transaction-types"
        updatePath={(id) => `/api/v1/admin/transaction-types/${id}`}
        deletePath={(id) => `/api/v1/admin/transaction-types/${id}`}
        hideHeader
        reloadKey={reloadKey}
        labels={{
          create: "Tür ekle",
          createTitle: "Yeni işlem türü",
          updateTitle: "İşlem türünü düzenle",
          created: "İşlem türü eklendi.",
          updated: "İşlem türü güncellendi.",
          deleted: "İşlem türü silindi.",
          deleteTitle: "İşlem türü silinsin mi?",
          deleteDescription: "yeni kayıtlarda seçilemez. Geçmiş kayıtlar etkilenmez.",
          searchPlaceholder: "Tür ara",
          detailTitle: "İşlem türü",
        }}
        fields={[
          { name: "name", label: "Ad", required: true, placeholder: "Örn. Perakende Satış" },
          {
            name: "category",
            label: "Kullanıldığı yer",
            type: "select",
            required: true,
            options: Object.keys(CATEGORY_LABELS),
            optionLabels: Object.fromEntries(Object.entries(CATEGORY_LABELS).map(([key, label]) => [key, `${label} — ${CATEGORY_HELP[key as keyof typeof CATEGORY_HELP]}`])),
          },
          { name: "code", label: "Kod", hideOnEdit: true, placeholder: "Boş bırakın, addan oluşturulur", help: "Raporlarda görünen kısa ad. Sonradan değiştirilemez." },
          { name: "sortOrder", label: "Sıra", type: "number", inputMode: "numeric", step: 1, help: "Listelerde küçük sayı önce gelir." },
        ]}
        defaultValues={{ category: "SALE" }}
        transformPayload={(form, original) => transactionTypePayload(form, original)}
        defaultSort={{ key: "sortOrder", direction: "asc" }}
        columns={[
          { key: "name", label: "Ad" },
          {
            key: "category",
            label: "Kullanıldığı yer",
            filterable: true,
            value: (item) => (isCategory(item.category) ? CATEGORY_LABELS[item.category] : String(item.category ?? "-")),
            render: (item) => <StatusBadge value={item.category} label={isCategory(item.category) ? CATEGORY_LABELS[item.category] : String(item.category ?? "-")} />,
          },
          {
            key: "active",
            label: "Durum",
            value: (item) => (item.active === false ? "Pasif" : "Kullanımda"),
            render: (item) => <StatusBadge value={item.active !== false} label={item.active === false ? "Pasif" : "Kullanımda"} />,
          },
          { key: "code", label: "Kod", hideOnMobile: true },
          { key: "sortOrder", label: "Sıra", align: "right", hideOnMobile: true },
        ]}
        rowActions={(item, { reload }) => (
          <Button type="button" variant="outline" size="sm" onClick={() => void toggleActive(item, reload)}>
            {item.active === false ? "Kullanıma al" : "Pasifleştir"}
          </Button>
        )}
        emptyText="Henüz işlem türü yok. Yukarıdaki önerilenleri ekleyin veya kendi türünüzü oluşturun."
      />
    </div>
  );
}

function CategorySettings() {
  return (
    <ResourcePage
      title="Ürün kategorileri"
      description="Ürün kategorileri"
      listPath="/api/v1/admin/inventory/categories"
      createPath="/api/v1/admin/inventory/categories"
      updatePath={(id) => `/api/v1/admin/inventory/categories/${id}`}
      deletePath={(id) => `/api/v1/admin/inventory/categories/${id}`}
      hideHeader
      labels={{
        create: "Kategori ekle",
        createTitle: "Yeni kategori",
        updateTitle: "Kategoriyi düzenle",
        created: "Kategori eklendi.",
        updated: "Kategori güncellendi.",
        deleted: "Kategori silindi.",
        deleteTitle: "Kategori silinsin mi?",
        deleteDescription: "listeden kaldırılacak. Bu kategorideki ürünler silinmez.",
        searchPlaceholder: "Kategori ara",
        detailTitle: "Kategori",
      }}
      fields={[
        { name: "name", label: "Kategori adı", required: true, placeholder: "Örn. Güneş Gözlüğü" },
        { name: "description", label: "Açıklama", placeholder: "İsteğe bağlı" },
      ]}
      columns={[
        { key: "name", label: "Kategori" },
        { key: "description", label: "Açıklama" },
        { key: "code", label: "Kod", hideOnMobile: true },
      ]}
      defaultSort={{ key: "name", direction: "asc" }}
      emptyText="Henüz kategori yok."
    />
  );
}
