export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b">
          <div className="font-semibold text-xl text-blue-900 tracking-tight">OptiMaxx POS</div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Satış Personeli</span>
            <a href="/login" className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">Çıkış Yap</a>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
