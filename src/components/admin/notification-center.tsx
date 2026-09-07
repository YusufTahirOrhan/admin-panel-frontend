"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, AlertTriangle } from "lucide-react";
import { apiGet, normalizeList, friendlyApiError } from "@/lib/management-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const query = useQuery({
    queryKey: ['admin', 'low-stock'],
    queryFn: async () => normalizeList(await apiGet<unknown>('/api/v1/admin/analytics/low-stock')),
    staleTime: 60_000,
  });
  const items = query.data ?? [];
  return <>
    <button ref={trigger} type="button" onClick={() => setOpen(true)} aria-label="Stok bildirimleri" aria-haspopup="dialog" className="relative grid size-11 place-items-center rounded-lg border bg-card text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-teal-600">
      <Bell aria-hidden="true" className="size-4" />
      {!query.isError && items.length > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-700 px-1.5 text-xs font-semibold text-white">{items.length}</span>}
    </button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent finalFocus={trigger}>
        <DialogTitle>Stok bildirimleri</DialogTitle>
        <DialogDescription className="mt-2">Güncel stok seviyelerine göre dikkat gerektiren ürünler.</DialogDescription>
        <div className="mt-5">
          {query.isPending ? <p role="status" className="text-sm text-muted-foreground">Stok bilgileri yükleniyor…</p> : query.isError ? <div role="alert"><p className="text-sm text-red-700">{friendlyApiError(query.error, 'Stok bilgileri alınamadı.')}</p><Button className="mt-3" variant="outline" disabled={query.isFetching} onClick={() => void query.refetch()}>Yeniden dene</Button></div> : items.length === 0 ? <p className="text-sm text-muted-foreground">Kritik stok seviyesinde ürün bulunmuyor.</p> : <ul className="space-y-3">{items.map((item, index) => <li key={String(item.id ?? index)} className="flex gap-3 rounded-lg border p-3"><AlertTriangle aria-hidden="true" className="mt-1 size-4 shrink-0 text-amber-600" /><div className="min-w-0"><p className="break-words text-sm font-semibold">{String(item.name ?? item.sku ?? 'Ürün')}</p><p className="mt-1 text-xs text-muted-foreground">Stok: {String(item.quantity ?? '—')}</p></div></li>)}</ul>}
          <Link href="/admin/inventory" onClick={() => setOpen(false)} className="mt-5 inline-flex min-h-11 items-center rounded-lg border px-4 text-sm font-medium">Envanteri aç</Link>
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
