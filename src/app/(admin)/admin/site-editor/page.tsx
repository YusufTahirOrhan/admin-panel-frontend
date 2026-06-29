import { SiteEditor } from "@/components/management/site-editor";

export const metadata = { title: "Site Düzenleme - OptiMaxx Admin" };

export default function SiteEditorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Site Düzenleme</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Optik ana sayfasındaki blokları düzenleyin, önizleyin ve yayınlayın.
        </p>
      </div>
      <SiteEditor />
    </div>
  );
}
