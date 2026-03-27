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
  submitLabel: string;
  submittingLabel: string;
};

export function BiometryForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
}: Readonly<BiometryFormProps>) {
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
      fcr: 0,
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Informações da Biometria</h2>
          <p className="mt-1 text-sm text-slate-600">
            Registre a data da biometria, peso médio e FCR do lote.
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
            disabled={isSubmitting}
            {...register('averageWeight', { valueAsNumber: true })}
            error={errors.averageWeight?.message}
          />

          <Input
            label="FCR"
            requiredIndicator
            type="number"
            step={0.01}
            min={0}
            disabled={isSubmitting}
            {...register('fcr', { valueAsNumber: true })}
            error={errors.fcr?.message}
          />
        </div>

        <div className="mt-8">
          <FormActions
            submitLabel={submitLabel}
            loadingLabel={submittingLabel}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
}
