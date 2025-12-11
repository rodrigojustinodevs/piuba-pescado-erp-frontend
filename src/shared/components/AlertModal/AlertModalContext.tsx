"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AlertModal, type AlertModalType } from "./AlertModal";

interface AlertModalState {
  isOpen: boolean;
  type: AlertModalType;
  title: string;
  message: string;
  buttonText?: string;
  onConfirm?: () => void;
}

interface AlertModalContextType {
  showAlert: (
    type: AlertModalType,
    title: string,
    message: string,
    buttonText?: string,
    onConfirm?: () => void
  ) => void;
  showSuccess: (title: string, message: string, buttonText?: string, onConfirm?: () => void) => void;
  showError: (title: string, message: string, buttonText?: string, onConfirm?: () => void) => void;
  showWarning: (title: string, message: string, buttonText?: string, onConfirm?: () => void) => void;
  showInfo: (title: string, message: string, buttonText?: string, onConfirm?: () => void) => void;
  closeAlert: () => void;
}

const AlertModalContext = createContext<AlertModalContextType | undefined>(undefined);

export function AlertModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<AlertModalState>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const showAlert = useCallback(
    (
      type: AlertModalType,
      title: string,
      message: string,
      buttonText?: string,
      onConfirm?: () => void
    ) => {
      setModalState({
        isOpen: true,
        type,
        title,
        message,
        buttonText,
        onConfirm,
      });
    },
    []
  );

  const showSuccess = useCallback(
    (title: string, message: string, buttonText?: string, onConfirm?: () => void) => {
      showAlert("success", title, message, buttonText, onConfirm);
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message: string, buttonText?: string, onConfirm?: () => void) => {
      showAlert("error", title, message, buttonText, onConfirm);
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message: string, buttonText?: string, onConfirm?: () => void) => {
      showAlert("warning", title, message, buttonText, onConfirm);
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message: string, buttonText?: string, onConfirm?: () => void) => {
      showAlert("info", title, message, buttonText, onConfirm);
    },
    [showAlert]
  );

  const closeAlert = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <AlertModalContext.Provider
      value={{
        showAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeAlert,
      }}
    >
      {children}
      <AlertModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        buttonText={modalState.buttonText}
        onClose={closeAlert}
        onConfirm={modalState.onConfirm}
      />
    </AlertModalContext.Provider>
  );
}

export function useAlertModal() {
  const context = useContext(AlertModalContext);
  if (context === undefined) {
    throw new Error("useAlertModal must be used within an AlertModalProvider");
  }
  return context;
}

