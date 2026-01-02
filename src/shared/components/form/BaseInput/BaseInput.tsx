"use client";

import { forwardRef } from "react";
import { useFieldId, getInputBaseClasses, getLabelClasses, getHelperTextClasses } from "../utils";
import type { BaseFormFieldProps } from "../types";

/**
 * Props internas do BaseInput (não expostas diretamente)
 */
interface BaseInputInternalProps extends BaseFormFieldProps {
  /**
   * Elemento renderizado (input, textarea, select)
   */
  children: React.ReactNode;
  /**
   * Se o campo deve renderizar o label inline (para checkbox/radio)
   */
  inlineLabel?: boolean;
}

/**
 * Componente base que encapsula a estrutura comum de campos de formulário:
 * - Label
 * - Input/Field
 * - Helper text / Error message
 * - Estados visuais (error, success, disabled)
 * - Acessibilidade
 *
 * Este componente não é exportado diretamente, mas serve como base para
 * todos os outros componentes de formulário.
 */
export const BaseInput = forwardRef<HTMLDivElement, BaseInputInternalProps>(
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
      className = "",
      children,
      inlineLabel = false,
    },
    ref
  ) => {
    const fieldId = useFieldId(id);
    const errorId = `${fieldId}-error`;
    const helperId = `${fieldId}-helper`;
    const hasError = !!error;
    const finalVariant = variant || (hasError ? "error" : "default");

    // Determina qual mensagem exibir (erro tem prioridade sobre helper text)
    const displayMessage = error || helperText;
    const messageId = hasError ? errorId : helperId;

    return (
      <div ref={ref} className={className}>
        {!inlineLabel && label && (
          <label
            htmlFor={fieldId}
            className={getLabelClasses(size, required)}
            id={`${fieldId}-label`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className={inlineLabel ? "flex items-center gap-2" : ""}>
          {inlineLabel && label && (
            <label
              htmlFor={fieldId}
              className={getLabelClasses(size, required)}
              id={`${fieldId}-label`}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          {children}
        </div>

        {displayMessage && (
          <p
            id={messageId}
            className={getHelperTextClasses(hasError, size)}
            role={hasError ? "alert" : undefined}
            aria-live={hasError ? "polite" : undefined}
          >
            {displayMessage}
          </p>
        )}
      </div>
    );
  }
);

BaseInput.displayName = "BaseInput";

