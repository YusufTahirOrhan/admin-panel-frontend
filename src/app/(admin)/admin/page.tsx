import {
  ShoppingCart,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export const metadata = {
  title: "Gösterge Paneli - OptiMaxx Admin",
};

/** KPI card data for the dashboard overview */
const kpiCards = [
  {
    id: "daily-sales",
    label: "Günlük Satış",
    value: "₺12.450,00",
    change: "+12.5%",
    trend: "up" as const,
    icon: ShoppingCart,
    color: "from-[var(--brand-teal-500)] to-[var(--brand-teal-600)]",
    iconBg: "bg-[var(--brand-teal-500)]/10",
    iconColor: "text-[var(--brand-teal-500)]",
  },
  {
    id: "monthly-revenue",
    label: "Aylık Gelir",
    value: "₺248.730,00",
    change: "+8.2%",
    trend: "up" as const,
    icon: TrendingUp,
    color: "from-[var(--brand-gold-500)] to-[var(--brand-gold-600)]",
    iconBg: "bg-[var(--brand-gold-500)]/10",
    iconColor: "text-[var(--brand-gold-500)]",
  },
  {
    id: "active-customers",
    label: "Aktif Müşteri",
    value: "1.284",
    change: "+3.1%",
    trend: "up" as const,
    icon: Users,
    color: "from-[var(--brand-navy-500)] to-[var(--brand-navy-600)]",
    iconBg: "bg-[var(--brand-navy-400)]/10",
    iconColor: "text-[var(--brand-navy-400)]",
  },
  {
    id: "low-stock",
    label: "Düşük Stok Uyarısı",
    value: "7",
    change: "-2",
    trend: "down" as const,
    icon: AlertTriangle,
    color: "from-red-500 to-red-600",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* ── Page Title ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Gösterge Paneli
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Mağaza performansınıza genel bir bakış.
        </p>
      </div>

      {/* ── KPI Cards Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const TrendIcon =
            card.trend === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={card.id}
              id={`kpi-${card.id}`}
              className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Subtle gradient accent at top */}
              <div
                className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${card.color}`}
              />

              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5">
                <TrendIcon
                  className={`h-3.5 w-3.5 ${
                    card.trend === "up"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                />
                <span
                  className={`text-xs font-semibold ${
                    card.trend === "up"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {card.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  geçen aya göre
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Placeholder Content Sections ── */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Revenue Chart Placeholder */}
        <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-4">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Gelir Grafiği
          </h3>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Grafik bileşeni yakında eklenecek.
            </p>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-3">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Son Aktivite
          </h3>
          <div className="space-y-3">
            {[
              { text: "Yeni satış: Gözlük Çerçevesi", time: "2 dk önce" },
              { text: 'Stok güncellendi: "Ray-Ban Aviator"', time: "15 dk önce" },
              { text: "Müşteri kaydı: Ahmet Y.", time: "1 saat önce" },
              { text: "Tamir tamamlandı: #TR-1042", time: "3 saat önce" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/50"
              >
                <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--brand-teal-500)]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {activity.text}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
