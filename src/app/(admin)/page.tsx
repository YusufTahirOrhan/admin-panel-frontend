export const metadata = {
  title: 'Dashboard - OptiMaxx Admin',
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Yönetim Özeti</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder cards */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 bg-white">
          <h3 className="font-semibold text-sm text-gray-500 mb-2">Toplam Satış</h3>
          <p className="text-2xl font-bold">₺0,00</p>
        </div>
      </div>
    </div>
  );
}
