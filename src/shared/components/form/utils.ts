import { useId } from "react";
import type { BaseFormFieldProps, FormFieldSize, FormFieldVariant } from "./types";

/**
 * Gera um ID único para o campo se não fornecido
 */
export function useFieldId(id?: string): string {
  const generatedId = useId();
  return id || generatedId;
}

/**
 * Retorna as classes CSS base para o input baseado no estado
 */
export function getInputBaseClasses(
  variant: FormFieldVariant = "default",
  disabled?: boolean,
  size: FormFieldSize = "md"
): string {
  const baseClasses =
    "w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2";

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const variantClasses = {
    default: "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
    error: "border-red-500 focus:ring-red-500 focus:border-red-500",
    success: "border-green-500 focus:ring-green-500 focus:border-green-500",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed bg-gray-50"
    : "bg-white";

  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses}`;
}

export function getInputAriaDescribedBy(
  fieldId: string,
  error?: string,
  helperText?: string
): string | undefined {
  if (error) return `${fieldId}-error`;
  if (helperText) return `${fieldId}-helper`;
  return undefined;
}

type UseInputStateArgs = Pick<
  BaseFormFieldProps,
  "id" | "helperText" | "error" | "variant" | "disabled" | "size" | "inputClassName"
>;

/**
 * Centraliza lógica compartilhada de inputs (id, variantes, classes e ARIA).
 */
export function useInputState({
  id,
  helperText,
  error,
  variant,
  disabled,
  size = "md",
  inputClassName = "",
}: UseInputStateArgs) {
  const fieldId = useFieldId(id);
  const hasError = !!error;
  const finalVariant: FormFieldVariant = variant || (hasError ? "error" : "default");

  const inputClasses = `${getInputBaseClasses(finalVariant, disabled, size)} ${inputClassName}`.trim();
  const describedBy = getInputAriaDescribedBy(fieldId, error, helperText);

  return { fieldId, hasError, finalVariant, inputClasses, describedBy };
}

/**
 * Retorna as classes CSS para o label baseado no tamanho
 */
export function getLabelClasses(size: FormFieldSize = "md", required?: boolean): string {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return `block font-medium text-gray-700 mb-1 ${sizeClasses[size]} ${required ? "" : ""}`;
}

/**
 * Retorna as classes CSS para mensagens de erro/helper
 */
export function getHelperTextClasses(isError?: boolean, size: FormFieldSize = "md"): string {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm",
  };

  const colorClasses = isError ? "text-red-600" : "text-gray-500";

  return `mt-1 ${sizeClasses[size]} ${colorClasses}`;
}

