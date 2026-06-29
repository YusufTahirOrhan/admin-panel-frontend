"use client";

import type { ReactNode } from "react";
import { FormEvent, MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ApiRecord,
  ResourceField,
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  fieldValue,
  friendlyApiError,
  normalizeList,
} from "@/lib/management-api";
import { cn } from "@/lib/utils";

type SortDirection = "asc" | "desc";

interface ResourceColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
}

interface ResourcePageProps {
  title: string;
  description: string;
  listPath: string;
  createPath?: string;
  updatePath?: (id: string) => string;
  deletePath?: (id: string) => string;
  detailPath?: (id: string) => string;
  fields?: ResourceField[];
  columns: ResourceColumn[];
  emptyText?: string;
}

const pageSizes = [10, 20, 50];

export function ResourcePage({
  title,
  description,
  listPath,
  createPath,
  updatePath,
  deletePath,
  detailPath,
  fields = [],
  columns,
  emptyText = "Kayıt bulunamadı.",
}: ResourcePageProps) {
  const [items, setItems] = useState<ApiRecord[]>([]);
  const [form, setForm] = useState<ApiRecord>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<ApiRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState(columns[0]?.key ?? "id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => items.find((item) => String(item.id) === selectedId),
    [items, selectedId],
  );

  const visibleColumns = useMemo(
    () => columns.map((column) => ({ sortable: true, filterable: true, ...column })),
    [columns],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<unknown>(withDefaultSize(listPath));
      setItems(normalizeList(data));
    } catch (exception) {
      setError(friendlyApiError(exception, "Veriler alınamadı."));
    } finally {
      setLoading(false);
    }
  }, [listPath]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const filterOptions = useMemo(() => {
    return visibleColumns.reduce<Record<string, string[]>>((result, column) => {
      if (!column.filterable) {
        return result;
      }

      const values = Array.from(
        new Set(
          items
            .map((item) => fieldValue(item, [column.key]))
            .filter((value) => value !== "-"),
        ),
      ).slice(0, 20);

      if (values.length > 1 && values.length <= 20) {
        result[column.key] = values;
      }

      return result;
    }, {});
  }, [items, visibleColumns]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("tr-TR");

    return items
      .filter((item) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [...visibleColumns.map((column) => column.key), ...fields.map((field) => field.name)]
            .some((key) =>
              fieldValue(item, [key]).toLocaleLowerCase("tr-TR").includes(normalizedSearch),
            );

        const matchesFilters = Object.entries(filters).every(([key, value]) => {
          return !value || fieldValue(item, [key]) === value;
        });

        return matchesSearch && matchesFilters;
      })
      .sort((left, right) => compareValues(fieldValue(left, [sortKey]), fieldValue(right, [sortKey]), sortDirection));
  }, [fields, filters, items, searchTerm, sortDirection, sortKey, visibleColumns]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function startCreate() {
    setSelectedId(null);
    setForm({});
  }

  function startEdit(item: ApiRecord) {
    const id = getRecordId(item);
    setSelectedId(id);
    setForm(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function openDetail(item: ApiRecord) {
    const id = getRecordId(item);
    setDetailItem(item);

    if (!id || !detailPath) {
      return;
    }

    setDetailLoading(true);
    try {
      setDetailItem(await apiGet<ApiRecord>(detailPath(id)));
    } catch (exception) {
      setError(friendlyApiError(exception, "Kayıt detayı alınamadı."));
    } finally {
      setDetailLoading(false);
    }
  }

  function sortBy(column: ResourceColumn) {
    if (column.sortable === false) {
      return;
    }

    if (sortKey === column.key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(column.key);
    setSortDirection("asc");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!createPath) return;
    setSaving(true);
    setError(null);
    try {
      if (selectedId && updatePath) {
        await apiPatch(updatePath(selectedId), sanitizePayload(form));
      } else {
        await apiPost(createPath, sanitizePayload(form));
      }
      startCreate();
      await load();
    } catch (exception) {
      setError(friendlyApiError(exception, "Kayıt işlemi başarısız oldu."));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    const id = deleteTarget ? getRecordId(deleteTarget) : null;
    if (!id || !deletePath) {
      return;
    }

    setDeleting(true);
    setError(null);
    try {
      await apiDelete(deletePath(id));
      setDeleteTarget(null);
      if (selectedId === id) {
        startCreate();
      }
      await load();
    } catch (exception) {
      setError(friendlyApiError(exception, "Kayıt silinemedi."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button type="button" variant="outline" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={cn(loading && "animate-spin")} />
          Yenile
        </Button>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button type="button" aria-label="Hatayı kapat" onClick={() => setError(null)}>
            <X className="size-4" />
          </button>
        </div>
      )}

      {fields.length > 0 && createPath && (
        <form onSubmit={submit} className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">{selected ? "Kaydı Güncelle" : "Yeni Kayıt"}</h2>
              <p className="text-xs text-muted-foreground">
                Zorunlu alanları tamamlayıp kaydı güvenle oluşturun veya güncelleyin.
              </p>
            </div>
            {selected && (
              <Button type="button" variant="outline" onClick={startCreate}>
                <Plus />
                Yeni kayıt
              </Button>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {fields.map((field) => (
              <label key={field.name} className="space-y-1.5 text-sm">
                <span className="font-medium">{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    className="min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    placeholder={field.placeholder}
                    value={String(form[field.name] ?? "")}
                    required={field.required}
                    onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                  />
                ) : field.type === "select" ? (
                  <select
                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    value={String(form[field.name] ?? "")}
                    required={field.required}
                    onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                  >
                    <option value="">Seçiniz</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    value={String(form[field.name] ?? "")}
                    required={field.required}
                    onChange={(event) => {
                      const value =
                        field.type === "number" && event.target.value !== ""
                          ? Number(event.target.value)
                          : event.target.value;
                      setForm((current) => ({ ...current, [field.name]: value }));
                    }}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="mt-4">
            <Button type="submit" disabled={saving || (Boolean(selectedId) && !updatePath)}>
              {saving ? <Loader2 className="animate-spin" /> : selected ? <Save /> : <Plus />}
              {selected ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </form>
      )}

      <div className="rounded-lg border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              value={searchTerm}
              placeholder="Kayıtlarda ara..."
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(filterOptions).map(([key, values]) => (
              <select
                key={key}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none"
                value={filters[key] ?? ""}
                onChange={(event) => {
                  setFilters((current) => ({ ...current, [key]: event.target.value }));
                  setPage(1);
                }}
              >
                <option value="">{columnLabel(visibleColumns, key)}: Tümü</option>
                {values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ))}
            <select
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none"
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size} satır
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                {visibleColumns.map((column) => (
                  <th key={column.key} className="px-4 py-3 font-semibold">
                    <button
                      type="button"
                      className="inline-flex max-w-full items-center gap-1 truncate"
                      onClick={() => sortBy(column)}
                    >
                      <span className="truncate">{column.label}</span>
                      {sortKey === column.key &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="size-3.5" />
                        ) : (
                          <ArrowDown className="size-3.5" />
                        ))}
                    </button>
                  </th>
                ))}
                <th className="w-32 px-4 py-3 text-right font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="border-t">
                    {visibleColumns.map((column) => (
                      <td key={column.key} className="px-4 py-3">
                        <Skeleton className="h-4 w-full max-w-40" />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <Skeleton className="ml-auto h-8 w-24" />
                    </td>
                  </tr>
                ))
              ) : pageItems.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-muted-foreground" colSpan={visibleColumns.length + 1}>
                    <div className="mx-auto max-w-sm space-y-2">
                      <p className="font-medium text-foreground">{emptyText}</p>
                      <p className="text-sm">Arama ya da filtreleri temizleyerek tekrar deneyebilirsiniz.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageItems.map((item, index) => (
                  <tr
                    key={String(item.id ?? index)}
                    className="cursor-pointer border-t transition-colors hover:bg-muted/40"
                    onClick={() => void openDetail(item)}
                  >
                    {visibleColumns.map((column) => (
                      <td key={column.key} className="truncate px-4 py-3" title={fieldValue(item, [column.key])}>
                        {fieldValue(item, [column.key])}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <ActionButton label="Detay" onClick={(event) => action(event, () => void openDetail(item))}>
                          <Eye />
                        </ActionButton>
                        {updatePath && (
                          <ActionButton label="Düzenle" onClick={(event) => action(event, () => startEdit(item))}>
                            <Pencil />
                          </ActionButton>
                        )}
                        {deletePath && (
                          <ActionButton
                            label="Sil"
                            destructive
                            onClick={(event) => action(event, () => setDeleteTarget(item))}
                          >
                            <Trash2 />
                          </ActionButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            {filteredItems.length} kayıttan {pageItems.length} kayıt gösteriliyor
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Önceki
            </Button>
            <span className="min-w-20 text-center">
              {currentPage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            >
              Sonraki
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={Boolean(detailItem)} onOpenChange={(open) => !open && setDetailItem(null)}>
        <SheetContent className="w-[92vw] overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Kayıt Detayı</SheetTitle>
            <SheetDescription>Seçili kaydın tüm alanları.</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4 pb-4">
            {detailLoading ? (
              Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-12 w-full" />)
            ) : detailItem ? (
              Object.entries(detailItem).map(([key, value]) => (
                <div key={key} className="rounded-lg border bg-muted/20 p-3">
                  <dt className="text-xs font-medium uppercase text-muted-foreground">{key}</dt>
                  <dd className="mt-1 break-words text-sm text-foreground">{formatDetailValue(value)}</dd>
                </div>
              ))
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-lg border bg-card p-5 shadow-lg">
            <h2 className="text-base font-semibold">Kaydı silmek istiyor musunuz?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Bu işlem seçili kaydı pasifleştirebilir veya silebilir. Devam etmeden önce kaydı kontrol edin.
            </p>
            <div className="mt-4 rounded-lg bg-muted/40 p-3 text-sm">
              {visibleColumns.slice(0, 3).map((column) => (
                <div key={column.key} className="flex justify-between gap-3 py-1">
                  <span className="text-muted-foreground">{column.label}</span>
                  <span className="truncate font-medium">{fieldValue(deleteTarget, [column.key])}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Vazgeç
              </Button>
              <Button type="button" variant="destructive" onClick={() => void confirmDelete()} disabled={deleting}>
                {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
                Sil
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  children,
  destructive,
  label,
  onClick,
}: {
  children: ReactNode;
  destructive?: boolean;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <Button
      type="button"
      variant={destructive ? "destructive" : "ghost"}
      size="icon-sm"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function action(event: MouseEvent<HTMLButtonElement>, callback: () => void) {
  event.preventDefault();
  event.stopPropagation();
  callback();
}

function getRecordId(item: ApiRecord): string | null {
  return item.id === undefined || item.id === null ? null : String(item.id);
}

function compareValues(left: string, right: string, direction: SortDirection) {
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  const multiplier = direction === "asc" ? 1 : -1;

  if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
    return (leftNumber - rightNumber) * multiplier;
  }

  return left.localeCompare(right, "tr", { numeric: true, sensitivity: "base" }) * multiplier;
}

function columnLabel(columns: ResourceColumn[], key: string) {
  return columns.find((column) => column.key === key)?.label ?? key;
}

function formatDetailValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

function sanitizePayload(payload: ApiRecord): ApiRecord {
  return Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => key !== "id" && value !== undefined),
  );
}

function withDefaultSize(path: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return path.includes("size=") ? path : `${path}${separator}size=200`;
}
