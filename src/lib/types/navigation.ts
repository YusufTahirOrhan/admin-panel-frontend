import type { LucideIcon } from "lucide-react";

/**
 * Represents a single navigation item in a sidebar or tab bar.
 */
export interface NavItem {
  /** Unique key identifier for the item */
  id: string;
  /** Turkish label displayed in the UI */
  label: string;
  /** Route path to navigate to */
  href: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Optional badge text (e.g., count) */
  badge?: string;
  /** Roles allowed to see this item */
  roles: Array<"OWNER" | "ADMIN" | "STAFF">;
  /** Nested child items for sub-menus */
  children?: NavItem[];
}

/**
 * A labeled group of navigation items.
 */
export interface NavGroup {
  /** Turkish group title */
  title: string;
  /** Items within this group */
  items: NavItem[];
}
