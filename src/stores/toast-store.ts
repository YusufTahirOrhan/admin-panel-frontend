import { create } from "zustand";

export type ToastKind = "success" | "error" | "info";

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  push: (kind: ToastKind, message: string) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (kind, message) => {
    const id = nextId++;
    // A success clears earlier errors (they were just fixed) and a repeated message never stacks.
    const kept = get().toasts.filter((item) => item.message !== message && !(kind === "success" && item.kind === "error"));
    // Keep at most three on screen; errors stay longer so they can be read.
    set({ toasts: [...kept.slice(-2), { id, kind, message }] });
    window.setTimeout(() => get().dismiss(id), kind === "error" ? 7000 : 4000);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((toast) => toast.id !== id) }),
}));

/** Short confirmation of what just happened, e.g. toast.success("Ürün kaydedildi."). */
export const toast = {
  success: (message: string) => useToastStore.getState().push("success", message),
  error: (message: string) => useToastStore.getState().push("error", message),
  info: (message: string) => useToastStore.getState().push("info", message),
};
