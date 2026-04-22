export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen relative items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-zinc-900/5 backdrop-blur-sm z-0"></div>
      <div className="z-10 w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            OptiMaxx
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Yönetim paneline erişmek için giriş yapın
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
