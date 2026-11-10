import { cn } from "@/lib/utils";
import { translateEnum } from "@/lib/management-api";

type Tone = "neutral" | "info" | "warning" | "success" | "danger" | "accent" | "violet";

const tones: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
  info: "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:ring-sky-900",
  warning: "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-900",
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-900",
  danger: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-200 dark:ring-red-900",
  accent: "bg-teal-50 text-teal-800 ring-teal-200 dark:bg-teal-950 dark:text-teal-200 dark:ring-teal-900",
  violet: "bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-950 dark:text-violet-200 dark:ring-violet-900",
};

/** What each workflow state means for the person at the counter. */
const toneByValue: Record<string, Tone> = {
  // Repairs: waiting -> being worked on -> customer must come -> done
  RECEIVED: "neutral",
  IN_PROGRESS: "info",
  READY_FOR_PICKUP: "warning",
  DELIVERED: "success",
  // Sales
  COMPLETED: "success",
  REFUNDED: "violet",
  CANCELED: "danger",
  CANCELLED: "danger",
  // Roles
  OWNER: "accent",
  ADMIN: "info",
  STAFF: "neutral",
  // Transaction type categories
  SALE: "success",
  REPAIR: "info",
  PRESCRIPTION: "accent",
  SERVICE: "neutral",
};

export function StatusBadge({ value, label, className }: { value: unknown; label?: string; className?: string }) {
  let tone: Tone = "neutral";
  if (typeof value === "boolean") tone = value ? "success" : "neutral";
  else if (typeof value === "string") tone = toneByValue[value] ?? "neutral";
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", tones[tone], className)}>
      {label ?? translateEnum(value)}
    </span>
  );
}
