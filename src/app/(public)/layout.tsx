export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">OptiMaxx</h1>
        <nav>
          {/* Navigation items will be added here */}
          <a href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">Giriş Yap</a>
        </nav>
      </header>
      <main className="flex-1 bg-gray-50/50">{children}</main>
      <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} OptiMaxx. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
