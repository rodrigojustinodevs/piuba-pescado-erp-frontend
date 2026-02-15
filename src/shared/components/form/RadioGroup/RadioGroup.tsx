'use client';

import { forwardRef } from 'react';
import { BaseInput } from '../BaseInput';
import { Radio } from '../Radio';
import { useFieldId } from '../utils';
import type { RadioGroupProps } from '../types';

/**
 * Componente de grupo de radio buttons reutilizável e acessível.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: "1", label: "Opção 1" },
 *   { value: "2", label: "Opção 2" },
 * ];
 *
 * <RadioGroup
 *   label="Selecione uma opção"
 *   name="option"
 *   options={options}
 *   value={selected}
 *   onChange={setSelected}
 *   required
 *   error={errors.option?.message}
 * />
 * ```
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      disabled,
      variant,
      name,
      options,
      value,
      onChange,
      orientation = 'vertical',
      className = '',
    },
    ref,
  ) => {
    const groupId = useFieldId();
    const hasError = !!error;
    const finalVariant = variant || (hasError ? 'error' : 'default');

    const containerClasses = `flex ${orientation === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2'}`;

    return (
      <BaseInput
        label={label}
        helperText={helperText}
        error={error}
        required={required}
        disabled={disabled}
        variant={finalVariant}
        id={groupId}
        name={name}
        className={className}
      >
        <div
          ref={ref}
          role="radiogroup"
          aria-labelledby={label ? `${groupId}-label` : undefined}
          aria-describedby={
            error ? `${groupId}-error` : helperText ? `${groupId}-helper` : undefined
          }
          className={containerClasses}
        >
          {options.map((option) => {
            const optionId = `${groupId}-${option.value}`;
            return (
              <Radio
                key={option.value}
                id={optionId}
                name={name}
                value={option.value}
                label={option.label}
                checked={value === option.value}
                disabled={disabled || option.disabled}
                onChange={(e) => {
                  if (onChange) {
                    onChange(option.value);
                  }
                }}
              />
            );
          })}
        </div>
      </BaseInput>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';
