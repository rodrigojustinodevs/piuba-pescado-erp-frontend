'use client';

import { forwardRef } from 'react';
import { BaseInput } from '../BaseInput';
import { useInputState } from '../utils';
import type { BaseFormFieldProps } from '../types';

import type { InputHTMLAttributes } from 'react';

type PrimitiveInputProps = BaseFormFieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

/**
 * Input "primitivo" para reutilização interna.
 * Centraliza a estrutura BaseInput + <input> e acessibilidade.
 */
export const PrimitiveInput = forwardRef<HTMLInputElement, PrimitiveInputProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      disabled,
      size = 'md',
      variant,
      id,
      name,
      className = '',
      inputClassName = '',
      ...inputProps
    },
    ref,
  ) => {
    const { fieldId, hasError, finalVariant, inputClasses, describedBy } = useInputState({
      id,
      helperText,
      error,
      variant,
      disabled,
      size,
      inputClassName,
    });

    const baseInputProps = {
      label,
      helperText,
      error,
      required,
      disabled,
      size,
      variant: finalVariant,
      id: fieldId,
      name,
      className,
    };

    return (
      <BaseInput {...baseInputProps}>
        <input
          ref={ref}
          id={fieldId}
          name={name}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          {...inputProps}
        />
      </BaseInput>
    );
  },
);

PrimitiveInput.displayName = 'PrimitiveInput';
