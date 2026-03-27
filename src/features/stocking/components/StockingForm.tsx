'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createStockingSchema,
  updateStockingSchema,
  type CreateStockingFormData,
  type UpdateStockingFormData,
} from '../schemas';
import type { Stocking } from '../types';
import { BatchSelectField, useBatches } from '@/features/batch';
import { FormActions } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';

type StockingFormCommonProps = {
  isLoading?: boolean;
  submitLabel?: string;
};

export type StockingFormProps =
  | (StockingFormCommonProps & {
      mode: 'create';
      initialData?: never;
      onSubmit: (data: CreateStockingFormData) => void;
    })
  | (StockingFormCommonProps & {
      mode: 'update';
      initialData: Stocking;
      onSubmit: (data: UpdateStockingFormData) => void;
    });

export function StockingForm({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Criar Povoamento',
}: StockingFormProps) {
  const { data: batchesData, isLoading: isLoadingBatches } = useBatches({
    page: 1,
    limit: 1000,
  });
  const batches = batchesData?.batches ?? [];

  const isEditMode = mode === 'update';
  const schema = isEditMode ? updateStockingSchema : createStockingSchema;

  const emptyValues: CreateStockingFormData = {
    batchId: '',
    stockingDate: '',
    quantity: 0,
    averageWeight: 0,
  };

  const buildValuesFromInitial = (data: Stocking): UpdateStockingFormData => ({
    id: data.id,
    batchId: data.batchId,
    stockingDate: data.stockingDate?.split('T')[0] ?? '',
    quantity: data.quantity,
    averageWeight: data.averageWeight,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateStockingFormData | UpdateStockingFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialData ? buildValuesFromInitial(initialData) : emptyValues,
  });

  useEffect(() => {
    if (initialData) {
      reset(buildValuesFromInitial(initialData));
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit as unknown as SubmitHandler<CreateStockingFormData | UpdateStockingFormData>,
      )}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Informações do Povoamento</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BatchSelectField
            control={control}
            batches={batches}
            isLoadingBatches={isLoadingBatches}
            error={errors.batchId?.message}
          />

          <Input
            label="Data do Povoamento"
            requiredIndicator
            type="date"
            disabled={isLoading}
            {...register('stockingDate')}
            error={errors.stockingDate?.message}
          />

          <Input
            label="Quantidade"
            requiredIndicator
            type="number"
            step={1}
            min={1}
            disabled={isLoading}
            {...register('quantity', { valueAsNumber: true })}
            error={errors.quantity?.message}
          />

          <Input
            label="Peso médio (kg)"
            requiredIndicator
            type="number"
            step={0.01}
            min={0.01}
            disabled={isLoading}
            {...register('averageWeight', { valueAsNumber: true })}
            error={errors.averageWeight?.message}
          />
        </div>
      </div>

      <FormActions
        submitLabel={submitLabel}
        loadingLabel={isEditMode ? 'Atualizando...' : 'Criando...'}
        isLoading={isLoading}
      />
    </form>
  );
}
