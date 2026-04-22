"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

/**
 * Path segment → Turkish label mapping.
 * Add new entries here as new pages are created.
 */
const segmentLabelMap: Record<string, string> = {
  admin: "Yönetim",
  sales: "Satış",
  dashboard: "Gösterge Paneli",
  inventory: "Envanter",
  customers: "Müşteriler",
  users: "Personel",
  settings: "Ayarlar",
  audits: "Denetim Kaydı",
  analytics: "Analitik",
  transactions: "Satışlar",
  repairs: "Tamirler",
  prescriptions: "Reçeteler",
};

/**
 * Auto-generates a breadcrumb from the current URL path.
 * Includes a sidebar toggle trigger for the admin layout.
 */
export function BreadcrumbNav({
  showSidebarTrigger = true,
}: {
  showSidebarTrigger?: boolean;
}) {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    // Skip dynamic segments like UUIDs
    .filter((s) => !s.match(/^[0-9a-f-]{36}$/i));

  return (
    <div className="flex items-center gap-2">
      {showSidebarTrigger && (
        <>
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </>
      )}

      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/");
            const label =
              segmentLabelMap[segment] ||
              segment.charAt(0).toUpperCase() + segment.slice(1);
            const isLast = index === segments.length - 1;

            return (
              <React.Fragment key={href}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
