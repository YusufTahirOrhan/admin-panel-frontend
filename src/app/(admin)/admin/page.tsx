"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ShieldAlert,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiRecord, apiGet, friendlyApiError, normalizeList } from "@/lib/management-api";

interface RevenueSummary {
  totalRevenue: number;
  transactionCount: number;
  avgTransactionValue: number;
}

interface DashboardState {
  dailyRevenue: RevenueSummary | null;
  monthlyRevenue: RevenueSummary | null;
  customers: ApiRecord[];
  lowStock: ApiRecord[];
  highRiskEvents: ApiRecord[];
}

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2,
});

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardState>({
    dailyRevenue: null,
    monthlyRevenue: null,
    customers: [],
    lowStock: [],
    highRiskEvents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError(null);
      try {
        const today = getTodayRange();
        const month = getMonthRange();
        const [dailyRevenue, monthlyRevenue, customers, lowStock, highRisk] = await Promise.all([
          apiGet<RevenueSummary>(revenuePath(today.start, today.end)),
          apiGet<RevenueSummary>(revenuePath(month.start, month.end)),
          apiGet<unknown>("/api/v1/sales/customers?size=200"),
          apiGet<unknown>("/api/v1/admin/analytics/low-stock"),
          apiGet<{ events?: ApiRecord[] }>("/api/v1/admin/analytics/high-risk-events?limit=5"),
        ]);

        if (!active) {
          return;
        }

        setData({
          dailyRevenue,
          monthlyRevenue,
          customers: normalizeList(customers),
          lowStock: normalizeList(lowStock),
          highRiskEvents: Array.isArray(highRisk.events) ? highRisk.events : [],
        });
      } catch (exception) {
        if (active) {
          setError(friendlyApiError(exception, "Dashboard verileri alınamadı."));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const kpiCards = useMemo(
    () => [
      {
        id: "daily-sales",
        label: "Günlük Satış",
        value: currencyFormatter.format(data.dailyRevenue?.totalRevenue ?? 0),
        change: `${data.dailyRevenue?.transactionCount ?? 0} işlem`,
        trend: "up" as const,
        icon: ShoppingCart,
        accent: "bg-emerald-500",
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-600",
      },
      {
        id: "monthly-revenue",
        label: "Aylık Gelir",
        value: currencyFormatter.format(data.monthlyRevenue?.totalRevenue ?? 0),
        change: `Ort. ${currencyFormatter.format(data.monthlyRevenue?.avgTransactionValue ?? 0)}`,
        trend: "up" as const,
        icon: TrendingUp,
        accent: "bg-amber-500",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-600",
      },
      {
        id: "active-customers",
        label: "Müşteri Kaydı",
        value: String(data.customers.length),
        change: "satış API",
        trend: "up" as const,
        icon: Users,
        accent: "bg-sky-500",
        iconBg: "bg-sky-500/10",
        iconColor: "text-sky-600",
      },
      {
        id: "low-stock",
        label: "Düşük Stok Uyarısı",
        value: String(data.lowStock.length),
        change: "kritik stok",
        trend: data.lowStock.length > 0 ? ("down" as const) : ("up" as const),
        icon: AlertTriangle,
        accent: "bg-red-500",
        iconBg: "bg-red-500/10",
        iconColor: "text-red-600",
      },
    ],
    [data],
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Gösterge Paneli</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mağaza performansınıza gerçek API verileriyle genel bakış.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={card.id}
              id={`kpi-${card.id}`}
              className="relative overflow-hidden rounded-lg border bg-card p-5 shadow-sm"
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${card.accent}`} />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  {loading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    <p className="truncate text-2xl font-bold tracking-tight text-foreground">{card.value}</p>
                  )}
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendIcon className={card.trend === "up" ? "h-3.5 w-3.5 text-emerald-500" : "h-3.5 w-3.5 text-red-500"} />
                {loading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span className="text-xs font-semibold text-muted-foreground">{card.change}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="rounded-lg border bg-card p-6 shadow-sm lg:col-span-4">
          <h2 className="mb-4 text-base font-semibold text-foreground">Gelir Özeti</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryTile label="Bugünkü işlem" value={String(data.dailyRevenue?.transactionCount ?? 0)} loading={loading} />
            <SummaryTile
              label="Aylık işlem"
              value={String(data.monthlyRevenue?.transactionCount ?? 0)}
              loading={loading}
            />
            <SummaryTile
              label="Ortalama sepet"
              value={currencyFormatter.format(data.monthlyRevenue?.avgTransactionValue ?? 0)}
              loading={loading}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm lg:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <ShieldAlert className="size-4 text-red-500" />
            <h2 className="text-base font-semibold text-foreground">Riskli Aktiviteler</h2>
          </div>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-10 w-full" />)
            ) : data.highRiskEvents.length === 0 ? (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                Riskli denetim olayı bulunmuyor.
              </p>
            ) : (
              data.highRiskEvents.map((activity, index) => (
                <div key={String(activity.id ?? index)} className="rounded-lg bg-muted/40 p-3">
                  <p className="truncate text-sm font-medium text-foreground">
                    {String(activity.eventType ?? "Olay")}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {String(activity.resourceType ?? "Kaynak")} · {String(activity.occurredAt ?? "")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ label, value, loading }: { label: string; value: string; loading: boolean }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {loading ? <Skeleton className="mt-2 h-7 w-24" /> : <p className="mt-2 text-xl font-semibold">{value}</p>}
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
