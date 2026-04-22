export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-slate-50 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-wider">OptiMaxx Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {/* Admin sidebar links will go here */}
          <div className="text-sm text-slate-400 px-2 py-2">Navigasyon yükleniyor...</div>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="font-medium text-gray-800">Yönetim Paneli</div>
          <a href="/login" className="text-sm font-medium text-red-600 hover:text-red-800">Çıkış Yap</a>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
