"use client";

import { forwardRef } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  requiredIndicator?: boolean;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, requiredIndicator, error, className = "", id, options, placeholder, ...props },
  ref
) {
  const selectId = id ?? props.name;

  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[#0F172A] mb-1 block">
          {label}{" "}
          {requiredIndicator && <span className="text-red-600">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={[
          "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#0F172A]",
          "focus:outline-none focus:ring-2 focus:ring-[#0EA5A4] focus:border-[#0EA5A4] transition",
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});
