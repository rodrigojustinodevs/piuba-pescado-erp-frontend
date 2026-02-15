'use client';

import { forwardRef } from 'react';
import { BaseInput } from '../BaseInput';
import { useFieldId } from '../utils';
import type { SwitchProps } from '../types';

/**
 * Componente de switch (toggle) reutilizável e acessível.
 *
 * @example
 * ```tsx
 * <Switch
 *   label="Ativar notificações"
 *   name="notifications"
 *   checked={enabled}
 *   onChange={(e) => setEnabled(e.target.checked)}
 * />
 * ```
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
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
      className = '',
      inputClassName = '',
      ...switchProps
    },
    ref,
  ) => {
    const fieldId = useFieldId(id);
    const hasError = !!error;
    const finalVariant = variant || (hasError ? 'error' : 'default');

    const switchClasses = `relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      checked ? 'bg-blue-600' : 'bg-gray-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${hasError ? 'ring-2 ring-red-500' : ''} ${inputClassName}`;

    const thumbClasses = `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
      checked ? 'translate-x-6' : 'translate-x-1'
    }`;

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
        <label htmlFor={fieldId} className="flex items-center gap-3 cursor-pointer">
          <input
            ref={ref}
            id={fieldId}
            name={name}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            required={required}
            className="sr-only"
            aria-invalid={hasError}
            aria-describedby={
              error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
            }
            {...switchProps}
          />
          <span className={switchClasses}>
            <span className={thumbClasses} />
          </span>
        </label>
      </BaseInput>
    );
  },
);

Switch.displayName = 'Switch';
