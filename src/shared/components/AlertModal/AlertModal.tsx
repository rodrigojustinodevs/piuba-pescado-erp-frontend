'use client';

import { useEffect, useCallback, ReactNode } from 'react';

export type AlertModalType = 'success' | 'warning' | 'error' | 'info';
export interface AlertModalProps {
  isOpen: boolean;
  type: AlertModalType;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const TYPE_CONFIG: Record<AlertModalType, { iconBg: string; buttonBg: string; icon: ReactNode }> = {
  success: {
    iconBg: 'bg-green-500',
    buttonBg: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    icon: (
      <svg
        className="w-12 h-12 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  warning: {
    iconBg: 'bg-yellow-500',
    buttonBg: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    icon: (
      <svg
        className="w-12 h-12 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  error: {
    iconBg: 'bg-red-500',
    buttonBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    icon: (
      <svg
        className="w-16 h-16 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  info: {
    iconBg: 'bg-blue-500',
    buttonBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    icon: (
      <svg
        className="w-12 h-12 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export function AlertModal({
  isOpen,
  type,
  title,
  message,
  buttonText = 'Okay, Got It',
  onClose,
  onConfirm,
}: AlertModalProps) {
  const config = TYPE_CONFIG[type];

  const handleClose = useCallback(() => onClose(), [onClose]);

  const handleConfirm = useCallback(() => {
    if (onConfirm) onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm cursor-default"
        onClick={handleClose}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transition-all animate-in fade-in zoom-in duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors focus:ring-2 focus:ring-gray-300 outline-none"
          aria-label="Fechar modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-20 h-20 ${config.iconBg} rounded-full flex items-center justify-center mb-4 shadow-inner`}
            aria-hidden="true"
          >
            {config.icon}
          </div>

          <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed mb-8">{message}</p>

          <button
            onClick={handleConfirm}
            autoFocus
            className={`w-full ${config.buttonBg} text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
