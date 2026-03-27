'use client';

import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import type { Batch } from '../types';
import { formatBatchOptionLabel } from '../utils/format';
import { Select } from '@/shared/components/ui';

type BatchSelectFieldProps<TFieldValues extends FieldValues & { batchId: string }> = {
  control: Control<TFieldValues>;
  batches: Batch[];
  isLoadingBatches: boolean;
  /** Ex.: `isSubmitting` do formulário */
  disabled?: boolean;
  error?: string;
};

/**
 * Select de lote integrado ao react-hook-form (campo `batchId`).
 */
export function BatchSelectField<TFieldValues extends FieldValues & { batchId: string }>({
  control,
  batches,
  isLoadingBatches,
  disabled = false,
  error,
}: Readonly<BatchSelectFieldProps<TFieldValues>>) {
  return (
    <Controller
      name={'batchId' as Path<TFieldValues>}
      control={control}
      render={({ field }) => (
        <Select
          label="Lote"
          requiredIndicator
          disabled={isLoadingBatches || disabled}
          placeholder={isLoadingBatches ? 'Carregando lotes...' : 'Selecione um lote'}
          options={batches.map((batch) => ({
            value: batch.id,
            label: formatBatchOptionLabel(batch),
          }))}
          value={field.value ?? ''}
          onChange={(e) => field.onChange(e.target.value)}
          error={error}
        />
      )}
    />
  );
}
