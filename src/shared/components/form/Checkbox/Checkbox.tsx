'use client';

import { forwardRef } from 'react';
import { BaseInput } from '../BaseInput';
import { useFieldId } from '../utils';
import type { CheckboxProps } from '../types';

/**
 * Componente de checkbox reutilizável e acessível.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Aceito os termos"
 *   name="terms"
 *   required
 *   error={errors.terms?.message}
 * />
 *
 * // Com React Hook Form
 * <Checkbox
 *   label="Ativo"
 *   {...register("active")}
 * />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      disabled,
      variant,
      id,
      name,
      checked,
      value = true,
      className = '',
      inputClassName = '',
      ...checkboxProps
    },
    ref,
  ) => {
    const fieldId = useFieldId(id);
    const hasError = !!error;
    const finalVariant = variant || (hasError ? 'error' : 'default');

    const checkboxClasses = `w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 ${
      hasError ? 'border-red-500' : ''
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${inputClassName}`;

    return (
      <BaseInput
        label={label}
        helperText={helperText}
        error={error}
        required={required}
        disabled={disabled}
        variant={finalVariant}
        id={fieldId}
        name={name}
        className={className}
        inlineLabel={true}
      >
        <input
          ref={ref}
          id={fieldId}
          name={name}
          type="checkbox"
          checked={checked}
          value={value as string | number}
          disabled={disabled}
          required={required}
          className={checkboxClasses}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
          }
          {...checkboxProps}
        />
      </BaseInput>
    );
  },
);

Checkbox.displayName = 'Checkbox';
