import { useId, useMemo } from 'react';
import type { BaseFormFieldProps, FormFieldSize, FormFieldVariant } from './types';

const BASE_INPUT_CLASSES =
  'w-full rounded-lg border transition-all duration-200 bg-white focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50';

const INPUT_SIZES: Record<FormFieldSize, string> = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

const INPUT_VARIANTS: Record<FormFieldVariant, string> = {
  default: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
  error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
  success: 'border-green-500 focus:ring-green-500 focus:border-green-500',
};

const LABEL_SIZES: Record<FormFieldSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const HELPER_SIZES: Record<FormFieldSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
};

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getInputAriaDescribedBy(
  fieldId: string,
  hasError?: boolean,
  hasHelper?: boolean,
): string | undefined {
  if (hasError) return `${fieldId}-error`;
  if (hasHelper) return `${fieldId}-helper`;
  return undefined;
}

export function getInputBaseClasses(
  variant: FormFieldVariant = 'default',
  disabled?: boolean,
  size: FormFieldSize = 'md',
): string {
  return cn(BASE_INPUT_CLASSES, INPUT_SIZES[size], INPUT_VARIANTS[variant]);
}

export function getLabelClasses(size: FormFieldSize = 'md'): string {
  return cn('block font-medium text-gray-700 mb-1', LABEL_SIZES[size]);
}

export function getHelperTextClasses(isError?: boolean, size: FormFieldSize = 'md'): string {
  return cn('mt-1', HELPER_SIZES[size], isError ? 'text-red-600' : 'text-gray-500');
}

export function useFieldId(id?: string): string {
  const generatedId = useId();
  return id || generatedId;
}

type UseInputStateArgs = Pick<
  BaseFormFieldProps,
  'id' | 'helperText' | 'error' | 'variant' | 'disabled' | 'size' | 'inputClassName'
>;

export function useInputState({
  id,
  helperText,
  error,
  variant,
  disabled,
  size = 'md',
  inputClassName,
}: UseInputStateArgs) {
  const fieldId = useFieldId(id);
  const hasError = !!error;

  const finalVariant: FormFieldVariant = hasError ? 'error' : variant || 'default';

  const describedBy = getInputAriaDescribedBy(fieldId, hasError, !!helperText);

  const inputClasses = useMemo(() => {
    return cn(getInputBaseClasses(finalVariant, disabled, size), inputClassName);
  }, [finalVariant, disabled, size, inputClassName]);

  return {
    fieldId,
    hasError,
    finalVariant,
    inputClasses,
    describedBy,
  };
}
