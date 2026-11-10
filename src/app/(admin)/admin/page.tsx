"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, PackageOpen, ShieldAlert, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { ApiRecord, apiGet, isApiRecord, normalizeList } from "@/lib/management-api";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ShinyText } from "@/components/ui/shiny-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { SetupChecklist } from "@/components/admin/setup-checklist";
import { auditActionLabel, auditActorName, auditDetail } from "@/lib/audit-events";
import { formatDateTime, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

interface RevenueSummary {
  totalRevenue: number;
  transactionCount: number;
  avgTransactionValue: number;
}

interface DashboardState {
  daily: RevenueSummary | null;
  monthly: RevenueSummary | null;
  customerCount: number | null;
  lowStock: ApiRecord[];
  riskEvents: ApiRecord[];
  usernames: Record<string, string>;
  failed: boolean;
}

async function loadDashboard(): Promise<DashboardState> {
  const today = getTodayRange();
  const month = getMonthRange();
  const [daily, monthly, customers, lowStock, risk, users] = await Promise.allSettled([
    apiGet<RevenueSummary>(revenuePath(today.start, today.end)),
    apiGet<RevenueSummary>(revenuePath(month.start, month.end)),
    apiGet<unknown>("/api/v1/sales/customers?size=1"),
    apiGet<unknown>("/api/v1/admin/analytics/low-stock"),
    apiGet<{ events?: ApiRecord[] }>("/api/v1/admin/analytics/high-risk-events?limit=6"),
    apiGet<unknown>("/api/v1/admin/users"),
  ]);
  const value = <T,>(result: PromiseSettledResult<T>) => (result.status === "fulfilled" ? result.value : null);
  const customerPage = value(customers);
  return {
    daily: value(daily),
    monthly: value(monthly),
    // The page's total, not the length of one page.
    customerCount: isApiRecord(customerPage) && typeof customerPage.totalElements === "number" ? customerPage.totalElements : customerPage ? normalizeList(customerPage).length : null,
    lowStock: normalizeList(value(lowStock)),
    riskEvents: Array.isArray(value(risk)?.events) ? (value(risk)?.events ?? []) : [],
    usernames: Object.fromEntries(normalizeList(value(users)).map((user) => [String(user.id), String(user.username ?? "")])),
    failed: [daily, monthly, customers, lowStock, risk].some((result) => result.status === "rejected"),
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardState | null>(null);

  useEffect(() => {
    let active = true;
    loadDashboard().then((next) => {
      if (active) setData(next);
    });
    return () => {
      active = false;
    };
  }, []);

  const loading = data === null;
  const lowStock = data?.lowStock ?? [];

  const kpiCards = [
    {
      id: "daily-sales",
      label: "Bugünkü satış",
      value: formatMoney(data?.daily?.totalRevenue ?? 0),
      sub: `${data?.daily?.transactionCount ?? 0} satış`,
      icon: ShoppingCart,
      spotlight: "rgba(16, 185, 129, 0.15)",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      id: "monthly-revenue",
      label: "Bu ayki ciro",
      value: formatMoney(data?.monthly?.totalRevenue ?? 0),
      sub: `${data?.monthly?.transactionCount ?? 0} satış, ortalama ${formatMoney(data?.monthly?.avgTransactionValue ?? 0)}`,
      icon: TrendingUp,
      spotlight: "rgba(245, 158, 11, 0.15)",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
    },
    {
      id: "customers",
      label: "Müşteri",
      count: data?.customerCount ?? 0,
      sub: "kayıtlı müşteri",
      icon: Users,
      spotlight: "rgba(14, 165, 233, 0.15)",
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-600",
    },
    {
      id: "low-stock",
      label: "Az kalan ürün",
      count: lowStock.length,
      sub: lowStock.length > 0 ? "uyarı eşiğinde veya altında" : "stoklar yeterli",
      icon: AlertTriangle,
      spotlight: "rgba(239, 68, 68, 0.15)",
      iconBg: lowStock.length > 0 ? "bg-red-500/10" : "bg-muted",
      iconColor: lowStock.length > 0 ? "text-red-600" : "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <ShinyText text="Gösterge Paneli" speed={6} />
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Bugünün satışları, azalan stoklar ve dikkat isteyen işlemler.</p>
        </div>
        <Link href="/sales" className={cn(buttonVariants(), "h-10 self-start px-4 sm:self-auto")}>
          <ShoppingCart />
          Kasayı aç
        </Link>
      </div>

      <SetupChecklist />

      {data?.failed && (
        <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          Bazı veriler yüklenemedi; gösterilen rakamlar eksik olabilir. Sayfayı yenileyin.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <SpotlightCard key={card.id} id={`kpi-${card.id}`} spotlightColor={card.spotlight} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  {loading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : card.count !== undefined ? (
                    <div className="truncate text-2xl font-bold tracking-tight text-foreground tabular-nums">
                      <NumberTicker value={card.count} />
                    </div>
                  ) : (
                    <p className="truncate text-2xl font-bold tracking-tight text-foreground tabular-nums">{card.value}</p>
                  )}
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
              <div className="mt-3 min-h-4">{loading ? <Skeleton className="h-4 w-24" /> : <p className="text-xs font-medium text-muted-foreground">{card.sub}</p>}</div>
            </SpotlightCard>
          );
        })}
      </div>

      <AnalyticsCharts />

      <div className="grid gap-4 lg:grid-cols-7">
        <SpotlightCard className="p-5 lg:col-span-4 sm:p-6" spotlightColor="rgba(239, 68, 68, 0.06)">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <PackageOpen aria-hidden="true" className="size-4 text-red-500" />
              Az kalan ürünler
            </h2>
            <Link href="/admin/inventory" className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400">
              Envantere git
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-11 w-full" />
              ))}
            </div>
          ) : lowStock.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">Uyarı eşiğine inen ürün yok.</p>
          ) : (
            <ul className="divide-y">
              {lowStock.slice(0, 6).map((item) => {
                const quantity = Number(item.quantity ?? 0);
                return (
                  <li key={String(item.id)} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{String(item.name ?? item.sku ?? "Ürün")}</p>
                      <p className="truncate text-xs text-muted-foreground">{String(item.sku ?? "")}</p>
                    </div>
                    <p className="shrink-0 text-right text-sm tabular-nums">
                      <span className={cn("font-semibold", quantity <= 0 ? "text-red-600 dark:text-red-400" : "text-amber-700 dark:text-amber-400")}>{quantity <= 0 ? "Tükendi" : `${quantity} adet`}</span>
                      <span className="block text-xs text-muted-foreground">eşik {Number(item.minQuantity ?? 0)}</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
          {lowStock.length > 6 && <p className="mt-2 text-xs text-muted-foreground">ve {lowStock.length - 6} ürün daha</p>}
        </SpotlightCard>

        <SpotlightCard className="p-5 lg:col-span-3 sm:p-6" spotlightColor="rgba(239, 68, 68, 0.08)">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <ShieldAlert aria-hidden="true" className="size-4 text-red-500" />
              Dikkat isteyen işlemler
            </h2>
            <Link href="/admin/audits" className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400">
              Tüm kayıtlar
            </Link>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">İptal, iade, silme, rol değişikliği, stok sayımı ve engellenen girişler.</p>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : (data?.riskEvents.length ?? 0) === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">Son zamanlarda dikkat isteyen bir işlem yok.</p>
          ) : (
            <ul className="space-y-2">
              {data?.riskEvents.map((event, index) => {
                const detail = auditDetail(event);
                const actor = auditActorName(event, data.usernames);
                return (
                  <li key={String(event.id ?? index)} className="rounded-lg border border-border/40 bg-muted/40 p-3">
                    <p className="text-sm font-medium text-foreground">
                      {auditActionLabel(event)}
                      {detail && <span className="font-normal text-muted-foreground">: {detail}</span>}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {actor ? `${actor}, ` : ""}
                      {formatDateTime(event.occurredAt)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </SpotlightCard>
      </div>
    </div>
  );
}

function revenuePath(startDate: Date, endDate: Date) {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
  return `/api/v1/admin/analytics/revenue?${params.toString()}`;
}

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}
