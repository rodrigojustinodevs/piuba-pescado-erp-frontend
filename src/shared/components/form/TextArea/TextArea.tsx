"use client";

import { forwardRef } from "react";
import { BaseInput } from "../BaseInput";
import { useFieldId, getInputBaseClasses } from "../utils";
import type { TextAreaProps } from "../types";

/**
 * Componente de textarea reutilizável e acessível.
 *
 * @example
 * ```tsx
 * <TextArea
 *   label="Descrição"
 *   name="description"
 *   rows={4}
 *   placeholder="Digite uma descrição..."
 *   error={errors.description?.message}
 * />
 * ```
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
      rows = 4,
      className = "",
      inputClassName = "",
      ...textareaProps
    },
    ref
  ) => {
    const fieldId = useFieldId(id);
    const hasError = !!error;
    const finalVariant = variant || (hasError ? "error" : "default");

    const textareaClasses = `${getInputBaseClasses(finalVariant, disabled, size)} resize-y ${inputClassName}`;

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
        <textarea
          ref={ref}
          id={fieldId}
          name={name}
          rows={rows}
          disabled={disabled}
          required={required}
          className={textareaClasses}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
          }
          {...textareaProps}
        />
      </BaseInput>
    );
  }
);

TextArea.displayName = "TextArea";

