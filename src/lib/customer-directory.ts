import { create } from "zustand";
import { apiGet, normalizeList } from "@/lib/management-api";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

interface DirectoryState {
  customers: Customer[];
  loaded: boolean;
  loading: boolean;
  loadedAt: number;
  /** Fetches the list unless it was fetched in the last few seconds. */
  load: (force?: boolean) => Promise<void>;
  /** Marks the list stale after a customer was created or edited elsewhere. */
  invalidate: () => void;
  add: (customer: Customer) => void;
}

const FRESH_MS = 10_000;

function toCustomer(record: Record<string, unknown>): Customer | null {
  if (!record.id) return null;
  return {
    id: String(record.id),
    firstName: String(record.firstName ?? ""),
    lastName: String(record.lastName ?? ""),
    phone: record.phone ? String(record.phone) : undefined,
    email: record.email ? String(record.email) : undefined,
  };
}

/** One shared customer list per page, so pickers and tables do not each fetch it. */
export const useCustomerDirectory = create<DirectoryState>()((set, get) => ({
  customers: [],
  loaded: false,
  loading: false,
  loadedAt: 0,
  load: async (force = false) => {
    if (get().loading || (!force && Date.now() - get().loadedAt < FRESH_MS)) return;
    set({ loading: true });
    try {
      const data = await apiGet<unknown>("/api/v1/sales/customers?size=1000");
      const customers = normalizeList(data).map(toCustomer).filter((c): c is Customer => c !== null);
      set({ customers, loaded: true, loadedAt: Date.now() });
    } catch {
      set({ loaded: true });
    } finally {
      set({ loading: false });
    }
  },
  invalidate: () => set({ loadedAt: 0 }),
  add: (customer) => set({ customers: [customer, ...get().customers.filter((c) => c.id !== customer.id)] }),
}));

export function customerName(customer: Pick<Customer, "firstName" | "lastName"> | undefined | null): string {
  if (!customer) return "";
  return `${customer.firstName} ${customer.lastName}`.trim();
}

/** Turkish-aware, accent-insensitive: "ayse" finds "Ayşe", "05321" finds "0532 1...". */
export function foldForSearch(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıöşü]/g, (char) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" })[char] ?? char)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
}

export function matchesCustomer(customer: Customer, query: string): boolean {
  const needle = foldForSearch(query.trim());
  if (!needle) return true;
  const digits = query.replace(/\D/g, "");
  if (digits.length >= 3 && customer.phone && customer.phone.replace(/\D/g, "").includes(digits)) return true;
  return foldForSearch(`${customer.firstName} ${customer.lastName} ${customer.email ?? ""}`).includes(needle);
}
