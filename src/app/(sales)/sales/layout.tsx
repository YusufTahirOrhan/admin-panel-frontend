import { SalesHeader } from "@/components/sales/sales-header";
import { PanelGuard } from "@/components/auth/panel-guard";

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PanelGuard area="sales">
      <div className="flex min-h-screen flex-col bg-background">
        <SalesHeader />
        <main className="min-w-0 flex-1 p-3 md:p-4 lg:p-6">{children}</main>
      </div>
    </PanelGuard>
  );
}
