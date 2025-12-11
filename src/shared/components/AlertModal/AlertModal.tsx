"use client";

import { useEffect } from "react";

export type AlertModalType = "success" | "warning" | "error" | "info";

export interface AlertModalProps {
  isOpen: boolean;
  type: AlertModalType;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const typeStyles = {
  success: {
    icon: "bg-green-500",
    button: "bg-green-600 hover:bg-green-700",
  },
  warning: {
    icon: "bg-yellow-500",
    button: "bg-yellow-600 hover:bg-yellow-700",
  },
  error: {
    icon: "bg-red-500",
    button: "bg-red-600 hover:bg-red-700",
  },
  info: {
    icon: "bg-blue-500",
    button: "bg-blue-600 hover:bg-blue-700",
  },
};

const typeIcons = {
  success: (
    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export function AlertModal({
  isOpen,
  type,
  title,
  message,
  buttonText = "Okay, Got It",
  onClose,
  onConfirm,
}: AlertModalProps) {
  const styles = typeStyles[type];
  const icon = typeIcons[type];

  // Fechar com ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop com blur */}
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />

      {/* Modal Card */}
      <div
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fechar"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center pt-4">
          {/* Icon */}
          <div
            className={`w-24 h-24 ${styles.icon} rounded-full flex items-center justify-center mb-4`}
          >
            {icon}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>

          {/* Message */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{message}</p>

          {/* Button */}
          <button
            onClick={handleConfirm}
            className={`w-full ${styles.button} text-white font-bold py-3 px-6 rounded-lg transition-colors`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

