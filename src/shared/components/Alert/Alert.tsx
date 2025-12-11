"use client";

import { ReactNode } from "react";

export type AlertType = "success" | "warning" | "error";

export interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  learnMoreLink?: string;
  learnMoreText?: string;
  className?: string;
}

const typeStyles = {
  success: {
    container: "bg-green-50 border-green-200",
    icon: "bg-green-500 text-white",
    title: "text-green-900",
    message: "text-green-700",
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200",
    icon: "bg-yellow-500 text-white",
    title: "text-yellow-900",
    message: "text-yellow-700",
  },
  error: {
    container: "bg-red-50 border-red-200",
    icon: "bg-red-500 text-white",
    title: "text-red-900",
    message: "text-red-700",
  },
};

const typeIcons = {
  success: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export function Alert({
  type,
  title,
  message,
  learnMoreLink,
  learnMoreText = "Learn more",
  className = "",
}: AlertProps) {
  const styles = typeStyles[type];
  const icon = typeIcons[type];

  return (
    <div
      className={`rounded-lg border p-4 flex items-start gap-4 ${styles.container} ${className}`}
      role="alert"
    >
      {/* Icon Circle */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${styles.icon}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold text-base mb-1 ${styles.title}`}>{title}</h3>
        <p className={`text-sm ${styles.message}`}>{message}</p>
        {learnMoreLink && (
          <a
            href={learnMoreLink}
            className="text-blue-600 hover:text-blue-800 underline text-sm mt-1 inline-block"
          >
            {learnMoreText}
          </a>
        )}
      </div>
    </div>
  );
}


