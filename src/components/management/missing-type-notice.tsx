"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiGet, friendlyApiError, normalizeList } from "@/lib/management-api";
import { CATEGORY_LABELS, addMissingPresetTypes, toTransactionType, type TransactionCategory, type TransactionType } from "@/lib/transaction-types";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/stores/toast-store";

/** Explains why a form is disabled and, for managers, fixes it in one click. */
export function MissingTypeNotice({ category, onAdded }: { category: TransactionCategory; onAdded: () => void }) {
  const role = useAuthStore((state) => state.user?.role);
  const canManage = role === "OWNER" || role === "ADMIN";
  const [adding, setAdding] = useState(false);
  const label = CATEGORY_LABELS[category].toLocaleLowerCase("tr-TR");

  async function add() {
    setAdding(true);
    try {
      const existing = normalizeList(await apiGet<unknown>("/api/v1/admin/transaction-types"))
        .map(toTransactionType)
        .filter((type): type is TransactionType => type !== null);
      await addMissingPresetTypes(existing);
      toast.success("Önerilen işlem türleri eklendi.");
      onAdded();
    } catch (error) {
      toast.error(friendlyApiError(error, "İşlem türleri eklenemedi."));
    } finally {
      setAdding(false);
    }
  }

  return (
    <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
      <p className="font-medium">Kayıt açmak için kullanımda bir “{CATEGORY_LABELS[category]}” işlem türü gerekli.</p>
      {canManage ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={() => void add()} disabled={adding}>
            {adding ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Önerilen türleri ekle
          </Button>
          <Link href="/admin/settings" className="text-sm font-medium underline underline-offset-2">
            Ayarlar&apos;da düzenle
          </Link>
        </div>
      ) : (
        <p className="mt-1">Mağaza yöneticinizden Ayarlar bölümüne bir {label} türü eklemesini isteyin.</p>
      )}
    </div>
  );
}
