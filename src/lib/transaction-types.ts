import { apiPost, type ApiRecord } from "@/lib/management-api";
import { codeFromName } from "@/lib/format";

export type TransactionCategory = "SALE" | "REPAIR" | "PRESCRIPTION" | "SERVICE";

export interface TransactionType {
  id: string;
  code: string;
  name: string;
  category: TransactionCategory;
  active: boolean;
  sortOrder?: number;
  metadataJson?: string | null;
}

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  SALE: "Satış",
  REPAIR: "Tamir",
  PRESCRIPTION: "Reçete",
  SERVICE: "Hizmet",
};

export const CATEGORY_HELP: Record<TransactionCategory, string> = {
  SALE: "Kasada ürün satışı (POS).",
  REPAIR: "Gözlük tamiri ve servis kayıtları.",
  PRESCRIPTION: "Göz reçetesi kayıtları.",
  SERVICE: "Ürün dışı hizmetler.",
};

/**
 * The API requires a metadata object with one key per category. Store staff never need to
 * see it, so the panel fills it in.
 */
export const DEFAULT_METADATA: Record<TransactionCategory, Record<string, unknown>> = {
  SALE: { receiptTemplate: "default" },
  REPAIR: { workflow: "standard" },
  PRESCRIPTION: { validationRules: {} },
  SERVICE: { serviceLevel: "standard" },
};

/** One type per workflow is enough to start working. */
export const PRESET_TYPES: { name: string; category: TransactionCategory; sortOrder: number }[] = [
  { name: "Perakende Satış", category: "SALE", sortOrder: 1 },
  { name: "Gözlük Tamiri", category: "REPAIR", sortOrder: 2 },
  { name: "Reçeteli Gözlük", category: "PRESCRIPTION", sortOrder: 3 },
];

export function isCategory(value: unknown): value is TransactionCategory {
  return value === "SALE" || value === "REPAIR" || value === "PRESCRIPTION" || value === "SERVICE";
}

export function toTransactionType(record: ApiRecord): TransactionType | null {
  if (!record.id) return null;
  return {
    id: String(record.id),
    code: String(record.code ?? ""),
    name: String(record.name ?? record.code ?? ""),
    category: isCategory(record.category) ? record.category : "SALE",
    active: record.active !== false,
    sortOrder: typeof record.sortOrder === "number" ? record.sortOrder : undefined,
    metadataJson: typeof record.metadataJson === "string" ? record.metadataJson : null,
  };
}

/** Metadata that satisfies the API for `category`, keeping anything already set. */
export function metadataFor(category: TransactionCategory, existing?: string | null): string {
  let current: Record<string, unknown> = {};
  if (existing) {
    try {
      const parsed: unknown = JSON.parse(existing);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) current = parsed as Record<string, unknown>;
    } catch {
      current = {};
    }
  }
  return JSON.stringify({ ...DEFAULT_METADATA[category], ...current });
}

/** Payload for create/update from the settings form (code and metadata filled in automatically). */
export function transactionTypePayload(form: ApiRecord, original?: ApiRecord): ApiRecord {
  const name = String(form.name ?? "").trim();
  const category = isCategory(form.category) ? form.category : isCategory(original?.category) ? original.category : "SALE";
  const payload: ApiRecord = {
    name,
    category,
    sortOrder: form.sortOrder === "" || form.sortOrder === undefined ? undefined : Number(form.sortOrder),
    metadataJson: metadataFor(category, typeof original?.metadataJson === "string" ? original.metadataJson : null),
  };
  if (!original) {
    const typed = String(form.code ?? "").trim();
    payload.code = typed ? codeFromName(typed) : codeFromName(name);
    payload.active = true;
  }
  return payload;
}

/** Creates the preset types whose category is still missing. Returns how many were added. */
export async function addMissingPresetTypes(existing: TransactionType[]): Promise<number> {
  const present = new Set(existing.map((type) => type.category));
  let added = 0;
  for (const preset of PRESET_TYPES) {
    if (present.has(preset.category)) continue;
    const base = codeFromName(preset.name);
    // A soft-deleted type can still hold the code; try a few suffixes.
    for (const code of [base, `${base}_2`, `${base}_3`]) {
      try {
        await apiPost("/api/v1/admin/transaction-types", {
          code,
          name: preset.name,
          category: preset.category,
          sortOrder: preset.sortOrder,
          active: true,
          metadataJson: metadataFor(preset.category),
        });
        added++;
        break;
      } catch (error) {
        if (code === `${base}_3`) throw error;
      }
    }
  }
  return added;
}
