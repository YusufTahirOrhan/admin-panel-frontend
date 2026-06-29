"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  GripVertical,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiRecord, PageBlock, SitePage, apiGet, apiPost, apiPut, apiUpload } from "@/lib/management-api";
import { cn } from "@/lib/utils";

const blockTypes = ["hero", "services", "featuredProducts", "about", "contact", "hours", "cta"] as const;

type BlockType = (typeof blockTypes)[number];

type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "url" | "email";
  placeholder?: string;
};

const blockLabels: Record<BlockType, string> = {
  hero: "Hero",
  services: "Hizmetler",
  featuredProducts: "Öne Çıkan Ürünler",
  about: "Hakkımızda",
  contact: "İletişim",
  hours: "Çalışma Saatleri",
  cta: "Çağrı Alanı",
};

const defaultContent: Record<BlockType, ApiRecord> = {
  hero: {
    title: "OptiMaxx Optik",
    subtitle: "Göz sağlığınız ve stiliniz için modern optik çözümler.",
    eyebrow: "Optik mağazası",
    imageUrl: "",
  },
  services: {
    title: "Hizmetlerimiz",
    subtitle: "Mağazada sunduğumuz temel optik hizmetler.",
    items: ["Gözlük çerçevesi", "Optik cam", "Kontakt lens", "Tamir ve ayar"],
  },
  featuredProducts: {
    title: "Öne Çıkan Ürünler",
    subtitle: "Sezonun dikkat çeken ürünleri ve cam seçenekleri.",
    items: ["Ray-Ban Aviator", "Progresif Cam", "Kontakt Lens"],
  },
  about: {
    title: "Hakkımızda",
    body: "Optik deneyimini hızlı, güvenilir ve kişisel hale getiriyoruz.",
    imageUrl: "",
  },
  contact: {
    title: "Bize Ulaşın",
    phone: "+90 555 123 4567",
    email: "contact@optimaxx.com",
    address: "Merkez Mahallesi, Optik Caddesi No: 1",
    mapUrl: "",
  },
  hours: {
    title: "Çalışma Saatleri",
    weekdays: "09:00 - 19:00",
    saturday: "10:00 - 17:00",
    sunday: "Kapalı",
  },
  cta: {
    title: "Size uygun camı birlikte seçelim",
    subtitle: "Ekibimiz ihtiyaçlarınıza göre en doğru çözümü bulmanıza yardımcı olur.",
    imageUrl: "",
  },
};

const fieldsByType: Record<BlockType, FieldConfig[]> = {
  hero: [
    { key: "eyebrow", label: "Üst başlık" },
    { key: "title", label: "Başlık" },
    { key: "subtitle", label: "Açıklama", type: "textarea" },
    { key: "imageUrl", label: "Görsel URL", type: "url" },
  ],
  services: [
    { key: "title", label: "Başlık" },
    { key: "subtitle", label: "Açıklama", type: "textarea" },
  ],
  featuredProducts: [
    { key: "title", label: "Başlık" },
    { key: "subtitle", label: "Açıklama", type: "textarea" },
  ],
  about: [
    { key: "title", label: "Başlık" },
    { key: "body", label: "Metin", type: "textarea" },
    { key: "imageUrl", label: "Görsel URL", type: "url" },
  ],
  contact: [
    { key: "title", label: "Başlık" },
    { key: "phone", label: "Telefon" },
    { key: "email", label: "E-posta", type: "email" },
    { key: "address", label: "Adres", type: "textarea" },
    { key: "mapUrl", label: "Harita URL", type: "url" },
  ],
  hours: [
    { key: "title", label: "Başlık" },
    { key: "weekdays", label: "Hafta içi" },
    { key: "saturday", label: "Cumartesi" },
    { key: "sunday", label: "Pazar" },
  ],
  cta: [
    { key: "title", label: "Başlık" },
    { key: "subtitle", label: "Açıklama", type: "textarea" },
    { key: "imageUrl", label: "Görsel URL", type: "url" },
  ],
};

const listFieldTypes = new Set<BlockType>(["services", "featuredProducts"]);
const imageFieldTypes = new Set<BlockType>(["hero", "about", "cta"]);

function isBlockType(type: string): type is BlockType {
  return blockTypes.includes(type as BlockType);
}

