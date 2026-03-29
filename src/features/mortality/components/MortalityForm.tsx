'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateMortalityData } from '../types';
import { createMortalitySchema, type CreateMortalityFormData } from '../schemas';
import { BatchSelectField, useBatches } from '@/features/batch';
import { FormActions } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';

type MortalityFormProps = {
  initialValues?: CreateMortalityFormData;
  onSubmit: (data: CreateMortalityData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
};

function toMortalityDateString(value: string): string {
  if (!value) return '';
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toDateInputValue(value: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function MortalityForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
}: Readonly<MortalityFormProps>) {
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
  } = useForm<CreateMortalityFormData>({
    resolver: zodResolver(createMortalitySchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      batchId: '',
      mortalityDate: '',
      quantity: 1,
      cause: '',
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit({
          ...data,
          mortalityDate: toMortalityDateString(data.mortalityDate),
        });
      })}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Informações da Mortalidade</h2>
          <p className="mt-1 text-sm text-slate-600">
            Registre a data, quantidade e causa da mortalidade do lote.
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
            label="Data da mortalidade"
            requiredIndicator
            type="date"
            disabled={isSubmitting}
            {...register('mortalityDate')}
            error={errors.mortalityDate?.message}
          />

          <Input
            label="Quantidade"
            requiredIndicator
            type="number"
            min={1}
            step={1}
            disabled={isSubmitting}
            {...register('quantity', { valueAsNumber: true })}
            error={errors.quantity?.message}
          />

          <Input
            label="Causa"
            requiredIndicator
            type="text"
            disabled={isSubmitting}
            placeholder="Ex.: Água com temperatura elevada"
            {...register('cause')}
            error={errors.cause?.message}
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
