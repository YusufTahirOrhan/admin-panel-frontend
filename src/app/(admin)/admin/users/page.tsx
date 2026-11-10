"use client";

import { useState } from "react";
import { Check, ChevronDown, UserCheck, UserX } from "lucide-react";
import { ResourcePage } from "@/components/management/resource-page";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import { apiPatch, friendlyApiError, type ApiRecord } from "@/lib/management-api";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/stores/toast-store";

const ROLE_LABELS: Record<string, string> = { OWNER: "Mağaza sahibi", ADMIN: "Yönetici", STAFF: "Personel" };
const ROLE_HELP: Record<string, string> = {
  OWNER: "Her şeye erişir.",
  ADMIN: "Yönetim paneline ve kasaya erişir.",
  STAFF: "Kasa, müşteri, tamir ve reçete; envanteri görür.",
};

export default function UsersPage() {
  const me = useAuthStore((state) => state.user);
  const isMe = (item: ApiRecord) => Boolean(me) && (item.username === me?.name || item.email === me?.email || item.username === me?.email);

  return (
    <ResourcePage
      title="Personel"
      description="Hesap açın, rolleri ve erişimi yönetin."
      listPath="/api/v1/admin/users"
      createPath="/api/v1/admin/users"
      deletePath={(id) => `/api/v1/admin/users/${id}`}
      detailPath={(id) => `/api/v1/admin/users/${id}`}
      labels={{
        create: "Personel ekle",
        createTitle: "Yeni personel hesabı",
        submitCreate: "Hesabı oluştur",
        created: "Personel hesabı oluşturuldu. Giriş bilgilerini kendisine iletin.",
        deleted: "Personel hesabı silindi.",
        deleteTitle: "Hesap silinsin mi?",
        deleteDescription: "artık giriş yapamaz. Geçici olarak engellemek için Pasifleştir'i kullanın.",
        searchPlaceholder: "Ad veya e-posta ara",
        detailTitle: "Personel",
      }}
      fields={[
        { name: "username", label: "Kullanıcı adı", required: true, autoComplete: "off", placeholder: "Örn. ayse" },
        { name: "email", label: "E-posta", type: "email", required: true, autoComplete: "off" },
        {
          name: "password",
          label: "Geçici şifre",
          type: "password",
          required: true,
          autoComplete: "new-password",
          help: "En az 8 karakter. Kişi ilk girişten sonra değiştirmeli.",
          validate: (value) => (String(value ?? "").length >= 8 ? null : "En az 8 karakter olmalı."),
        },
        {
          name: "role",
          label: "Rol",
          type: "select",
          required: true,
          options: ["STAFF", "ADMIN", "OWNER"],
          optionLabels: Object.fromEntries(Object.entries(ROLE_LABELS).map(([role, label]) => [role, `${label} — ${ROLE_HELP[role]}`])),
        },
      ]}
      defaultValues={{ role: "STAFF" }}
      defaultSort={{ key: "username", direction: "asc" }}
      columns={[
        { key: "username", label: "Kullanıcı", render: (item) => (isMe(item) ? `${String(item.username)} (siz)` : String(item.username ?? "")), value: (item) => String(item.username ?? "") },
        { key: "email", label: "E-posta" },
        { key: "role", label: "Rol", filterable: true, value: (item) => ROLE_LABELS[String(item.role)] ?? String(item.role), render: (item) => <StatusBadge value={item.role} label={ROLE_LABELS[String(item.role)]} /> },
        {
          key: "active",
          label: "Durum",
          filterable: true,
          value: (item) => (item.active ? "Aktif" : "Pasif"),
          render: (item) => <StatusBadge value={Boolean(item.active)} label={item.active ? "Aktif" : "Pasif"} />,
        },
      ]}
      rowActions={(item, { reload }) => (isMe(item) ? null : <UserActions item={item} onChanged={reload} />)}
      emptyText="Henüz personel hesabı yok."
    />
  );
}

function UserActions({ item, onChanged }: { item: ApiRecord; onChanged: () => Promise<void> }) {
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const name = String(item.username ?? "");
  const active = Boolean(item.active);

  async function changeRole(role: string) {
    try {
      await apiPatch(`/api/v1/admin/users/${item.id}/role`, { role });
      toast.success(`${name} artık ${ROLE_LABELS[role]?.toLocaleLowerCase("tr-TR")}.`);
      setPendingRole(null);
      await onChanged();
    } catch (error) {
      setPendingRole(null);
      toast.error(friendlyApiError(error, "Rol değiştirilemedi."));
    }
  }

  async function changeStatus() {
    try {
      await apiPatch(`/api/v1/admin/users/${item.id}/status`, { active: !active });
      toast.success(active ? `${name} pasifleştirildi; giriş yapamaz.` : `${name} yeniden aktif.`);
      setStatusOpen(false);
      await onChanged();
    } catch (error) {
      setStatusOpen(false);
      toast.error(friendlyApiError(error, "Durum değiştirilemedi."));
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`${name} rolünü değiştir`}
          className="inline-flex h-7 items-center gap-1 rounded-md border border-input bg-background px-2.5 text-[0.8rem] font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
        >
          Rol
          <ChevronDown className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-56">
          {Object.entries(ROLE_LABELS).map(([role, label]) => (
            <DropdownMenuItem key={role} disabled={item.role === role} onClick={() => setPendingRole(role)} className="flex items-start gap-2 py-2">
              <Check className={item.role === role ? "mt-0.5 size-4" : "mt-0.5 size-4 opacity-0"} />
              <span>
                <span className="block font-medium">{label}</span>
                <span className="block text-xs text-muted-foreground">{ROLE_HELP[role]}</span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button type="button" variant="outline" size="sm" onClick={() => setStatusOpen(true)}>
        {active ? <UserX /> : <UserCheck />}
        {active ? "Pasifleştir" : "Aktifleştir"}
      </Button>

      <ConfirmDialog
        open={pendingRole !== null}
        onOpenChange={(open) => { if (!open) setPendingRole(null); }}
        title={`${name} için rol değişsin mi?`}
        description={pendingRole ? `Yeni rol: ${ROLE_LABELS[pendingRole]}. ${ROLE_HELP[pendingRole]} Değişiklik bir sonraki girişte geçerli olur.` : undefined}
        confirmLabel="Rolü değiştir"
        onConfirm={() => (pendingRole ? changeRole(pendingRole) : undefined)}
      />
      <ConfirmDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        title={active ? `${name} pasifleştirilsin mi?` : `${name} aktifleştirilsin mi?`}
        description={active ? "Pasif hesap giriş yapamaz. Kayıtları silinmez; istediğiniz zaman yeniden aktifleştirebilirsiniz." : "Kişi tekrar giriş yapabilir."}
        confirmLabel={active ? "Pasifleştir" : "Aktifleştir"}
        destructive={active}
        onConfirm={changeStatus}
      />
    </>
  );
}