function blockTitle(block: PageBlock) {
  const type = isBlockType(block.type) ? blockLabels[block.type] : block.type;
  const title = typeof block.content.title === "string" ? block.content.title : "";
  return title ? `${type}: ${title}` : type;
}

function textValue(content: ApiRecord, key: string) {
  const value = content[key];
  return value === undefined || value === null ? "" : String(value);
}

function listValue(content: ApiRecord) {
  const value = content.items;
  return Array.isArray(value) ? value.map(String) : [];
}

function normalizeOrders(blocks: PageBlock[]) {
  return blocks.map((block, index) => ({ ...block, order: index }));
}

function buildBlock(type: BlockType, order: number): PageBlock {
  return {
    type,
    order,
    enabled: true,
    content: { ...defaultContent[type] },
  };
}

export function SiteEditor() {
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedBlock = blocks[selectedIndex];
  const selectedType = selectedBlock && isBlockType(selectedBlock.type) ? selectedBlock.type : null;

  const enabledBlocks = useMemo(
    () => blocks.filter((block) => block.enabled).sort((a, b) => a.order - b.order),
    [blocks],
  );

  useEffect(() => {
    async function loadDraft() {
      setLoading(true);
      setError(null);
      try {
        const page = await apiGet<SitePage>("/api/v1/admin/pages/home/draft");
        const nextBlocks = normalizeOrders(page.blocks ?? []);
        setBlocks(nextBlocks);
        setSelectedIndex(0);
      } catch (exception) {
        setError(exception instanceof Error ? exception.message : "Taslak yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }

    void loadDraft();
  }, []);

  function updateBlocks(updater: (current: PageBlock[]) => PageBlock[], nextSelectedIndex = selectedIndex) {
    setBlocks((current) => normalizeOrders(updater(current)));
    setSelectedIndex(Math.max(0, nextSelectedIndex));
    setMessage(null);
  }

  function selectBlock(index: number) {
    setSelectedIndex(index);
    setMessage(null);
  }

  function updateSelected(patch: Partial<PageBlock>) {
    setBlocks((current) =>
      current.map((block, index) => (index === selectedIndex ? { ...block, ...patch } : block)),
    );
    setMessage(null);
  }

  function updateSelectedContent(key: string, value: string | string[]) {
    if (!selectedBlock) return;
    updateSelected({
      content: {
        ...selectedBlock.content,
        [key]: value,
      },
    });
  }

  function changeSelectedType(type: BlockType) {
    updateSelected({
      type,
      content: { ...defaultContent[type], ...selectedBlock?.content },
    });
  }

  function addBlock(type: BlockType) {
    const nextIndex = blocks.length;
    updateBlocks((current) => [...current, buildBlock(type, current.length)], nextIndex);
  }

  function removeSelected() {
    if (!selectedBlock) return;
    const nextSelected = selectedIndex > 0 ? selectedIndex - 1 : 0;
    updateBlocks((current) => current.filter((_, index) => index !== selectedIndex), nextSelected);
  }

  function moveBlock(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= blocks.length || fromIndex === toIndex) return;
    const movingSelected = selectedIndex === fromIndex;
    const selectedAfterMove =
      movingSelected ? toIndex : selectedIndex === toIndex ? fromIndex : selectedIndex;

    updateBlocks((current) => {
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    }, selectedAfterMove);
  }

  function handleDragStart(event: DragEvent<HTMLButtonElement>, index: number) {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>, index: number) {
    event.preventDefault();
    const sourceIndex = draggedIndex ?? Number(event.dataTransfer.getData("text/plain"));
    setDraggedIndex(null);
    if (Number.isInteger(sourceIndex)) {
      moveBlock(sourceIndex, index);
    }
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !selectedBlock) return;

    setUploading(true);
    setError(null);
    try {
      const response = await apiUpload<{ url: string }>("/api/v1/admin/pages/assets", file);
      updateSelectedContent("imageUrl", response.url);
      setMessage("Görsel yüklendi ve URL alana eklendi.");
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
    }
  }

  async function saveDraft() {
    if (blocks.length === 0) {
      setError("Kaydetmek için en az bir blok ekleyin.");
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await apiPut<SitePage>("/api/v1/admin/pages/home/draft", {
        blocks: normalizeOrders(blocks),
      });
      setMessage("Taslak kaydedildi.");
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Taslak kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  async function publishDraft() {
    if (blocks.length === 0) {
      setError("Yayınlamak için en az bir blok ekleyin.");
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await apiPut<SitePage>("/api/v1/admin/pages/home/draft", {
        blocks: normalizeOrders(blocks),
      });
      await apiPost<SitePage>("/api/v1/admin/pages/home/publish");
      setMessage("Ana sayfa yayınlandı.");
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Yayınlama başarısız.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="h-96 animate-pulse rounded-lg border bg-muted/40" />
        <div className="h-96 animate-pulse rounded-lg border bg-muted/40" />
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Bloklar</h2>
              <p className="mt-1 text-xs text-muted-foreground">Sürükleyerek veya oklarla sıralayın.</p>
            </div>
            <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{blocks.length} blok</span>
          </div>

          <div className="mt-4 space-y-2">
            {blocks.length === 0 ? (
              <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
                Henüz blok yok. Aşağıdan bir blok tipi ekleyin.
              </div>
            ) : (
              blocks.map((block, index) => (
                <button
                  key={`${block.type}-${index}`}
                  type="button"
                  draggable
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    selectedIndex === index ? "border-primary bg-muted" : "hover:bg-muted/60",
                    draggedIndex === index && "opacity-60",
                  )}
                  onClick={() => selectBlock(index)}
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, index)}
                  onDragEnd={() => setDraggedIndex(null)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{blockTitle(block)}</span>
                    <span className="text-xs text-muted-foreground">
                      Sıra {index + 1} · {block.enabled ? "Aktif" : "Pasif"}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      block.enabled ? "bg-emerald-500" : "bg-muted-foreground/40",
                    )}
                  />
                </button>
              ))
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {blockTypes.map((type) => (
              <Button key={type} type="button" variant="outline" size="sm" onClick={() => addBlock(type)}>
                <Plus />
                {blockLabels[type]}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold">Akış</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <Button type="button" variant="outline" onClick={() => void saveDraft()} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Save />}
              Taslağı Kaydet
            </Button>
            <Button type="button" onClick={() => void publishDraft()} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Send />}
              Yayınla
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-4">
          {message && (
            <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4" />
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <XCircle className="mt-0.5 h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {selectedBlock && selectedType ? (
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Seçili Blok</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{blockLabels[selectedType]} içeriğini düzenleyin.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Yukarı taşı"
                    onClick={() => moveBlock(selectedIndex, selectedIndex - 1)}
                    disabled={selectedIndex === 0}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Aşağı taşı"
                    onClick={() => moveBlock(selectedIndex, selectedIndex + 1)}
                    disabled={selectedIndex === blocks.length - 1}
                  >
                    <ArrowDown />
                  </Button>
                  <Button type="button" variant="destructive" onClick={removeSelected}>
                    <Trash2 />
                    Sil
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <label className="space-y-1.5 text-sm">
                  <span className="font-medium">Tip</span>
                  <select
                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    value={selectedType}
                    onChange={(event) => changeSelectedType(event.target.value as BlockType)}
                  >
                    {blockTypes.map((type) => (
                      <option key={type} value={type}>
                        {blockLabels[type]}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="space-y-1.5 text-sm">
                  <span className="font-medium">Sıra</span>
                  <div className="flex h-8 items-center rounded-lg border bg-muted px-2.5 text-sm text-muted-foreground">
                    {selectedIndex + 1}
                  </div>
                </div>

                <label className="flex items-end gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mb-2 h-4 w-4 rounded border-input"
                    checked={selectedBlock.enabled}
                    onChange={(event) => updateSelected({ enabled: event.target.checked })}
                  />
                  <span className="pb-1.5">Aktif</span>
                </label>
              </div>

              <div className="mt-5 grid gap-4">
                {fieldsByType[selectedType].map((field) => (
                  <label key={field.key} className="space-y-1.5 text-sm">
                    <span className="font-medium">{field.label}</span>
                    {field.type === "textarea" ? (
                      <textarea
                        className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        value={textValue(selectedBlock.content, field.key)}
                        placeholder={field.placeholder}
                        onChange={(event) => updateSelectedContent(field.key, event.target.value)}
                      />
                    ) : (
                      <Input
                        type={field.type ?? "text"}
                        value={textValue(selectedBlock.content, field.key)}
                        placeholder={field.placeholder}
                        onChange={(event) => updateSelectedContent(field.key, event.target.value)}
                      />
                    )}
                  </label>
                ))}

                {imageFieldTypes.has(selectedType) && (
                  <div className="rounded-lg border border-dashed p-3">
                    <label className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <span>
                        <span className="block font-medium">Dosyadan görsel yükle</span>
                        <span className="text-xs text-muted-foreground">Yüklenen dosyanın URL’i görsel alanına yazılır.</span>
                      </span>
                      <span className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                        Dosya Seç
                      </span>
                      <input className="sr-only" type="file" accept="image/*" onChange={(event) => void uploadImage(event)} />
                    </label>
                  </div>
                )}

                {listFieldTypes.has(selectedType) && (
                  <ListEditor items={listValue(selectedBlock.content)} onChange={(items) => updateSelectedContent("items", items)} />
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
              Düzenlemek için bir blok seçin veya yeni blok ekleyin.
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-auto">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <Eye className="h-4 w-4" />
            Canlı Önizleme
          </h2>
          <div className="overflow-hidden rounded-lg border bg-white text-slate-950">
            {enabledBlocks.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">Aktif blok yok. Önizleme için bir bloğu aktif edin.</div>
            ) : (
              enabledBlocks.map((block, index) => <PreviewBlock key={`${block.type}-${index}`} block={block} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListEditor({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  function updateItem(index: number, value: string) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">Liste öğeleri</span>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, "Yeni öğe"])}>
          <Plus />
          Ekle
        </Button>
      </div>
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">Liste boş.</div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={`${item}-${index}`} className="flex gap-2">
              <Input value={item} onChange={(event) => updateItem(index, event.target.value)} />
              <Button type="button" variant="destructive" size="icon" aria-label="Öğeyi sil" onClick={() => removeItem(index)}>
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PreviewBlock({ block }: { block: PageBlock }) {
  const content = block.content;
  const type = isBlockType(block.type) ? block.type : "cta";
  const imageUrl = textValue(content, "imageUrl");

  if (type === "hero") {
    return (
      <section className="bg-slate-950 px-5 py-8 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">{textValue(content, "eyebrow") || "Optik mağazası"}</p>
        <h3 className="mt-3 text-3xl font-bold">{textValue(content, "title") || "OptiMaxx Optik"}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">{textValue(content, "subtitle")}</p>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            width={800}
            height={450}
            unoptimized
            className="mt-5 aspect-video w-full rounded-lg object-cover"
          />
        ) : null}
      </section>
    );
  }

  if (type === "services" || type === "featuredProducts") {
    return (
      <section className="border-b px-5 py-6">
        <h3 className="text-xl font-bold">{textValue(content, "title") || blockLabels[type]}</h3>
        <p className="mt-2 text-sm text-slate-500">{textValue(content, "subtitle")}</p>
        <div className="mt-4 grid gap-2">
          {listValue(content).map((item) => (
            <div key={item} className="rounded-lg border p-3 text-sm font-medium">
              {item}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (type === "about" || type === "cta") {
    return (
      <section className="border-b bg-slate-50 px-5 py-6 text-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            width={800}
            height={450}
            unoptimized
            className="mb-4 aspect-video w-full rounded-lg object-cover"
          />
        ) : null}
        <h3 className="text-xl font-bold">{textValue(content, "title") || blockLabels[type]}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{textValue(content, type === "about" ? "body" : "subtitle")}</p>
      </section>
    );
  }

  return (
    <section className="border-b px-5 py-6">
      <h3 className="text-xl font-bold">{textValue(content, "title") || blockLabels[type]}</h3>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        {["phone", "email", "address", "weekdays", "saturday", "sunday"].map((key) =>
          textValue(content, key) ? (
            <p key={key} className="flex justify-between gap-4 border-b pb-2 last:border-0">
              <span className="font-medium">{fieldLabel(key)}</span>
              <span className="text-right">{textValue(content, key)}</span>
            </p>
          ) : null,
        )}
      </div>
    </section>
  );
}

function fieldLabel(key: string) {
  const labels: Record<string, string> = {
    phone: "Telefon",
    email: "E-posta",
    address: "Adres",
    weekdays: "Hafta içi",
    saturday: "Cumartesi",
    sunday: "Pazar",
  };
  return labels[key] ?? key;
}
