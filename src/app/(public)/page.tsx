export const metadata = {
  title: 'OptiMaxx Management System',
  description: 'Manage your store operations seamlessly.',
};

export default function PublicHomePage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-gray-900 mb-6">
        Geleceğin Mağaza Yönetimi
      </h2>
      <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8 leading-relaxed">
        OptiMaxx ile ürünlerinizi, satışlarınızı ve siparişlerinizi tek bir noktadan modern ve hızlı bir arayüzle yönetin.
      </p>
      <a 
        href="/login" 
        className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-all hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
      >
        Yönetim Paneline Giriş Yap
      </a>
    </div>
  );
}
