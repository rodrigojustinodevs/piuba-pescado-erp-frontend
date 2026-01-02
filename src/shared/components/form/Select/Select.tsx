"use client";

import { forwardRef } from "react";
import { BaseInput } from "../BaseInput";
import { useFieldId, getInputBaseClasses } from "../utils";
import type { SelectProps } from "../types";

/**
 * Componente de select reutilizável e acessível.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: "1", label: "Opção 1" },
 *   { value: "2", label: "Opção 2" },
 * ];
 *
 * <Select
 *   label="Selecione uma opção"
 *   name="option"
 *   options={options}
 *   placeholder="Escolha..."
 *   required
 *   error={errors.option?.message}
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
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
      options,
      placeholder,
      className = "",
      inputClassName = "",
      onChange,
      ...selectProps
    },
    ref
  ) => {
    const fieldId = useFieldId(id);
    const hasError = !!error;
    const finalVariant = variant || (hasError ? "error" : "default");

    const selectClasses = `${getInputBaseClasses(finalVariant, disabled, size)} ${inputClassName}`;

    // Handler para garantir que o onChange do register seja chamado corretamente
    // O onChange do register vem dentro de selectProps quando usamos {...register()}
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      // Primeiro chama o onChange do register (que está em selectProps)
      // Isso garante que o React Hook Form seja notificado da mudança
      if (selectProps.onChange) {
        selectProps.onChange(e);
      }
      
      // Depois chama o onChange customizado se fornecido
      if (onChange) {
        onChange(e);
      }
    };

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
        className={className}
      >
        <select
          ref={ref}
          id={fieldId}
          disabled={disabled}
          required={required}
          className={selectClasses}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
          }
          {...selectProps}
          onChange={handleChange}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options && options.length > 0 ? (
            options.map((option) => (
              <option key={String(option.value)} value={String(option.value)} disabled={option.disabled}>
                {option.label}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Nenhuma opção disponível
            </option>
          )}
        </select>
      </BaseInput>
    );
  }
);

Select.displayName = "Select";

