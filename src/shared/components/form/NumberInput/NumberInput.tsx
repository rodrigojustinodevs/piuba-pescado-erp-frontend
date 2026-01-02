"use client";

import { forwardRef } from "react";
import { BaseInput } from "../BaseInput";
import { useFieldId, getInputBaseClasses } from "../utils";
import type { NumberInputProps } from "../types";

/**
 * Componente de input numérico com suporte a min, max e step.
 *
 * @example
 * ```tsx
 * <NumberInput
 *   label="Idade"
 *   name="age"
 *   min={0}
 *   max={120}
 *   required
 *   error={errors.age?.message}
 * />
 *
 * <NumberInput
 *   label="Preço"
 *   name="price"
 *   min={0}
 *   step={0.01}
 *   placeholder="0.00"
 * />
 * ```
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      disabled,
      size = "md",
      variant,
      id,
      name,
      min,
      max,
      step,
      className = "",
      inputClassName = "",
      ...inputProps
    },
    ref
  ) => {
    const fieldId = useFieldId(id);
    const hasError = !!error;
    const finalVariant = variant || (hasError ? "error" : "default");

    const inputClasses = `${getInputBaseClasses(finalVariant, disabled, size)} ${inputClassName}`;

    return (
      <BaseInput
        label={label}
        helperText={helperText}
        error={error}
        required={required}
        disabled={disabled}
        size={size}
        variant={finalVariant}
        id={fieldId}
        name={name}
        className={className}
      >
        <input
          ref={ref}
          id={fieldId}
          name={name}
          type="number"
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
          }
          {...inputProps}
        />
      </BaseInput>
    );
  }
);

NumberInput.displayName = "NumberInput";

