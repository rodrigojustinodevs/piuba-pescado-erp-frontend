"use client";

import { forwardRef } from "react";
import { BaseInput } from "../BaseInput";
import { useFieldId } from "../utils";
import type { RadioProps } from "../types";

/**
 * Componente de radio button reutilizável e acessível.
 * Para grupos de radio, use o componente RadioGroup.
 *
 * @example
 * ```tsx
 * <Radio
 *   label="Opção 1"
 *   name="option"
 *   value="1"
 *   checked={selected === "1"}
 * />
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
      value,
      checked,
      className = "",
      inputClassName = "",
      ...radioProps
    },
    ref
  ) => {
    const fieldId = useFieldId(id);
    const hasError = !!error;
    const finalVariant = variant || (hasError ? "error" : "default");

    const radioClasses = `w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 ${
      hasError ? "border-red-500" : ""
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${inputClassName}`;

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
          type="radio"
          value={value}
          checked={checked}
          disabled={disabled}
          required={required}
          className={radioClasses}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
          }
          {...radioProps}
        />
      </BaseInput>
    );
  }
);

Radio.displayName = "Radio";

