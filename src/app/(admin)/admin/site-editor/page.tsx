"use client";

import { SiteEditor } from "@/components/management/site-editor";
import { ShinyText } from "@/components/ui/shiny-text";
import { BlurText } from "@/components/ui/blur-text";

export default function SiteEditorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          <ShinyText text="Site & Vitrin Düzenleyici" speed={6} />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <BlurText text="Optik ana sayfasındaki blokları düzenleyin, önizleyin ve yayınlayın." delay={30} animateBy="words" />
        </p>
      </div>
      <SiteEditor />
    </div>
  );
}
