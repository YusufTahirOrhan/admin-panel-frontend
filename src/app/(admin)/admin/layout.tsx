import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DotPatternBackground } from "@/components/ui/dot-pattern-background";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* ── Sidebar ── */}
      <AdminSidebar />

      {/* ── Main Content Area ── */}
      <SidebarInset>
        <DotPatternBackground className="flex min-h-screen flex-col">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </DotPatternBackground>
      </SidebarInset>
    </SidebarProvider>
  );
}
