/** Pure POS math and lookup, kept apart from the screen so it can be tested. */

export type DiscountMode = "PERCENT" | "FIXED";

export interface PosLine {
  unitPrice: number;
  quantity: number;
}

export interface PosTotals {
  subtotal: number;
  discount: number;
  /** What the customer pays. Shelf prices include KDV, as in Turkish retail. */
  total: number;
  /** KDV contained in the total. */
  tax: number;
  /** Total without KDV. */
  net: number;
}

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function computeTotals(lines: PosLine[], discountMode: DiscountMode, discountValue: number, taxRate: number): PosTotals {
  const subtotal = round2(lines.reduce((sum, line) => sum + Math.max(0, line.unitPrice) * Math.max(0, line.quantity), 0));
  const rawDiscount = discountMode === "PERCENT" ? (subtotal * Math.min(100, Math.max(0, discountValue))) / 100 : Math.max(0, discountValue);
  const discount = round2(Math.min(subtotal, rawDiscount));
  const total = round2(subtotal - discount);
  const rate = Math.max(0, taxRate);
  const tax = round2((total * rate) / (100 + rate));
  return { subtotal, discount, total, tax, net: round2(total - tax) };
}

export interface PosProduct {
  id: string;
  sku: string;
  name: string;
  category?: string;
}

function fold(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıöşü]/g, (char) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" })[char] ?? char);
}

export function filterProducts<T extends PosProduct>(products: T[], query: string): T[] {
  const needle = fold(query.trim());
  if (!needle) return products;
  return products.filter((product) => [product.name, product.sku, product.category ?? ""].some((value) => fold(value).includes(needle)));
}

/**
 * What Enter in the search box adds to the cart: an exact SKU/barcode match (what a scanner
 * types), otherwise the only product left after filtering. Null when ambiguous.
 */
export function productForEnter<T extends PosProduct>(products: T[], query: string): T | null {
  const code = query.trim().toLocaleUpperCase("tr-TR");
  if (!code) return null;
  const exact = products.find((product) => product.sku.toLocaleUpperCase("tr-TR") === code);
  if (exact) return exact;
  const matches = filterProducts(products, query);
  return matches.length === 1 ? matches[0] : null;
}

/** "1.234,50" / "1234.50" / "1234,5" -> 1234.5; NaN for junk. */
export function parseAmount(text: string): number {
  const cleaned = text.trim().replace(/\s/g, "");
  if (!cleaned) return Number.NaN;
  const normalized = cleaned.includes(",") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned;
  return Number(normalized);
}
