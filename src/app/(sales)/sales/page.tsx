import { Search, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";

export const metadata = {
  title: "Yeni Satış - OptiMaxx POS",
};

export default function SalesDashboardPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-5 h-[calc(100vh-5rem)]">
      {/* ══ Left: Product Search / Catalog ════════════════════════════ */}
      <div className="lg:col-span-3 flex flex-col rounded-xl border bg-card shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Ürün adı, barkod veya SKU ile arayın...
            </p>
          </div>
        </div>

        {/* Product Grid Placeholder */}
        <div className="flex-1 p-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              {
                name: "Ray-Ban Aviator Classic",
                sku: "RB-3025",
                price: "₺3.250,00",
                stock: 12,
              },
              {
                name: "Oakley Holbrook",
                sku: "OK-9102",
                price: "₺2.890,00",
                stock: 8,
              },
              {
                name: "İnce Çerçeve - Titanyum",
                sku: "OPT-TT01",
                price: "₺1.650,00",
                stock: 23,
              },
              {
                name: "Progresif Cam Paketi",
                sku: "LENS-PRG-01",
                price: "₺980,00",
                stock: 45,
              },
              {
                name: "Güneş Gözlüğü - Polarize",
                sku: "SUN-POL-05",
                price: "₺2.100,00",
                stock: 5,
              },
              {
                name: "Kontakt Lens (Aylık)",
                sku: "CL-M30",
                price: "₺420,00",
                stock: 60,
              },
            ].map((product) => (
              <div
                key={product.sku}
                className="group relative flex flex-col rounded-lg border bg-background p-3 transition-all duration-200 hover:shadow-md hover:border-[var(--brand-teal-500)]/30 cursor-pointer"
              >
                {/* Stock Badge */}
                <span
                  className={`absolute top-2 right-2 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    product.stock < 10
                      ? "bg-red-500/10 text-red-500"
                      : "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  {product.stock} adet
                </span>

                <p className="text-sm font-medium text-foreground pr-14 line-clamp-1">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {product.sku}
                </p>
                <p className="text-base font-bold text-foreground mt-2">
                  {product.price}
                </p>

                {/* Quick add indicator */}
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--brand-teal-500)]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1.5 rounded-full bg-[var(--brand-teal-500)] px-3 py-1 text-xs font-semibold text-white shadow-lg">
                    <Plus className="h-3 w-3" />
                    Sepete Ekle
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Right: Cart / Order Summary ═══════════════════════════════ */}
      <div className="lg:col-span-2 flex flex-col rounded-xl border bg-card shadow-sm overflow-hidden">
        {/* Cart Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[var(--brand-teal-500)]" />
            <h2 className="text-sm font-semibold text-foreground">
              Sepet
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">3 ürün</span>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-3 space-y-2">
          {[
            {
              name: "Ray-Ban Aviator Classic",
              price: "₺3.250,00",
              qty: 1,
            },
            {
              name: "Progresif Cam Paketi",
              price: "₺980,00",
              qty: 2,
            },
            {
              name: "Kontakt Lens (Aylık)",
              price: "₺420,00",
              qty: 1,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border bg-background p-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.price}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5">
                <button className="flex h-6 w-6 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-sm font-medium tabular-nums">
                  {item.qty}
                </span>
                <button className="flex h-6 w-6 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted">
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <button className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Cart Footer / Totals */}
        <div className="border-t p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ara Toplam</span>
            <span className="font-medium">₺5.630,00</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">KDV (%20)</span>
            <span className="font-medium">₺1.126,00</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Toplam</span>
            <span className="text-lg font-bold text-[var(--brand-teal-500)]">
              ₺6.756,00
            </span>
          </div>

          {/* CTA Button */}
          <button
            id="complete-sale-btn"
            className="w-full rounded-lg bg-gradient-to-r from-[var(--brand-teal-500)] to-[var(--brand-teal-600)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--brand-teal-500)]/20 transition-all duration-200 hover:shadow-xl hover:shadow-[var(--brand-teal-500)]/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Satışı Tamamla
          </button>
        </div>
      </div>
    </div>
  );
}
