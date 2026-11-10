/**
 * Plain-language descriptions of audit log rows. Self-contained (no imports) so it can be
 * unit-tested with node directly.
 */

export interface AuditEvent {
  action?: unknown;
  resourceType?: unknown;
  resourceId?: unknown;
  afterJson?: unknown;
  actorUserId?: unknown;
  actorRole?: unknown;
  occurredAt?: unknown;
}

const ACTION_LABELS: Record<string, string> = {
  LOGIN_SUCCESS: "Giriş yapıldı",
  LOGIN_FAILED: "Hatalı giriş denemesi",
  LOGIN_BLOCKED: "Giriş geçici olarak engellendi",
  LOGOUT: "Çıkış yapıldı",
  TOKEN_REFRESHED: "Oturum yenilendi",
  DEVICE_SESSION_REVOKED: "Bir cihazın oturumu kapatıldı",
  PASSWORD_CHANGED: "Şifre değiştirildi",
  PASSWORD_RESET_REQUESTED: "Şifre sıfırlama istendi",
  PASSWORD_RESET_COMPLETED: "Şifre sıfırlandı",
  USER_CREATED: "Personel hesabı açıldı",
  USER_ROLE_UPDATED: "Rol değiştirildi",
  USER_ROLE_CHANGED: "Rol değiştirildi",
  USER_STATUS_UPDATED: "Hesap durumu değişti",
  USER_SOFT_DELETED: "Personel hesabı silindi",
  USER_DELETED: "Personel hesabı silindi",
  SALE_TRANSACTION_CREATED: "Satış yapıldı",
  SALE_TRANSACTION_CANCELED: "Satış iptal edildi",
  TRANSACTION_CANCELED: "Satış iptal edildi",
  SALE_TRANSACTION_REFUNDED: "İade yapıldı",
  TRANSACTION_REFUNDED: "İade yapıldı",
  SALE_STOCK_DEDUCTED: "Satılan ürün stoktan düştü",
  INVENTORY_ITEM_CREATED: "Ürün eklendi",
  INVENTORY_ITEM_DELETED: "Ürün silindi",
  INVENTORY_STOCK_CHANGED: "Stok değişti",
  STOCK_ADJUSTED: "Stok sayımı yapıldı",
  REPAIR_ORDER_CREATED: "Tamir kaydı açıldı",
  REPAIR_STATUS_UPDATED: "Tamir durumu değişti",
  REPAIR_STOCK_DEDUCTED: "Tamir için parça ayrıldı",
  REPAIR_STOCK_RELEASED: "Ayrılan parça stoğa döndü",
  PRESCRIPTION_CREATED: "Reçete eklendi",
  PRESCRIPTION_UPDATED: "Reçete güncellendi",
  CUSTOMER_CREATED: "Müşteri eklendi",
  CUSTOMER_UPDATED: "Müşteri güncellendi",
  CUSTOMER_DELETED: "Müşteri silindi",
  TRANSACTION_TYPE_CREATED: "İşlem türü eklendi",
  TRANSACTION_TYPE_UPDATED: "İşlem türü güncellendi",
  TRANSACTION_TYPE_DELETED: "İşlem türü silindi",
};

const RESOURCE_LABELS: Record<string, string> = {
  AUTH: "Oturum",
  USER: "Personel",
  INVENTORY: "Ürün",
  SALE_TRANSACTION: "Satış",
  CUSTOMER: "Müşteri",
  REPAIR_ORDER: "Tamir",
  LENS_PRESCRIPTION: "Reçete",
  TRANSACTION_TYPE: "İşlem türü",
};

const ROLE_LABELS: Record<string, string> = { OWNER: "Mağaza sahibi", ADMIN: "Yönetici", STAFF: "Personel" };
const REPAIR_LABELS: Record<string, string> = {
  RECEIVED: "Teslim alındı",
  IN_PROGRESS: "İşlemde",
  READY_FOR_PICKUP: "Teslime hazır",
  DELIVERED: "Teslim edildi",
  CANCELED: "İptal edildi",
};

const money = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });

function text(value: unknown): string {
  return typeof value === "string" ? value : value === undefined || value === null ? "" : String(value);
}

function details(event: AuditEvent): Record<string, unknown> {
  const raw = text(event.afterJson);
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function isManualCount(event: AuditEvent) {
  return text(event.action) === "INVENTORY_STOCK_CHANGED" && details(event).movement === "ADJUST";
}

export function auditActionLabel(event: AuditEvent): string {
  if (isManualCount(event)) return "Stok sayımı yapıldı";
  const action = text(event.action);
  // Unknown codes are English; a Turkish lower-case would turn "I" into "ı".
  return ACTION_LABELS[action] ?? action.replace(/_/g, " ").toLowerCase();
}

export function auditResourceLabel(resourceType: unknown): string {
  const type = text(resourceType);
  return RESOURCE_LABELS[type] ?? type;
}

/** One short line with what changed, or null when the row has nothing worth showing. */
export function auditDetail(event: AuditEvent): string | null {
  const data = details(event);
  const action = text(event.action);
  const subject = text(event.resourceId);
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(subject);
  const name = subject && subject !== "n/a" && !isUuid ? subject : "";

  switch (action) {
    case "USER_ROLE_UPDATED":
    case "USER_ROLE_CHANGED": {
      const role = ROLE_LABELS[text(data.role)];
      return [name, role ? `yeni rol: ${role}` : ""].filter(Boolean).join(", ") || null;
    }
    case "USER_STATUS_UPDATED":
      return [name, data.active === false ? "pasifleştirildi" : data.active === true ? "aktifleştirildi" : ""].filter(Boolean).join(", ") || null;
    case "SALE_TRANSACTION_REFUNDED":
    case "TRANSACTION_REFUNDED":
      return typeof data.refundAmount === "number" ? `${money.format(data.refundAmount)} iade` : null;
    case "SALE_TRANSACTION_CREATED":
      return typeof data.amount === "number" ? money.format(data.amount) : null;
    case "INVENTORY_STOCK_CHANGED": {
      const delta = typeof data.delta === "number" ? data.delta : null;
      if (delta === null) return name || null;
      // For a count the API logs the new quantity, for in/out the change.
      const change = data.movement === "ADJUST" ? `yeni stok ${delta}` : data.movement === "OUT" ? `${Math.abs(delta)} çıkış` : `${delta} giriş`;
      return [name, change].filter(Boolean).join(", ");
    }
    case "REPAIR_STATUS_UPDATED":
      return REPAIR_LABELS[text(data.status)] ?? null;
    case "LOGIN_FAILED":
      return [name, data.reason === "user-not-found" ? "böyle bir hesap yok" : data.reason === "invalid-credentials" ? "şifre hatalı" : ""].filter(Boolean).join(", ") || null;
    case "CUSTOMER_CREATED":
    case "TRANSACTION_TYPE_CREATED":
      return text(data.name) || name || null;
    case "REPAIR_STOCK_DEDUCTED":
    case "REPAIR_STOCK_RELEASED":
    case "SALE_STOCK_DEDUCTED":
      return [name, typeof data.quantity === "number" ? `${data.quantity} adet` : ""].filter(Boolean).join(", ") || null;
    default:
      return name || null;
  }
}

/** "ayse" when the actor is a known account; null for system or unknown actors. */
export function auditActorName(event: AuditEvent, usernames: Record<string, string>): string | null {
  const id = text(event.actorUserId);
  if (!id || text(event.actorRole) === "SYSTEM") return null;
  return usernames[id] ?? null;
}
