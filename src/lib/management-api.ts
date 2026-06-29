import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export type ApiRecord = Record<string, unknown>;

export interface PageBlock {
  id?: string | null;
  type: string;
  order: number;
  enabled: boolean;
  content: ApiRecord;
}

export interface SitePage {
  page: string;
  published: boolean;
  blocks: PageBlock[];
}

export interface ResourceField {
  name: string;
  label: string;
  type?: "text" | "number" | "email" | "password" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface PageMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await api.get<T>(path);
  return response.data;
}

export async function apiPost<T>(path: string, payload: ApiRecord = {}): Promise<T> {
  const response = await api.post<T>(path, payload);
  return response.data;
}

export async function apiPatch<T>(path: string, payload: ApiRecord): Promise<T> {
  const response = await api.patch<T>(path, payload);
  return response.data;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await api.delete<T>(path);
  return response.data;
}

export async function apiPut<T>(path: string, payload: ApiRecord): Promise<T> {
  const response = await api.put<T>(path, payload);
  return response.data;
}

export async function apiUpload<T>(path: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<T>(path, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export function normalizeList(data: unknown): ApiRecord[] {
  if (Array.isArray(data)) {
    return data.filter(isApiRecord);
  }
  if (isApiRecord(data) && Array.isArray(data.content)) {
    return data.content.filter(isApiRecord);
  }
  return [];
}

export function normalizePageMeta(data: unknown): PageMeta | null {
  if (!isApiRecord(data)) {
    return null;
  }

  const page = typeof data.number === "number" ? data.number : 0;
  const size = typeof data.size === "number" ? data.size : normalizeList(data).length;
  const totalElements =
    typeof data.totalElements === "number" ? data.totalElements : normalizeList(data).length;
  const totalPages = typeof data.totalPages === "number" ? data.totalPages : 1;

  return { page, size, totalElements, totalPages };
}

export function isApiRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function fieldValue(record: ApiRecord, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== "") {
      return String(value);
    }
  }
  return "-";
}

export function friendlyApiError(exception: unknown, fallback: string): string {
  if (exception instanceof AxiosError) {
    const data = exception.response?.data;
    if (isApiRecord(data)) {
      const message = data.message ?? data.error ?? data.detail ?? data.title;
      if (typeof message === "string" && message.trim()) {
        return translateKnownError(message);
      }
    }
    if (exception.response?.status === 401) {
      return "Oturumunuz sona ermiş olabilir. Lütfen tekrar giriş yapın.";
    }
    if (exception.response?.status === 403) {
      return "Bu işlem için yetkiniz bulunmuyor.";
    }
    if (exception.response?.status === 404) {
      return "İstenen kayıt bulunamadı.";
    }
    if (exception.response?.status && exception.response.status >= 500) {
      return "Sunucuda beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    }
  }

  if (exception instanceof Error && exception.message.trim()) {
    return translateKnownError(exception.message);
  }

  return fallback;
}

function translateKnownError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("network error")) {
    return "API sunucusuna ulaşılamıyor. Bağlantınızı ve servis durumunu kontrol edin.";
  }
  if (normalized.includes("duplicate") || normalized.includes("already exists")) {
    return "Bu kayıt zaten mevcut. Lütfen benzersiz bir değer kullanın.";
  }
  if (normalized.includes("validation") || normalized.includes("invalid")) {
    return "Girilen bilgileri kontrol edin ve tekrar deneyin.";
  }

  return message;
}
