"use client";

import { forwardRef } from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  requiredIndicator?: boolean;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, requiredIndicator, error, className = "", id, ...props },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#0F172A] mb-1 block">
          {label}{" "}
          {requiredIndicator && <span className="text-red-600">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={[
          "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#0F172A]",
          "focus:outline-none focus:ring-2 focus:ring-[#0EA5A4] focus:border-[#0EA5A4] transition",
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});
