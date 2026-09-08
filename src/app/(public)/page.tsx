import StorefrontMotion from "@/components/public/storefront-motion";
import Link from "next/link";
import PublicHeader from "@/components/public/public-header";
import { getPublicNavigation } from "@/lib/public-content";
import { getPublishedHome } from "@/lib/published-home";
import { asBrandItems, renderBlock } from "@/components/public/public-blocks";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "OptiMaxx Optik",
  description: "OptiMaxx optik mağazası, ürünleri ve hizmetleri.",
};

export default async function PublicHomePage() {
  const { blocks, unavailable } = await getPublishedHome();
  const contentBlocks = blocks.filter((block) => block.type !== 'appearance');
  const navigation = getPublicNavigation(blocks).filter((item) => item.href !== '#brands' || blocks.some((block) => block.type === 'brandShowcase' && (asBrandItems(block.content.eyewearItems).length || asBrandItems(block.content.lensItems).length)));
  return <>
    <PublicHeader items={navigation} />
    <main id="main-content" tabIndex={-1} className="flex-1">
      {contentBlocks.length ? contentBlocks.map((block) => <StorefrontMotion key={`${block.type}-${block.order}`}>{renderBlock(block, new Set(navigation.map((item) => item.href)))}</StorefrontMotion>) : <section className="public-container py-24">
        <p className="text-sm font-semibold text-teal-700">OptiMaxx Optik</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{unavailable ? 'İçeriğe şu anda ulaşılamıyor' : 'Mağaza bilgileri yakında burada'}</h1>
        <p className="mt-4 max-w-xl leading-7 text-slate-600">{unavailable ? 'Geçici bir bağlantı sorunu oluştu. Lütfen kısa bir süre sonra yeniden deneyin.' : 'Yayınlanan mağaza bilgilerini bu sayfadan takip edebilirsiniz.'}</p>
        {unavailable && <form action="/" method="get"><button type="submit" className="mt-7 inline-flex min-h-12 items-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white">Yeniden dene</button></form>}
      </section>}
    </main>
    <footer className="border-t border-white/15 bg-slate-950 py-8 text-slate-300"><div className="public-container flex flex-col justify-between gap-4 text-sm sm:flex-row sm:items-center"><Link href="/" className="text-lg font-semibold text-white">OptiMaxx</Link><p>© {new Date().getFullYear()} OptiMaxx. Tüm hakları saklıdır.</p></div></footer>
  </>;
}
