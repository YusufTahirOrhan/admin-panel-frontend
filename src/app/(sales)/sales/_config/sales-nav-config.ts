import { FileText, ShoppingCart, Users, Wrench } from "lucide-react";
import type { NavItem } from "@/lib/types/navigation";

export const salesNavConfig: NavItem[] = [
  {
    id: "new-sale",
    label: "Yeni Satış",
    href: "/sales",
    icon: ShoppingCart,
    roles: ["OWNER", "ADMIN", "STAFF"],
  },
  {
    id: "repairs",
    label: "Tamirler",
    href: "/sales/repairs",
    icon: Wrench,
    roles: ["OWNER", "ADMIN", "STAFF"],
  },
  {
    id: "prescriptions",
    label: "Reçeteler",
    href: "/sales/prescriptions",
    icon: FileText,
    roles: ["OWNER", "ADMIN", "STAFF"],
  },
  {
    id: "customers",
    label: "Müşteriler",
    href: "/sales/customers",
    icon: Users,
    roles: ["OWNER", "ADMIN", "STAFF"],
  },
];
