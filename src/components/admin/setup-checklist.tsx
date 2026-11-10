"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiGet, friendlyApiError, isApiRecord, normalizeList } from "@/lib/management-api";
import { addMissingPresetTypes, toTransactionType, type TransactionType } from "@/lib/transaction-types";
import { toast } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "optimaxx-setup-dismissed";
const REQUIRED_CATEGORIES = ["SALE", "REPAIR", "PRESCRIPTION"] as const;

interface SetupData {
  types: TransactionType[];
  products: number;
  pricedProducts: number;
  users: number;
  sitePublished: boolean;
}

interface Step {
  id: string;
  title: string;
  detail: string;
  done: boolean;
  optional?: boolean;
  action: ReactNode;
}

function readDismissed() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

async function loadSetup(): Promise<SetupData> {
  const [types, items, users, site] = await Promise.allSettled([
    apiGet<unknown>("/api/v1/admin/transaction-types"),
    apiGet<unknown>("/api/v1/admin/inventory/items"),
    apiGet<unknown>("/api/v1/admin/users"),
    apiGet<unknown>("/api/v1/public/pages/home"),
  ]);
  const itemList = items.status === "fulfilled" ? normalizeList(items.value) : [];
  // Until something is published the API answers with built-in default blocks that have no id.
  const blocks = site.status === "fulfilled" && isApiRecord(site.value) && Array.isArray(site.value.blocks) ? site.value.blocks : [];
  return {
    types: types.status === "fulfilled" ? normalizeList(types.value).map(toTransactionType).filter((type): type is TransactionType => type !== null) : [],
    products: itemList.length,
    pricedProducts: itemList.filter((item) => Number(item.salePrice ?? 0) > 0).length,
    users: users.status === "fulfilled" ? normalizeList(users.value).length : 0,
    sitePublished: blocks.some((block) => isApiRecord(block) && Boolean(block.id)),
  };
}

/** First-run guide for a new store. Disappears once the essentials are done, or when closed. */
export function SetupChecklist() {
  const [data, setData] = useState<SetupData | null>(null);
  const [dismissed, setDismissed] = useState(readDismissed);
  const [adding, setAdding] = useState(false);

  const reload = useCallback(() => loadSetup().then(setData), []);

  useEffect(() => {
    let active = true;
    loadSetup()
      .then((next) => {
        if (active) setData(next);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  if (dismissed || !data) return null;

  const activeCategories = new Set(data.types.filter((type) => type.active).map((type) => type.category));
  const missingTypes = REQUIRED_CATEGORIES.filter((category) => !activeCategories.has(category));

  async function addTypes() {
    if (!data) return;
    setAdding(true);
    try {
      await addMissingPresetTypes(data.types);
      toast.success("İşlem türleri eklendi. Kasa, tamir ve reçete ekranları kullanıma hazır.");
      await reload();
    } catch (error) {
      toast.error(friendlyApiError(error, "İşlem türleri eklenemedi."));
    } finally {
      setAdding(false);
    }
  }

  const steps: Step[] = [
    {
      id: "types",
      title: "İşlem türlerini ekleyin",
      detail:
        missingTypes.length === 0
          ? "Satış, tamir ve reçete kayıtları açılabiliyor."
          : "Kasa, tamir ve reçete ekranları kayıt açmak için bunlara ihtiyaç duyar.",
      done: missingTypes.length === 0,
      action: (
        <Button type="button" size="sm" onClick={() => void addTypes()} disabled={adding}>
          {adding && <Loader2 className="animate-spin" />}
          Önerilenleri ekle
        </Button>
      ),
    },
    {
      id: "products",
      title: "Ürünleri fiyatlarıyla girin",
      detail:
        data.products === 0
          ? "Kasada okutulacak çerçeve, cam ve lensleri ekleyin."
          : `${data.products} ürün var, ${data.pricedProducts} tanesinin fiyatı girilmiş.`,
      done: data.pricedProducts > 0,
      action: <StepLink href="/admin/inventory">Ürün ekle</StepLink>,
    },
    {
      id: "staff",
      title: "Personel hesabı açın",
      detail: "Her çalışan kendi hesabıyla girsin; satışlar kişi bazında izlenir.",
      done: data.users > 1,
      optional: true,
      action: <StepLink href="/admin/users">Personel ekle</StepLink>,
    },
    {
      id: "site",
      title: "Web sitenizi yayınlayın",
      detail: "Mağaza bilgileri, çalışma saatleri ve iletişim sayfası müşterilere görünsün.",
      done: data.sitePublished,
      action: <StepLink href="/admin/site-editor">Siteyi düzenle</StepLink>,
    },
  ];

  const required = steps.filter((step) => !step.optional);
  if (required.every((step) => step.done)) return null;
  const doneCount = steps.filter((step) => step.done).length;

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Private mode: it simply comes back next visit.
    }
  }

  return (
    <section aria-labelledby="setup-title" className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/40 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="setup-title" className="font-semibold text-foreground">
            Mağazanızı kullanıma hazırlayın
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {doneCount}/{steps.length} adım tamam. Kalanlar birkaç dakika sürer.
          </p>
        </div>
        <button type="button" onClick={dismiss} aria-label="Kurulum listesini kapat" className="-m-1 rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900/60" aria-hidden="true">
        <div className="h-full rounded-full bg-emerald-600 transition-[width] duration-500" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
      </div>
      <ol className="mt-4 grid gap-2 md:grid-cols-2">
        {steps.map((step) => (
          <li key={step.id} className={cn("flex items-start gap-3 rounded-lg border bg-background p-3", step.done && "opacity-70")}>
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                step.done ? "border-emerald-600 bg-emerald-600 text-white" : "border-muted-foreground/40",
              )}
            >
              {step.done && <Check className="size-3.5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {step.title}
                {step.optional && <span className="ml-1.5 text-xs font-normal text-muted-foreground">isteğe bağlı</span>}
                <span className="sr-only">{step.done ? " (tamamlandı)" : " (yapılacak)"}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>
              {!step.done && <div className="mt-2">{step.action}</div>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function StepLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-7 items-center rounded-md border border-input bg-background px-2.5 text-[0.8rem] font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-emerald-600">
      {children}
    </Link>
  );
}
