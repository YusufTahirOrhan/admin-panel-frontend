import {
  BarChart3,
  FilePenLine,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  UserCog,
  Users,
} from "lucide-react";
import type { NavGroup } from "@/lib/types/navigation";

export const adminNavConfig: NavGroup[] = [
  {
    title: "Ana Menü",
    items: [
      {
        id: "dashboard",
        label: "Gösterge Paneli",
        href: "/admin",
        icon: LayoutDashboard,
        roles: ["OWNER", "ADMIN"],
      },
      {
        id: "transactions",
        label: "Satışlar",
        href: "/admin/transactions",
        icon: ShoppingCart,
        roles: ["OWNER", "ADMIN"],
      },
      {
        id: "inventory",
        label: "Envanter",
        href: "/admin/inventory",
        icon: Package,
        roles: ["OWNER", "ADMIN"],
      },
      {
        id: "customers",
        label: "Müşteriler",
        href: "/admin/customers",
        icon: Users,
        roles: ["OWNER", "ADMIN"],
      },
    ],
  },
  {
    title: "Yönetim",
    items: [
      {
        id: "users",
        label: "Personel Yönetimi",
        href: "/admin/users",
        icon: UserCog,
        roles: ["OWNER"],
      },
      {
        id: "analytics",
        label: "Analitik",
        href: "/admin/analytics",
        icon: BarChart3,
        roles: ["OWNER", "ADMIN"],
      },
      {
        id: "audits",
        label: "Denetim Kaydı",
        href: "/admin/audits",
        icon: ShieldCheck,
        roles: ["OWNER", "ADMIN"],
      },
      {
        id: "settings",
        label: "Ayarlar",
        href: "/admin/settings",
        icon: Settings,
        roles: ["OWNER", "ADMIN"],
      },
      {
        id: "site-editor",
        label: "Site Düzenleme",
        href: "/admin/site-editor",
        icon: FilePenLine,
        roles: ["OWNER", "ADMIN"],
      },
    ],
  },
];
