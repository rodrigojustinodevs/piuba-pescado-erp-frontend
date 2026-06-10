'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBiometrySchema, type CreateBiometryFormData } from '../schemas';
import { BatchSelectField, useBatches } from '@/features/batch';
import { FormActions } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';

type BiometryFormProps = {
  initialValues?: CreateBiometryFormData;
  onSubmit: (data: CreateBiometryFormData) => void;
  isSubmitting?: boolean;
  /** Em edição, peso médio e FCR não podem ser alterados. */
  isUpdate?: boolean;
  submitLabel: string;
  submittingLabel: string;
  /** Quando definido (ex.: dialog), substitui o Cancelar padrão (history.back). */
  onCancel?: () => void;
};

export function BiometryForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  isUpdate = false,
  submitLabel,
  submittingLabel,
  onCancel,
}: Readonly<BiometryFormProps>) {
  const lockAverageWeightAndFcr = isUpdate;
  const { batches, isLoading: isLoadingBatches } = useBatches({
    page: 1,
    limit: 1000,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateBiometryFormData>({
    resolver: zodResolver(createBiometrySchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      batchId: '',
      biometryDate: '',
      averageWeight: 0,
      sampleWeight: 0,
      sampleQuantity: 0,
      fcr: 0,
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-[#0F172A]">Informações da Biometria</h2>
        <p className="mt-1 text-sm text-slate-600">
          Registre a data, pesos, quantidade da amostra e FCR do lote.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BatchSelectField
          control={control}
          batches={batches}
          isLoadingBatches={isLoadingBatches}
          disabled={isSubmitting}
          error={errors.batchId?.message}
        />

        <Input
          label="Data da biometria"
          requiredIndicator
          type="date"
          disabled={isSubmitting}
          {...register('biometryDate')}
          error={errors.biometryDate?.message}
        />

        <Input
          label="Peso médio"
          requiredIndicator
          type="number"
          step={0.01}
          min={0.01}
          disabled={isSubmitting || lockAverageWeightAndFcr}
          {...register('averageWeight', { valueAsNumber: true })}
          error={errors.averageWeight?.message}
        />

        <Input
          label="Peso da amostra"
          requiredIndicator
          type="number"
          step={0.01}
          min={0.01}
          disabled={isSubmitting}
          {...register('sampleWeight', { valueAsNumber: true })}
          error={errors.sampleWeight?.message}
        />

        <Input
          label="Quantidade na amostra"
          requiredIndicator
          type="number"
          step={1}
          min={1}
          disabled={isSubmitting}
          {...register('sampleQuantity', { valueAsNumber: true })}
          error={errors.sampleQuantity?.message}
        />

        <Input
          label="FCR"
          requiredIndicator
          type="number"
          step={0.01}
          min={0}
          disabled={isSubmitting || lockAverageWeightAndFcr}
          {...register('fcr', { valueAsNumber: true })}
          error={errors.fcr?.message}
        />
      </div>

      <FormActions
        submitLabel={submitLabel}
        loadingLabel={submittingLabel}
        isLoading={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
}
