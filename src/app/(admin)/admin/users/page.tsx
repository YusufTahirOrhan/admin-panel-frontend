"use client";

import { ResourcePage } from "@/components/management/resource-page";

export default function UsersPage() {
  return (
    <ResourcePage
      title="Personel Yönetimi"
      description="Personel hesaplarını oluşturun, yetkileri izleyin ve pasif hesapları yönetin."
      listPath="/api/v1/admin/users"
      createPath="/api/v1/admin/users"
      deletePath={(id) => `/api/v1/admin/users/${id}`}
      detailPath={(id) => `/api/v1/admin/users/${id}`}
      fields={[
        { name: "username", label: "Kullanıcı adı", required: true },
        { name: "email", label: "E-posta", type: "email", required: true },
        { name: "password", label: "Şifre", type: "password", required: true },
        { name: "role", label: "Rol", type: "select", options: ["OWNER", "ADMIN", "STAFF"], required: true },
      ]}
      columns={[
        { key: "username", label: "Kullanıcı" },
        { key: "email", label: "E-posta" },
        { key: "role", label: "Rol" },
        { key: "active", label: "Aktif" },
      ]}
      emptyText="Kullanıcı bulunamadı."
    />
  );
}
