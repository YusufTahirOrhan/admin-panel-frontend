import GsapSmoothScrollProvider from "@/components/public/gsap-provider";
import PublicHeader from "@/components/public/public-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GsapSmoothScrollProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <PublicHeader />
        <main className="flex-1">{children}</main>
      </div>
    </GsapSmoothScrollProvider>
  );
}
