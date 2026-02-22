'use client';

import { useEffect } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createSettlementSchema,
  updateSettlementSchema,
  type CreateSettlementFormData,
  type UpdateSettlementFormData,
} from '../schemas';
import type { Settlement } from '../types';
import { useBatches } from '@/features/batch';
import { FormActions } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';

type SettlementFormCommonProps = {
  isLoading?: boolean;
  submitLabel?: string;
};

export type SettlementFormProps =
  | (SettlementFormCommonProps & {
      mode: 'create';
      initialData?: never;
      onSubmit: (data: CreateSettlementFormData) => void;
    })
  | (SettlementFormCommonProps & {
      mode: 'update';
      initialData: Settlement;
      onSubmit: (data: UpdateSettlementFormData) => void;
    });

export function SettlementForm({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Criar Povoamento',
}: SettlementFormProps) {
  const { data: batchesData, isLoading: isLoadingBatches } = useBatches({
    page: 1,
    limit: 1000,
  });
  const batches = batchesData?.batches ?? [];

  const isEditMode = mode === 'update';
  const schema = isEditMode ? updateSettlementSchema : createSettlementSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateSettlementFormData | UpdateSettlementFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialData
      ? {
          id: initialData.id,
          batcheId: initialData.batcheId,
          settlementDate: initialData.settlementDate?.split('T')[0] ?? '',
          quantity: initialData.quantity,
          averageWeight: initialData.averageWeight,
        }
      : {
          batcheId: '',
          settlementDate: '',
          quantity: 0,
          averageWeight: 0,
        },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        batcheId: initialData.batcheId,
        settlementDate: initialData.settlementDate?.split('T')[0] ?? '',
        quantity: initialData.quantity,
        averageWeight: initialData.averageWeight,
      });
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit as unknown as SubmitHandler<CreateSettlementFormData | UpdateSettlementFormData>,
      )}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Informações do Povoamento</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="batcheId"
            control={control}
            render={({ field }) => (
              <Select
                label="Lote"
                requiredIndicator
                disabled={isLoadingBatches}
                placeholder={isLoadingBatches ? 'Carregando lotes...' : 'Selecione um lote'}
                options={batches.map((batch) => ({
                  value: batch.id,
                  label: `${batch.name || batch.species} (${batch.entryDate?.split('T')[0] ?? '-'})`,
                }))}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
                error={errors.batcheId?.message}
              />
            )}
          />

          <Input
            label="Data do Povoamento"
            requiredIndicator
            type="date"
            disabled={isLoading}
            {...register('settlementDate')}
            error={errors.settlementDate?.message}
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
