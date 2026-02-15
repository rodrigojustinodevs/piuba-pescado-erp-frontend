'use client';

import { forwardRef } from 'react';
import { PrimitiveInput } from '../PrimitiveInput';
import type { NumberInputProps } from '../types';

/**
 * Componente de input numérico com suporte a min, max e step.
 *
 * @example
 * ```tsx
 * <NumberInput
 *   label="Idade"
 *   name="age"
 *   min={0}
 *   max={120}
 *   required
 *   error={errors.age?.message}
 * />
 *
 * <NumberInput
 *   label="Preço"
 *   name="price"
 *   min={0}
 *   step={0.01}
 *   placeholder="0.00"
 * />
 * ```
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ min, max, step, ...props }, ref) => {
    return <PrimitiveInput ref={ref} type="number" min={min} max={max} step={step} {...props} />;
  },
);

NumberInput.displayName = 'NumberInput';
