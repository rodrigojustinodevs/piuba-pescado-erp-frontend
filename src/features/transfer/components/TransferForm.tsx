'use client';

import { useEffect, useMemo } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createTransferSchema,
  updateTransferSchema,
  type CreateTransferFormData,
  type UpdateTransferFormData,
} from '../schemas';
import type { Transfer } from '../types';
import { useBatches } from '@/features/batch';
import { formatBatchOptionLabel } from '@/features/batch/utils/format';
import { useTanksWithoutBatches } from '@/features/tank';
import { FormActions } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';

type TransferFormCommonProps = {
  isLoading?: boolean;
  submitLabel?: string;
};

export type TransferFormProps =
  | (TransferFormCommonProps & {
      mode: 'create';
      initialData?: never;
      onSubmit: (data: CreateTransferFormData) => void;
    })
  | (TransferFormCommonProps & {
      mode: 'update';
      initialData: Transfer;
      onSubmit: (data: UpdateTransferFormData) => void;
    });

export function TransferForm({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Criar Transferência',
}: TransferFormProps) {
  const { data: batchesData, isLoading: isLoadingBatches } = useBatches({ page: 1, limit: 1000 });
  const batches = batchesData?.batches ?? [];

  const { data: destinationTanksData, isLoading: isLoadingDestinationTanks } =
    useTanksWithoutBatches({
      page: 1,
      per_page: 1000,
    });
  const destinationTanks = destinationTanksData?.tanks ?? [];

  const isEditMode = mode === 'update';
  const schema = isEditMode ? updateTransferSchema : createTransferSchema;
  const emptyValues: CreateTransferFormData = {
    batcheId: '',
    originTankId: '',
    destinationTankId: '',
    quantity: 0,
    description: '',
  };

  const buildValuesFromInitial = (data: Transfer): UpdateTransferFormData => ({
    id: data.id,
    batcheId: data.batcheId,
    originTankId: data.originTankId,
    destinationTankId: data.destinationTankId,
    quantity: data.quantity,
    description: data.description,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm<CreateTransferFormData | UpdateTransferFormData>({
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

  const originTankId = watch('originTankId');
  const destinationTankId = watch('destinationTankId');
  const batcheId = watch('batcheId');

  const selectedBatch = useMemo(() => batches.find((b) => b.id === batcheId), [batches, batcheId]);
  const originTankLabel = selectedBatch?.tank?.name ?? '—';

  const destinationTanksWithCurrent = useMemo(() => {
    // Se estiver editando e o destino atual não vier da rota without-batches,
    // mantemos o item na lista para não "sumir" do Select.
    if (!isEditMode || !destinationTankId) return destinationTanks;
    const exists = destinationTanks.some((t) => t.id === destinationTankId);
    if (exists) return destinationTanks;
    return [
      ...destinationTanks,
      {
        id: destinationTankId,
        name: `Tanque ${destinationTankId.slice(0, 8)}…`,
      } as unknown as (typeof destinationTanks)[number],
    ];
  }, [destinationTanks, destinationTankId, isEditMode]);

  const destinationTankOptions = useMemo(() => {
    if (!originTankId) return destinationTanksWithCurrent;
    return destinationTanksWithCurrent.filter((t) => t.id !== originTankId);
  }, [destinationTanksWithCurrent, originTankId]);

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit as unknown as SubmitHandler<CreateTransferFormData | UpdateTransferFormData>,
      )}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Informações da Transferência</h3>

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
                  label: formatBatchOptionLabel(batch),
                }))}
                value={field.value || ''}
                onChange={(e) => {
                  const nextBatchId = e.target.value;
                  field.onChange(nextBatchId);

                  const selectedBatch = batches.find((b) => b.id === nextBatchId);
                  const nextOriginTankId = selectedBatch?.tank?.id;

                  setValue('originTankId', nextOriginTankId ?? '', {
                    shouldDirty: true,
                    shouldValidate: true,
                  });

                  if (!isEditMode) {
                    setValue('quantity', selectedBatch?.initialQuantity ?? 0, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }

                  // Se o lote for limpo ou o tanque mudar, limpa destino caso conflite.
                  if (!nextOriginTankId || destinationTankId === nextOriginTankId) {
                    setValue('destinationTankId', '', {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }
                }}
                error={errors.batcheId?.message}
              />
            )}
          />

          <Input
            label="Tanque de origem"
            requiredIndicator
            type="text"
            value={originTankLabel}
            disabled
            readOnly
            error={errors.originTankId?.message}
          />

          <Controller
            name="destinationTankId"
            control={control}
            render={({ field }) => (
              <Select
                label="Tanque de destino"
                requiredIndicator
                disabled={isLoadingDestinationTanks}
                placeholder={
                  isLoadingDestinationTanks
                    ? 'Carregando tanques...'
                    : 'Selecione o tanque de destino'
                }
                options={destinationTankOptions.map((tank) => ({
                  value: tank.id,
                  label: tank.name,
                }))}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
                error={errors.destinationTankId?.message}
              />
            )}
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
            label="Descrição"
            requiredIndicator
            type="text"
            disabled={isLoading}
            {...register('description')}
            error={errors.description?.message}
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
