"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Info, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "security";
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Sistem Durumu",
    message: "Tüm servisler (PostgreSQL, Heroku API) sorunsuz çalışıyor.",
    time: "Şimdi",
    type: "info",
    read: false,
  },
  {
    id: "2",
    title: "Güvenlik Bildirimi",
    message: "Yönetici girişi başarıyla gerçekleştirildi.",
    time: "5 dakika önce",
    type: "security",
    read: false,
  },
  {
    id: "3",
    title: "Stok Kontrolü",
    message: "Kritik stok seviyesindeki ürünleri Analiz ekranından inceleyebilirsiniz.",
    time: "1 saat önce",
    type: "warning",
    read: false,
  },
];

interface NotificationBellProps {
  count?: number;
  className?: string;
}

/**
 * Interactive Notification Bell component with live popover center.
 */
export function NotificationBell({
  count = 3,
  className,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        id="notification-bell"
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn("relative cursor-pointer hover:bg-slate-800/80", className)}
        aria-label={`Bildirimler${unreadCount > 0 ? ` (${unreadCount} okunmamış)` : ""}`}
      >
        <Bell className="h-4 w-4 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-slate-700/80 bg-slate-900/95 p-3 text-slate-100 shadow-2xl backdrop-blur-md z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">Bildirimler</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-semibold text-teal-400">
                  {unreadCount} yeni
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Check className="h-3 w-3" />
                Tümünü Oku
              </button>
            )}
          </div>

          <div className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                Henüz bildiriminiz yok.
              </p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-2.5 transition-colors cursor-pointer border",
                    item.read
                      ? "bg-slate-900/50 border-slate-800/60 opacity-70"
                      : "bg-slate-800/80 border-slate-700/80 hover:bg-slate-800"
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.type === "info" && <Info className="h-4 w-4 text-sky-400" />}
                    {item.type === "warning" && <AlertTriangle className="h-4 w-4 text-amber-400" />}
                    {item.type === "security" && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-white truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">{item.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
