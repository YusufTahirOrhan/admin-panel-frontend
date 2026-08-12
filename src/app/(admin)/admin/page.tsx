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
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ShinyText } from "@/components/ui/shiny-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { DecryptedText } from "@/components/ui/decrypted-text";

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
        numericValue: data.dailyRevenue?.totalRevenue ?? 0,
        formattedValue: currencyFormatter.format(data.dailyRevenue?.totalRevenue ?? 0),
        change: `${data.dailyRevenue?.transactionCount ?? 0} işlem`,
        trend: "up" as const,
        icon: ShoppingCart,
        accent: "bg-emerald-500",
        spotlight: "rgba(16, 185, 129, 0.15)",
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-600",
      },
      {
        id: "monthly-revenue",
        label: "Aylık Gelir",
        numericValue: data.monthlyRevenue?.totalRevenue ?? 0,
        formattedValue: currencyFormatter.format(data.monthlyRevenue?.totalRevenue ?? 0),
        change: `Ort. ${currencyFormatter.format(data.monthlyRevenue?.avgTransactionValue ?? 0)}`,
        trend: "up" as const,
        icon: TrendingUp,
        accent: "bg-amber-500",
        spotlight: "rgba(245, 158, 11, 0.15)",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-600",
      },
      {
        id: "active-customers",
        label: "Müşteri Kaydı",
        numericValue: data.customers.length,
        formattedValue: String(data.customers.length),
        change: "aktif müşteri",
        trend: "up" as const,
        icon: Users,
        accent: "bg-sky-500",
        spotlight: "rgba(14, 165, 233, 0.15)",
        iconBg: "bg-sky-500/10",
        iconColor: "text-sky-600",
      },
      {
        id: "low-stock",
        label: "Düşük Stok Uyarısı",
        numericValue: data.lowStock.length,
        formattedValue: String(data.lowStock.length),
        change: "kritik ürün",
        trend: data.lowStock.length > 0 ? ("down" as const) : ("up" as const),
        icon: AlertTriangle,
        accent: "bg-red-500",
        spotlight: "rgba(239, 68, 68, 0.15)",
        iconBg: "bg-red-500/10",
        iconColor: "text-red-600",
      },
    ],
    [data],
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShinyText text="Gösterge Paneli" speed={6} />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <DecryptedText
            text="OptiMaxx Mağaza performansınıza canlı istatistiklerle genel bakış."
            animateOn="hover"
            speed={40}
            className="text-emerald-600 dark:text-emerald-400 font-medium"
          />
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* KPI Cards Grid with Spotlight */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <SpotlightCard
              key={card.id}
              id={`kpi-${card.id}`}
              spotlightColor={card.spotlight}
              className="p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  {loading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : card.id === "active-customers" || card.id === "low-stock" ? (
                    <div className="truncate text-2xl font-bold tracking-tight text-foreground">
                      <NumberTicker value={card.numericValue} />
                    </div>
                  ) : (
                    <p className="truncate text-2xl font-bold tracking-tight text-foreground">
                      {card.formattedValue}
                    </p>
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
            </SpotlightCard>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <SpotlightCard className="lg:col-span-4 p-6" spotlightColor="rgba(16, 185, 129, 0.08)">
          <h2 className="mb-4 text-base font-semibold text-foreground">Gelir Özeti</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryTile
              label="Bugünkü İşlem"
              numericValue={data.dailyRevenue?.transactionCount ?? 0}
              loading={loading}
            />
            <SummaryTile
              label="Aylık İşlem"
              numericValue={data.monthlyRevenue?.transactionCount ?? 0}
              loading={loading}
            />
            <SummaryTile
              label="Ortalama Sepet"
              value={currencyFormatter.format(data.monthlyRevenue?.avgTransactionValue ?? 0)}
              loading={loading}
            />
          </div>
        </SpotlightCard>

        <SpotlightCard className="lg:col-span-3 p-6" spotlightColor="rgba(239, 68, 68, 0.08)">
          <div className="mb-4 flex items-center gap-2">
            <ShieldAlert className="size-4 text-red-500" />
            <h2 className="text-base font-semibold text-foreground">Riskli Aktiviteler</h2>
          </div>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-10 w-full" />)
            ) : data.highRiskEvents.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                Riskli denetim olayı bulunmuyor.
              </p>
            ) : (
              data.highRiskEvents.map((activity, index) => (
                <div key={String(activity.id ?? index)} className="rounded-lg bg-muted/40 p-3 border border-border/40">
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
        </SpotlightCard>
      </div>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  numericValue,
  loading,
}: {
  label: string;
  value?: string;
  numericValue?: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-24" />
      ) : numericValue !== undefined ? (
        <p className="mt-2 text-xl font-bold tracking-tight">
          <NumberTicker value={numericValue} />
        </p>
      ) : (
        <p className="mt-2 text-xl font-bold tracking-tight">{value}</p>
      )}
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
