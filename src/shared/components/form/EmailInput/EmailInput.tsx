"use client";

import { forwardRef } from "react";
import { TextInput } from "../TextInput";
import type { TextInputProps } from "../types";

/**
 * Componente de input de email com validação HTML5 nativa.
 *
 * @example
 * ```tsx
 * <EmailInput
 *   label="E-mail"
 *   name="email"
 *   required
 *   error={errors.email?.message}
 * />
 * ```
 */
export const EmailInput = forwardRef<HTMLInputElement, Omit<TextInputProps, "type">>(
  (props, ref) => {
    return <TextInput ref={ref} type="email" {...props} />;
  }
);

EmailInput.displayName = "EmailInput";

