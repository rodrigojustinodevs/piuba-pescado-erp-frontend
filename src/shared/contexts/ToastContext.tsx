"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ToastContainer, type Toast, type ToastType } from "../components/Toast";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function generateToastId(): string {
  // Preferir geradores criptograficamente seguros (evita alertas do Sonar sobre PRNG não seguro).
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID();

  // Fallback: getRandomValues + timestamp (ainda suficientemente único para IDs de UI).
  const bytes = new Uint8Array(16);
  cryptoObj?.getRandomValues?.(bytes);
  const randomPart = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${Date.now().toString(36)}-${randomPart}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = generateToastId();
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const showSuccess = useCallback((message: string) => addToast(message, "success"), [addToast]);
  const showError = useCallback((message: string) => addToast(message, "error"), [addToast]);
  const showInfo = useCallback((message: string) => addToast(message, "info"), [addToast]);
  const showWarning = useCallback((message: string) => addToast(message, "warning"), [addToast]);

  return (
    <ToastContext.Provider
      value={{
        showToast: addToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return context;
}

