"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/lib/auth-service";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const subscribeToHydration = () => () => {};

export function UserMenu({ compact = false, side = 'top' }: { compact?: boolean; side?: 'top' | 'bottom' }) {
  const router = useRouter();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const storedUser = useAuthStore((state) => state.user);
  const getDisplayName = useAuthStore((state) => state.getDisplayName);
  const user = hydrated ? storedUser : null;
  const displayName = hydrated ? getDisplayName() : 'Hesap';
  const logout = useAuthStore((state) => state.logout);
  const [leaving, setLeaving] = useState(false);
  const pending = useRef(false);
  const canManage = user?.role === 'OWNER' || user?.role === 'ADMIN';
  const roles: Record<string, string> = { OWNER: 'Mağaza sahibi', ADMIN: 'Yönetici', STAFF: 'Personel' };
  async function handleLogout() {
    if (pending.current) return;
    pending.current = true;
    setLeaving(true);
    try { await authService.logout(); } finally {
      logout();
      try { localStorage.removeItem('refreshToken'); localStorage.removeItem('optimaxx-auth-storage'); } catch { /* Storage may be unavailable. */ }
      window.location.href = '/login';
    }
  }
  return <DropdownMenu>
    <DropdownMenuTrigger disabled={leaving} aria-label="Hesap menüsü" className={`flex min-h-11 w-full min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-teal-500 ${compact ? 'text-foreground hover:bg-muted' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
      <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-lg bg-teal-700 text-xs font-semibold text-white">{displayName.split(' ').map((name) => name[0]).slice(0, 2).join('').toLocaleUpperCase('tr')}</span>
      <span className={`min-w-0 flex-1 ${compact ? 'hidden sm:block' : ''}`}><span className="block truncate font-medium">{displayName}</span><span className="block truncate text-xs opacity-70">{roles[user?.role ?? 'STAFF']}</span></span>
      <ChevronsUpDown aria-hidden="true" className="size-4 shrink-0 opacity-60" />
    </DropdownMenuTrigger>
    <DropdownMenuContent side={side} align={compact ? 'end' : 'start'} className="w-64 max-w-[calc(100vw-2rem)]">
      <div className="border-b px-3 py-3"><p className="truncate text-sm font-semibold">{displayName}</p><p className="mt-1 break-all text-xs text-muted-foreground">{user?.email}</p></div>
      {canManage && <><DropdownMenuItem className="min-h-11 px-3" onClick={() => router.push('/admin/users')}><User />Kullanıcı yönetimi</DropdownMenuItem><DropdownMenuItem className="min-h-11 px-3" onClick={() => router.push('/admin/site-editor')}><Settings />Site editörü</DropdownMenuItem></>}
      <DropdownMenuItem className="min-h-11 px-3" disabled={leaving} variant="destructive" onClick={() => void handleLogout()}><LogOut />{leaving ? 'Çıkış yapılıyor…' : 'Çıkış yap'}</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}
