'use client';

import { forwardRef } from 'react';
import { useFieldId, getLabelClasses, getHelperTextClasses } from '../utils';
import type { BaseFormFieldProps } from '../types';

interface BaseInputInternalProps extends BaseFormFieldProps {
  children: React.ReactNode;
  inlineLabel?: boolean;
}

export const BaseInput = forwardRef<HTMLDivElement, BaseInputInternalProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      size = 'md',
      id,
      className = '',
      children,
      inlineLabel = false,
    },
    ref,
  ) => {
    const fieldId = useFieldId(id);
    const errorId = `${fieldId}-error`;
    const helperId = `${fieldId}-helper`;
    const hasError = !!error;

    const displayMessage = error || helperText;
    const messageId = hasError ? errorId : helperId;

    return (
      <div ref={ref} className={className}>
        {!inlineLabel && label && (
          <label htmlFor={fieldId} className={getLabelClasses(size)} id={`${fieldId}-label`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className={inlineLabel ? 'flex items-center gap-2' : ''}>
          {inlineLabel && label && (
            <label htmlFor={fieldId} className={getLabelClasses(size)} id={`${fieldId}-label`}>
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
            role={hasError ? 'alert' : undefined}
            aria-live={hasError ? 'polite' : undefined}
          >
            {displayMessage}
          </p>
        )}
      </div>
    );
  },
);

BaseInput.displayName = 'BaseInput';
