/**
 * Lens prescription rules used by the form (values stay strings, as the API stores them).
 * SPH/CYL: diopters in 0.25 steps, AX: 0-180 degrees, PD: total (e.g. 62) or per eye (31/31).
 */

const DIOPTER = /^[+-]?\d{1,2}([.,]\d{1,2})?$/;
const PD = /^\d{2}([.,]\d)?(\s*\/\s*\d{2}([.,]\d)?)?$/;

export function normalizeDiopter(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim().replace(",", ".");
  if (!text) return null;
  const number = Number(text);
  if (!Number.isFinite(number)) return text;
  if (number === 0) return "0.00";
  return `${number > 0 ? "+" : "-"}${Math.abs(number).toFixed(2)}`;
}

export function normalizeAxis(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  if (!text) return null;
  const number = Number(text);
  return Number.isInteger(number) ? String(number) : text;
}

export function normalizePd(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim().replace(/,/g, ".").replace(/\s*\/\s*/, "/");
  return text || null;
}

export function validateDiopter(value: unknown): string | null {
  const text = String(value ?? "").trim();
  if (!DIOPTER.test(text)) return "Örn. -1.25 veya +0.50 yazın.";
  const number = Number(text.replace(",", "."));
  if (Math.abs(number) > 30) return "-30 ile +30 arasında olmalı.";
  if (Math.round(number * 100) % 25 !== 0) return "0.25'in katı olmalı (örn. -1.25).";
  return null;
}

export function validateAxis(value: unknown): string | null {
  const number = Number(String(value ?? "").trim());
  return Number.isInteger(number) && number >= 0 && number <= 180 ? null : "0 ile 180 arasında tam sayı yazın.";
}

export function validatePd(value: unknown): string | null {
  return PD.test(String(value ?? "").trim()) ? null : "Örn. 62 veya 31/31 yazın.";
}

/** A cylinder without an axis is not a usable prescription. */
export function axisRequired(cylinder: unknown, axis: unknown): string | null {
  const hasCylinder = cylinder !== undefined && cylinder !== null && String(cylinder).trim() !== "" && Number(String(cylinder).replace(",", ".")) !== 0;
  const hasAxis = axis !== undefined && axis !== null && String(axis).trim() !== "";
  return hasCylinder && !hasAxis ? "Silindir girildiyse aks da girilmeli." : null;
}

/** Compact optician notation: "-1.25 -0.50 × 90". */
export function eyeFormula(sphere: unknown, cylinder: unknown, axis: unknown): string {
  const parts: string[] = [];
  if (sphere !== null && sphere !== undefined && String(sphere).trim()) parts.push(String(sphere));
  if (cylinder !== null && cylinder !== undefined && String(cylinder).trim()) {
    parts.push(String(cylinder));
    if (axis !== null && axis !== undefined && String(axis).trim()) parts.push(`× ${String(axis)}`);
  }
  return parts.length ? parts.join(" ") : "—";
}
