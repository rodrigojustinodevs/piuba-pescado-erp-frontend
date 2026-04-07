'use client';

import { forwardRef } from 'react';

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
  labelInline?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    requiredIndicator,
    error,
    className = '',
    id,
    options,
    placeholder,
    labelInline = false,
    disabled,
    ...props
  },
  ref,
) {
  const selectId = id ?? props.name;

  return (
    <div>
      <div className={labelInline ? 'flex items-center gap-3' : ''}>
        {label && (
          <label
            htmlFor={selectId}
            className={[
              'text-sm font-medium',
              labelInline ? 'mb-0 whitespace-nowrap text-slate-600' : ' text-[#0F172A] mb-1 block',
            ].join(' ')}
          >
            {label} {requiredIndicator && <span className="text-red-600">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={[
            'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#0F172A]',
            'focus:outline-none focus:ring-2 focus:ring-[#0EA5A4] focus:border-[#0EA5A4] transition',
            disabled ? 'opacity-60 cursor-not-allowed' : '',
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
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
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});
