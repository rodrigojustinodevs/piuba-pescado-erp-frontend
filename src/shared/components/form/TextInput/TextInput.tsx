"use client";

import { forwardRef } from "react";
import { BaseInput } from "../BaseInput";
import { useInputState } from "../utils";
import type { TextInputProps } from "../types";

/**
 * Componente de input de texto reutilizável e acessível.
 *
 * @example
 * ```tsx
 * // Uso básico
 * <TextInput
 *   label="Nome"
 *   name="name"
 *   placeholder="Digite seu nome"
 * />
 *
 * // Com React Hook Form
 * <TextInput
 *   label="Email"
 *   {...register("email")}
 *   error={errors.email?.message}
 * />
 *
 * // Com validação
 * <TextInput
 *   label="CPF"
 *   required
 *   error="CPF inválido"
 *   helperText="Digite apenas números"
 * />
 * ```
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
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
      type = "text",
      className = "",
      inputClassName = "",
      ...inputProps
    },
    ref
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
          type={type}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          {...inputProps}
        />
      </BaseInput>
    );
  }
);

TextInput.displayName = "TextInput";

