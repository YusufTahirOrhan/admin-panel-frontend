"use client";

import type { ReactNode } from "react";
import { FormEvent, MouseEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronRight, Eye, Loader2, Pencil, Plus, RefreshCw, Save, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
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
  normalizePageMeta,
} from "@/lib/management-api";
import { formatDate, formatDateTime, formatMoney } from "@/lib/format";
import { toast } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

type SortDirection = "asc" | "desc";

export interface ResourceColumn {
  key: string;
  label: string;
  sortable?: boolean;
  /** Adds a dropdown filter with this column's distinct values. */
  filterable?: boolean;
  format?: "text" | "money" | "date" | "datetime" | "badge" | "number";
  /** Custom cell. Pair it with `value` so search, sort and filters still work. */
  render?: (item: ApiRecord) => ReactNode;
  /** Plain-text value used for search, sort and filters. */
  value?: (item: ApiRecord) => string;
  hideOnMobile?: boolean;
  align?: "left" | "right";
}

export interface RowActionContext {
  reload: () => Promise<void>;
  edit: () => void;
}

interface ResourceLabels {
  /** Button that opens the empty form, e.g. "Ürün ekle". */
  create?: string;
  createTitle?: string;
  updateTitle?: string;
  submitCreate?: string;
  submitUpdate?: string;
  created?: string;
  updated?: string;
  deleted?: string;
  deleteTitle?: string;
  deleteDescription?: string;
  detailTitle?: string;
  searchPlaceholder?: string;
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
  updateFields?: ResourceField[];
  columns: ResourceColumn[];
  emptyText?: string;
  hideHeader?: boolean;
  hideInlineForm?: boolean;
  labels?: ResourceLabels;
  /** Initial values of the create form (e.g. the only matching transaction type). */
  defaultValues?: ApiRecord;
  /** Final say on the request body (e.g. generated codes). */
  transformPayload?: (form: ApiRecord, original: ApiRecord | undefined) => ApiRecord;
  /** Extra per-row buttons (status steps, stock movement, ...). */
  rowActions?: (item: ApiRecord, context: RowActionContext) => ReactNode;
  renderDetail?: (item: ApiRecord, loading: boolean) => ReactNode;
  defaultSort?: { key: string; direction: SortDirection };
  /** Shown at the top of the form (e.g. "add a repair type first"). */
  formNotice?: ReactNode;
  /** Disables the form submit (with formNotice explaining why). */
  formDisabled?: boolean;
  /** Extra controls in the header row next to "Yenile". */
  toolbar?: ReactNode;
  /** Changing it reloads the list. */
  reloadKey?: unknown;
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
  updateFields,
  columns,
  emptyText = "Kayıt bulunamadı.",
  hideHeader = false,
  hideInlineForm = false,
  labels = {},
  defaultValues,
  transformPayload,
  rowActions,
  renderDetail,
  defaultSort,
  formNotice,
  formDisabled,
  toolbar,
  reloadKey,
}: ResourcePageProps) {
  const [items, setItems] = useState<ApiRecord[]>([]);
  const [form, setForm] = useState<ApiRecord>(() => ({ ...defaultValues }));
  const [touchedDefaults, setTouchedDefaults] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<ApiRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState(defaultSort?.key ?? columns[0]?.key ?? "id");
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSort?.direction ?? "asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState<number | null>(null);
  const [loadedPage, setLoadedPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const detailRequest = useRef(0);
  const mutationPending = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  // Opening the form (create or edit) brings it into view and focuses its first field.
  // Done in an effect so the handlers passed to row actions never touch the ref.
  const [formFocusRequest, setFormFocusRequest] = useState(0);
  useEffect(() => {
    if (formFocusRequest === 0) return;
    const timer = window.setTimeout(() => {
      const formElement = formRef.current;
      if (!formElement) return;
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      formElement.querySelector<HTMLElement>("input:not([type=hidden]), select, textarea, [role=combobox]")?.focus({ preventScroll: true });
    }, 30);
    return () => window.clearTimeout(timer);
  }, [formFocusRequest]);
  const formId = useId();

  const editing = selectedId !== null;
  const selected = useMemo(() => items.find((item) => String(item.id) === selectedId), [items, selectedId]);
  const activeFields = useMemo(
    () => (editing && updateFields ? updateFields : fields).filter((field) => (editing ? !field.hideOnEdit : !field.hideOnCreate)),
    [editing, fields, updateFields],
  );
  // Defaults that arrive after the first render (e.g. loaded transaction types) fill empty fields.
  const effectiveForm = useMemo(
    () => (editing || touchedDefaults || !defaultValues ? form : { ...defaultValues, ...stripEmpty(form) }),
    [defaultValues, editing, form, touchedDefaults],
  );

  const columnText = useCallback((item: ApiRecord, column: ResourceColumn) => {
    if (column.value) return column.value(item);
    const raw = item[column.key];
    if (column.format === "money") return raw === null || raw === undefined || raw === "" ? "-" : formatMoney(raw);
    if (column.format === "date") return formatDate(raw);
    if (column.format === "datetime") return formatDateTime(raw);
    return fieldValue(item, [column.key]);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<unknown>(withDefaultSize(listPath));
      setItems(normalizeList(data));
      const meta = normalizePageMeta(data);
      setTotalRecords(meta?.totalElements ?? null);
      setLoadedPage(meta?.page ?? 0);
    } catch (exception) {
      setError(friendlyApiError(exception, "Kayıtlar yüklenemedi."));
    } finally {
      setLoading(false);
    }
  }, [listPath]);

  async function loadMore() {
    if (loadingMore || loading) return;
    setLoadingMore(true);
    try {
      const url = new URL(withDefaultSize(listPath), "http://localhost");
      url.searchParams.set("page", String(loadedPage + 1));
      const data = await apiGet<unknown>(`${url.pathname}${url.search}`);
      setItems((current) => Array.from(new Map([...current, ...normalizeList(data)].map((item) => [String(item.id), item])).values()));
      setLoadedPage((current) => current + 1);
      setTotalRecords(normalizePageMeta(data)?.totalElements ?? null);
    } catch (exception) {
      setError(friendlyApiError(exception, "Diğer kayıtlar yüklenemedi."));
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load, reloadKey]);

  const filterOptions = useMemo(() => {
    return columns.reduce<Record<string, string[]>>((result, column) => {
      if (!column.filterable) return result;
      const values = Array.from(new Set(items.map((item) => columnText(item, column)).filter((value) => value !== "-")));
      if (values.length > 1) result[column.key] = values.sort((a, b) => a.localeCompare(b, "tr"));
      return result;
    }, {});
  }, [columnText, columns, items]);

  const filteredItems = useMemo(() => {
    const needle = searchTerm.trim().toLocaleLowerCase("tr-TR");
    const sortColumn = columns.find((column) => column.key === sortKey);
    return items
      .filter((item) => {
        const matchesSearch =
          needle.length === 0 ||
          columns.some((column) => columnText(item, column).toLocaleLowerCase("tr-TR").includes(needle)) ||
          fields.some((field) => fieldValue(item, [field.name]).toLocaleLowerCase("tr-TR").includes(needle));
        const matchesFilters = Object.entries(filters).every(([key, value]) => {
          const column = columns.find((candidate) => candidate.key === key);
          return !value || !column || columnText(item, column) === value;
        });
        return matchesSearch && matchesFilters;
      })
      .sort((left, right) => compareItems(left, right, sortKey, sortColumn, columnText, sortDirection));
  }, [columnText, columns, fields, filters, items, searchTerm, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const canCreate = Boolean(createPath) && !hideInlineForm && fields.length > 0;
  const showForm = canCreate && (formOpen || editing || (!loading && !error && items.length === 0));
  const createLabel = labels.create ?? "Yeni kayıt";

  function resetForm() {
    setSelectedId(null);
    setForm({ ...defaultValues });
    setTouchedDefaults(false);
    setFieldErrors({});
  }

  function openCreate() {
    resetForm();
    setFormOpen(true);
    setFormFocusRequest((value) => value + 1);
  }

  function closeForm() {
    resetForm();
    setFormOpen(false);
  }

  function startEdit(item: ApiRecord) {
    setSelectedId(getRecordId(item));
    setForm({ ...item });
    setFieldErrors({});
    setFormOpen(true);
    setFormFocusRequest((value) => value + 1);
  }

  function setFieldValue(name: string, value: unknown) {
    setForm((current) => ({ ...(editing || touchedDefaults || !defaultValues ? current : { ...defaultValues, ...stripEmpty(current) }), [name]: value }));
    setTouchedDefaults(true);
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function openDetail(item: ApiRecord) {
    const request = ++detailRequest.current;
    const id = getRecordId(item);
    setDetailItem(item);
    if (!id || !detailPath) return;
    setDetailLoading(true);
    try {
      const detail = await apiGet<ApiRecord>(detailPath(id));
      if (request === detailRequest.current) setDetailItem({ ...item, ...detail });
    } catch (exception) {
      if (request === detailRequest.current) setError(friendlyApiError(exception, "Kayıt detayı yüklenemedi."));
    } finally {
      if (request === detailRequest.current) setDetailLoading(false);
    }
  }

  function sortBy(column: ResourceColumn) {
    if (column.sortable === false) return;
    if (sortKey === column.key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(column.key);
    setSortDirection("asc");
  }

  function validate(values: ApiRecord): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const field of activeFields) {
      const value = values[field.name];
      const empty = value === undefined || value === null || (typeof value === "string" && value.trim() === "");
      if (field.required && empty) {
        errors[field.name] = `${field.label} zorunlu.`;
        continue;
      }
      if (!empty && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())) {
        errors[field.name] = "Geçerli bir e-posta adresi girin.";
        continue;
      }
      if (!empty && field.validate) {
        const message = field.validate(value, values);
        if (message) errors[field.name] = message;
      }
    }
    return errors;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!createPath || mutationPending.current || formDisabled) return;
    const values = effectiveForm;
    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const first = activeFields.find((field) => errors[field.name]);
      if (first) document.getElementById(`${formId}-field-${first.name}`)?.focus();
      return;
    }

    let payload: ApiRecord = Object.fromEntries(
      activeFields.map((field) => {
        const raw = values[field.name];
        return [field.name, field.normalize ? field.normalize(raw) : raw];
      }),
    );
    if (transformPayload) payload = transformPayload(payload, editing ? selected ?? form : undefined);

    mutationPending.current = true;
    setSaving(true);
    setError(null);
    try {
      if (editing && selectedId && updatePath) {
        await apiPatch(updatePath(selectedId), sanitizePayload(payload));
        toast.success(labels.updated ?? "Değişiklikler kaydedildi.");
      } else {
        await apiPost(createPath, sanitizePayload(payload));
        toast.success(labels.created ?? "Kayıt oluşturuldu.");
      }
      closeForm();
      await load();
    } catch (exception) {
      setError(friendlyApiError(exception, "Kayıt kaydedilemedi."));
    } finally {
      setSaving(false);
      mutationPending.current = false;
    }
  }

  async function confirmDelete() {
    const id = deleteTarget ? getRecordId(deleteTarget) : null;
    if (!id || !deletePath || mutationPending.current) return;
    mutationPending.current = true;
    try {
      await apiDelete(deletePath(id));
      setDeleteTarget(null);
      if (selectedId === id) closeForm();
      toast.success(labels.deleted ?? "Kayıt silindi.");
      await load();
    } catch (exception) {
      setDeleteTarget(null);
      toast.error(friendlyApiError(exception, "Kayıt silinemedi."));
    } finally {
      mutationPending.current = false;
    }
  }

  const rowContext = (item: ApiRecord): RowActionContext => ({ reload: load, edit: () => startEdit(item) });

  const renderCell = (item: ApiRecord, column: ResourceColumn): ReactNode => {
    if (column.render) return column.render(item);
    if (column.format === "badge") {
      const raw = item[column.key];
      return raw === undefined || raw === null || raw === "" ? "-" : <StatusBadge value={raw} />;
    }
    return columnText(item, column);
  };

  const fieldGroups = groupFields(activeFields);
  const mobileColumns = columns.slice(1).filter((column) => !column.hideOnMobile);

  return (
    <div className="min-w-0 space-y-5">
      {!hideHeader && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {toolbar}
            <Button type="button" variant="outline" onClick={() => void load()} disabled={loading}>
              <RefreshCw className={cn(loading && "animate-spin")} />
              Yenile
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          <span>{error}</span>
          <button type="button" aria-label="Hatayı kapat" onClick={() => setError(null)}>
            <X className="size-4" />
          </button>
        </div>
      )}

      {showForm && (
        <form
          ref={formRef}
          onSubmit={submit}
          noValidate
          aria-labelledby={`${formId}-title`}
          className="scroll-mt-20 rounded-xl border border-slate-200/90 bg-card p-4 shadow-sm sm:p-5 dark:border-slate-800"
        >
          <div className="mb-4 flex items-start justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <h2 id={`${formId}-title`} className="text-base font-semibold tracking-tight">
                {editing ? labels.updateTitle ?? "Kaydı düzenle" : labels.createTitle ?? createLabel}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Yıldızlı (*) alanlar zorunlu.</p>
            </div>
            {(items.length > 0 || editing) && (
              <Button type="button" variant="ghost" size="sm" onClick={closeForm}>
                <X />
                Vazgeç
              </Button>
            )}
          </div>
          {formNotice && <div className="mb-4">{formNotice}</div>}
          <div className="space-y-5">
            {fieldGroups.map((group, groupIndex) => (
              <fieldset key={`${group.name ?? "fields"}-${groupIndex}`} className="min-w-0">
                {group.name && <legend className="mb-2 text-sm font-semibold text-foreground">{group.name}</legend>}
                <div className={cn("grid gap-3 sm:gap-4", group.name ? "grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-3")}>
                  {group.fields.map((field) => (
                    <FieldInput
                      key={field.name}
                      field={field}
                      // Namespaced: a field called "title" must not collide with the heading id.
                      id={`${formId}-field-${field.name}`}
                      value={effectiveForm[field.name]}
                      form={effectiveForm}
                      editing={editing}
                      error={fieldErrors[field.name]}
                      onChange={(value) => setFieldValue(field.name, value)}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="submit" disabled={saving || formDisabled || (editing && !updatePath)} className="sm:min-w-40">
              {saving ? <Loader2 className="size-4 animate-spin" /> : editing ? <Save className="size-4" /> : <Plus className="size-4" />}
              {editing ? labels.submitUpdate ?? "Değişiklikleri kaydet" : labels.submitCreate ?? createLabel}
            </Button>
          </div>
        </form>
      )}

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:max-w-xl">
            <div className="relative w-full sm:max-w-sm">
              <Search aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-9 pl-8"
                type="search"
                value={searchTerm}
                aria-label={labels.searchPlaceholder ?? "Kayıtlarda ara"}
                placeholder={labels.searchPlaceholder ?? "Ara…"}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            {canCreate && !showForm && (
              <Button type="button" onClick={openCreate} className="h-9 shrink-0">
                <Plus />
                {createLabel}
              </Button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(filterOptions).map(([key, values]) => (
              <select
                key={key}
                aria-label={`${columnLabel(columns, key)} filtresi`}
                className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                value={filters[key] ?? ""}
                onChange={(event) => {
                  setFilters((current) => ({ ...current, [key]: event.target.value }));
                  setPage(1);
                }}
              >
                <option value="">{columnLabel(columns, key)}: tümü</option>
                {values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ))}
            {hideHeader && (
              <>
                {toolbar}
                <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => void load()} disabled={loading} aria-label="Listeyi yenile">
                  <RefreshCw className={cn(loading && "animate-spin")} />
                  <span className="sr-only sm:not-sr-only">Yenile</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Phones: one card per record instead of a sideways-scrolling table. */}
        <ul className="divide-y md:hidden" aria-label={title}>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="space-y-2 p-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-2/3" />
              </li>
            ))
          ) : pageItems.length === 0 ? (
            <li className="p-6">
              <EmptyState text={emptyText} filtered={items.length > 0} />
            </li>
          ) : (
            pageItems.map((item, index) => (
              <li key={String(item.id ?? index)} className="p-4">
                <button type="button" className="flex w-full items-start justify-between gap-3 text-left" onClick={() => void openDetail(item)}>
                  <span className="min-w-0 font-semibold">{columns[0] ? renderCell(item, columns[0]) : "-"}</span>
                  <ChevronRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                </button>
                <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
                  {mobileColumns.map((column) => (
                    <div key={column.key} className="contents">
                      <dt className="text-muted-foreground">{column.label}</dt>
                      <dd className="min-w-0 truncate text-right">{renderCell(item, column)}</dd>
                    </div>
                  ))}
                </dl>
                <RowButtons
                  item={item}
                  className="mt-3 justify-end"
                  canEdit={Boolean(updatePath) && canCreate}
                  canDelete={Boolean(deletePath)}
                  onEdit={() => startEdit(item)}
                  onDelete={() => setDeleteTarget(item)}
                  extra={rowActions?.(item, rowContext(item))}
                />
              </li>
            ))
          )}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <caption className="sr-only">{title}</caption>
            <thead className="bg-muted/50 text-left">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={sortKey === column.key ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                    className={cn("px-4 py-2.5 font-semibold", column.align === "right" && "text-right")}
                  >
                    <button
                      type="button"
                      className={cn("inline-flex max-w-full items-center gap-1 rounded focus-visible:outline-2 focus-visible:outline-ring", column.align === "right" && "flex-row-reverse")}
                      onClick={() => sortBy(column)}
                    >
                      <span className="truncate">{column.label}</span>
                      {sortKey === column.key && (sortDirection === "asc" ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />)}
                    </button>
                  </th>
                ))}
                <th scope="col" className="px-4 py-2.5 text-right font-semibold">
                  <span className="sr-only">İşlemler</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="border-t">
                    {columns.map((column) => (
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
                  <td className="px-4 py-10" colSpan={columns.length + 1}>
                    <EmptyState text={emptyText} filtered={items.length > 0} />
                  </td>
                </tr>
              ) : (
                pageItems.map((item, index) => (
                  <tr key={String(item.id ?? index)} className="cursor-pointer border-t transition-colors hover:bg-muted/40" onClick={() => void openDetail(item)}>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn("max-w-64 truncate px-4 py-3", column.align === "right" && "text-right tabular-nums", column.format === "money" && "tabular-nums")}
                        title={columnText(item, column)}
                      >
                        {renderCell(item, column)}
                      </td>
                    ))}
                    <td className="px-4 py-2">
                      <RowButtons
                        item={item}
                        className="justify-end"
                        withDetail
                        onDetail={() => void openDetail(item)}
                        canEdit={Boolean(updatePath) && canCreate}
                        canDelete={Boolean(deletePath)}
                        onEdit={() => startEdit(item)}
                        onDelete={() => setDeleteTarget(item)}
                        extra={rowActions?.(item, rowContext(item))}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t p-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <span>
            {filteredItems.length === items.length ? `${items.length} kayıt` : `${items.length} kayıttan ${filteredItems.length} tanesi eşleşiyor`}
          </span>
          <div className="flex items-center gap-2">
            <select
              className="h-8 rounded-lg border border-input bg-background px-2 text-sm outline-none"
              aria-label="Sayfa başına kayıt"
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size} / sayfa
                </option>
              ))}
            </select>
            {totalPages > 1 && (
              <>
                <Button type="button" variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                  Önceki
                </Button>
                <span className="min-w-14 text-center tabular-nums">
                  {currentPage} / {totalPages}
                </span>
                <Button type="button" variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
                  Sonraki
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {totalRecords !== null && totalRecords > items.length && (
        <div role="status" className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          <p>
            {totalRecords} kaydın {items.length} tanesi yüklendi. Arama ve filtreler yüklenen kayıtlarda çalışır.
          </p>
          <Button variant="outline" disabled={loadingMore || loading} onClick={() => void loadMore()}>
            {loadingMore ? "Yükleniyor…" : "Diğer kayıtları yükle"}
          </Button>
        </div>
      )}

      <Sheet
        open={Boolean(detailItem)}
        onOpenChange={(open) => {
          if (!open) {
            detailRequest.current++;
            setDetailItem(null);
            setDetailLoading(false);
          }
        }}
      >
        <SheetContent className="w-[92vw] overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{detailItem && columns[0] ? columnText(detailItem, columns[0]) : labels.detailTitle ?? "Kayıt detayı"}</SheetTitle>
            <SheetDescription>{labels.detailTitle ?? title}</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4 pb-6">
            {detailItem && renderDetail ? (
              renderDetail(detailItem, detailLoading)
            ) : detailLoading ? (
              Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-10 w-full" />)
            ) : detailItem ? (
              <dl className="divide-y rounded-lg border">
                {detailEntries(detailItem, columns, fields).map((entry) => (
                  <div key={entry.key} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 px-3 py-2.5 text-sm">
                    <dt className="text-muted-foreground">{entry.label}</dt>
                    <dd className="min-w-0 break-words">{entry.column ? renderCell(detailItem, entry.column) : entry.text}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {detailItem && (Boolean(updatePath) && canCreate || rowActions) && (
              <div className="flex flex-wrap justify-end gap-2 pt-2">
                {rowActions?.(detailItem, { reload: load, edit: () => { const item = detailItem; setDetailItem(null); startEdit(item); } })}
                {updatePath && canCreate && (
                  <Button type="button" variant="outline" onClick={() => { const item = detailItem; setDetailItem(null); startEdit(item); }}>
                    <Pencil />
                    Düzenle
                  </Button>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={labels.deleteTitle ?? "Kayıt silinsin mi?"}
        description={
          <>
            <span className="font-medium text-foreground">{deleteTarget && columns[0] ? columnText(deleteTarget, columns[0]) : ""}</span>{" "}
            {labels.deleteDescription ?? "listeden kaldırılacak."}
          </>
        }
        confirmLabel="Sil"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function FieldInput({
  field,
  id,
  value,
  form,
  editing,
  error,
  onChange,
}: {
  field: ResourceField;
  id: string;
  value: unknown;
  form: ApiRecord;
  editing: boolean;
  error?: string;
  onChange: (value: unknown) => void;
}) {
  const describedBy = [error ? `${id}-error` : null, field.help ? `${id}-help` : null].filter(Boolean).join(" ") || undefined;
  const inputClass = cn(
    "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/25",
    error ? "border-red-500" : "border-input",
  );

  let control: ReactNode;
  if (field.render) {
    control = field.render({ value, setValue: onChange, form, editing, id });
  } else if (field.type === "textarea") {
    control = (
      <textarea
        id={id}
        className={cn(inputClass, "min-h-20 py-2")}
        placeholder={field.placeholder}
        value={String(value ?? "")}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  } else if (field.type === "select") {
    control = (
      <select
        id={id}
        className={inputClass}
        value={String(value ?? "")}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Seçin</option>
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {field.optionLabels?.[option] ?? option}
          </option>
        ))}
      </select>
    );
  } else {
    control = (
      <Input
        id={id}
        type={field.type ?? "text"}
        inputMode={field.inputMode}
        min={field.min}
        max={field.max}
        step={field.step}
        autoComplete={field.autoComplete}
        placeholder={field.placeholder}
        value={value === undefined || value === null ? "" : String(value)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        className={cn("h-10", error && "border-red-500")}
        onChange={(event) => {
          const next = field.type === "number" && event.target.value !== "" ? Number(event.target.value) : event.target.value;
          onChange(next);
        }}
      />
    );
  }

  return (
    <div className={cn("min-w-0 space-y-1.5", field.wide && "col-span-full")}>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
        {field.label}
        {field.required && <span aria-hidden="true"> *</span>}
      </label>
      {control}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : field.help ? (
        <p id={`${id}-help`} className="text-xs text-muted-foreground">
          {field.help}
        </p>
      ) : null}
    </div>
  );
}

function RowButtons({
  item,
  className,
  withDetail,
  onDetail,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  extra,
}: {
  item: ApiRecord;
  className?: string;
  withDetail?: boolean;
  onDetail?: () => void;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  extra?: ReactNode;
}) {
  const name = String(item.name ?? item.title ?? item.username ?? item.receiptNumber ?? "");
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)} onClick={(event) => event.stopPropagation()}>
      {extra}
      {withDetail && onDetail && (
        <ActionButton label={`Detay ${name}`.trim()} title="Detay" onClick={(event) => stop(event, onDetail)}>
          <Eye />
        </ActionButton>
      )}
      {canEdit && (
        <ActionButton label={`Düzenle ${name}`.trim()} title="Düzenle" onClick={(event) => stop(event, onEdit)}>
          <Pencil />
        </ActionButton>
      )}
      {canDelete && (
        <ActionButton label={`Sil ${name}`.trim()} title="Sil" destructive onClick={(event) => stop(event, onDelete)}>
          <Trash2 />
        </ActionButton>
      )}
    </div>
  );
}

function ActionButton({
  children,
  destructive,
  label,
  title,
  onClick,
}: {
  children: ReactNode;
  destructive?: boolean;
  label: string;
  title: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={title}
      onClick={onClick}
      className={cn(destructive && "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950")}
    >
      {children}
    </Button>
  );
}

function EmptyState({ text, filtered }: { text: string; filtered: boolean }) {
  return (
    <div className="mx-auto max-w-sm space-y-1 text-center">
      <p className="font-medium text-foreground">{filtered ? "Aramanızla eşleşen kayıt yok." : text}</p>
      {filtered && <p className="text-sm text-muted-foreground">Aramayı veya filtreleri temizleyip tekrar deneyin.</p>}
    </div>
  );
}

function stop(event: MouseEvent<HTMLButtonElement>, callback: () => void) {
  event.preventDefault();
  event.stopPropagation();
  callback();
}

function getRecordId(item: ApiRecord): string | null {
  return item.id === undefined || item.id === null ? null : String(item.id);
}

function compareItems(
  left: ApiRecord,
  right: ApiRecord,
  key: string,
  column: ResourceColumn | undefined,
  text: (item: ApiRecord, column: ResourceColumn) => string,
  direction: SortDirection,
) {
  const multiplier = direction === "asc" ? 1 : -1;
  // Raw values sort numbers and ISO dates correctly; formatted text would not ("10 Kas" < "9 Ara").
  const rawLeft = column?.value ? column.value(left) : left[key];
  const rawRight = column?.value ? column.value(right) : right[key];
  if (typeof rawLeft === "number" && typeof rawRight === "number") return (rawLeft - rawRight) * multiplier;
  if (typeof rawLeft === "string" && typeof rawRight === "string") {
    return rawLeft.localeCompare(rawRight, "tr", { numeric: true, sensitivity: "base" }) * multiplier;
  }
  const a = column ? text(left, column) : String(rawLeft ?? "");
  const b = column ? text(right, column) : String(rawRight ?? "");
  return a.localeCompare(b, "tr", { numeric: true, sensitivity: "base" }) * multiplier;
}

function columnLabel(columns: ResourceColumn[], key: string) {
  return columns.find((column) => column.key === key)?.label ?? key;
}

function groupFields(fields: ResourceField[]): { name?: string; fields: ResourceField[] }[] {
  const groups: { name?: string; fields: ResourceField[] }[] = [];
  for (const field of fields) {
    const last = groups[groups.length - 1];
    if (last && last.name === field.group) last.fields.push(field);
    else groups.push({ name: field.group, fields: [field] });
  }
  return groups;
}

/** Labeled, formatted rows for the detail panel: table columns first, then other form fields. */
function detailEntries(item: ApiRecord, columns: ResourceColumn[], fields: ResourceField[]) {
  const entries: { key: string; label: string; column?: ResourceColumn; text?: string }[] = [];
  const seen = new Set<string>();
  for (const column of columns.slice(1)) {
    entries.push({ key: column.key, label: column.label, column });
    seen.add(column.key);
  }
  for (const field of fields) {
    if (seen.has(field.name) || field.type === "password" || field.render || !(field.name in item)) continue;
    const raw = item[field.name];
    const text = field.type === "select" && typeof raw === "string" ? field.optionLabels?.[raw] ?? fieldValue(item, [field.name]) : fieldValue(item, [field.name]);
    entries.push({ key: field.name, label: field.label, text });
    seen.add(field.name);
  }
  return entries;
}

function stripEmpty(record: ApiRecord): ApiRecord {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined && value !== ""));
}

function sanitizePayload(payload: ApiRecord): ApiRecord {
  return Object.fromEntries(Object.entries(payload).filter(([key, value]) => key !== "id" && value !== undefined));
}

function withDefaultSize(path: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return path.includes("size=") ? path : `${path}${separator}size=200`;
}
