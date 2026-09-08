"use client";

import { createContext, useContext, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";

export type PublicTheme = 'light' | 'dark' | 'system';
const ThemeContext = createContext<PublicTheme>('system');
const SetThemeContext = createContext<(theme: PublicTheme) => void>(() => {});
export const usePublicTheme = () => useContext(ThemeContext);

export function PublicThemeProvider({ initialTheme, children }: { initialTheme: PublicTheme; children: React.ReactNode }) {
  const [theme, setTheme] = useState(initialTheme);
  function changeTheme(value: PublicTheme) {
    setTheme(value);
    document.cookie = `optimaxx-store-theme=${value}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  }
  return <ThemeContext value={theme}><SetThemeContext value={changeTheme}>
    <div data-store-theme={theme} className="storefront-theme public-site flex min-h-screen flex-col">{children}</div>
  </SetThemeContext></ThemeContext>;
}

export function PublicThemeSelect() {
  const theme = usePublicTheme();
  const setTheme = useContext(SetThemeContext);
  const options = [{ value: 'light', label: 'Açık', icon: Sun }, { value: 'dark', label: 'Koyu', icon: Moon }, { value: 'system', label: 'Sistem', icon: Monitor }] as const;
  const selected = options.find((option) => option.value === theme)!;
  const Icon = selected.icon;
  return <DropdownMenu>
    <DropdownMenuTrigger aria-label={`Görünüm temasını değiştir (${selected.label})`} title="Görünüm teması" className="public-theme-trigger">
      <Icon aria-hidden="true" className="size-[19px]" strokeWidth={1.6} />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" sideOffset={10} data-store-theme={theme} className="storefront-theme public-theme-menu">
      <p className="public-theme-menu-label">Görünüm</p>
      <DropdownMenuRadioGroup value={theme} onValueChange={(value) => { if (value === 'light' || value === 'dark' || value === 'system') setTheme(value); }}>
        {options.map(({ value, label, icon: OptionIcon }) => <DropdownMenuRadioItem key={value} value={value} className="public-theme-option">
          <OptionIcon aria-hidden="true" className="size-[18px]" strokeWidth={1.6} />{label}
        </DropdownMenuRadioItem>)}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>;
}
