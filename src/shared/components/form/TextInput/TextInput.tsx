"use client";

import { forwardRef } from "react";
import { PrimitiveInput } from "../PrimitiveInput";
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
  ({ type = "text", ...props }, ref) => {
    return <PrimitiveInput ref={ref} type={type} {...props} />;
  }
);

TextInput.displayName = "TextInput";

