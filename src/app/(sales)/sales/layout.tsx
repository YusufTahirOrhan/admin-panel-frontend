import { SalesHeader } from "@/components/sales/sales-header";

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SalesHeader />
      <main className="flex-1 p-3 md:p-4 lg:p-6">{children}</main>
    </div>
  );
}
