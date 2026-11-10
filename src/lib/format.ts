/** Display formatting shared by tables, cards and the POS (Turkish locale). */

const moneyFormatter = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });
const dateTimeFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" });

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/;

export function isIsoDateTime(value: unknown): value is string {
  return typeof value === "string" && ISO_DATE_TIME.test(value);
}

/** Numbers as people type them here: "1499,90", "1.499,90" or "1499.90". */
export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const text = String(value).trim().replace(/\s/g, "");
  if (!text) return null;
  const number = Number(text.includes(",") ? text.replace(/\./g, "").replace(",", ".") : text);
  return Number.isFinite(number) ? number : null;
}

export function formatMoney(value: unknown): string {
  const number = toNumber(value);
  return number === null ? "-" : moneyFormatter.format(number);
}

export function formatDateTime(value: unknown): string {
  if (!isIsoDateTime(value)) return value === null || value === undefined || value === "" ? "-" : String(value);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateTimeFormatter.format(date);
}

export function formatDate(value: unknown): string {
  if (!isIsoDateTime(value)) return value === null || value === undefined || value === "" ? "-" : String(value);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

/** "05321112233" -> "0532 111 22 33", "+905321112233" -> "+90 532 111 22 33"; anything else as typed. */
export function formatPhone(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value).trim();
  const digits = text.replace(/\D/g, "");
  if (/^0[1-9]\d{9}$/.test(digits)) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  if (/^90[1-9]\d{9}$/.test(digits)) return `+90 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  return text;
}

/** "Ayşe Yılmaz" -> { firstName: "Ayşe", lastName: "Yılmaz" }; the last word is the surname. */
export function splitFullName(fullName: string): { firstName: string; lastName: string } | null {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return null;
  const lastName = parts.pop() as string;
  return { firstName: parts.join(" "), lastName };
}

/** "Perakende Satış" -> "PERAKENDE_SATIS" (codes must be unique, ASCII, upper case). */
export function codeFromName(name: string): string {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u" };
  return name
    .trim()
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (char) => map[char] ?? char)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}
