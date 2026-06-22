'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CAUSE_LABELS,
  SEVERITY_LABELS,
  type CreateMortalityData,
  type MortalityCause,
  type MortalitySeverity,
} from '../types';
import { createMortalitySchema, type CreateMortalityFormData } from '../schemas';
import { BatchSelectField, useBatches } from '@/features/batch';
import { FormActions, Select } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';

type MortalityFormProps = {
  initialValues?: CreateMortalityFormData;
  onSubmit: (data: CreateMortalityData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  onCancel?: () => void;
};

const SEVERITY_OPTIONS = (['low', 'medium', 'high', 'critical'] as const satisfies readonly MortalitySeverity[]).map(
  (value) => ({ value, label: SEVERITY_LABELS[value] }),
);

const CAUSE_OPTIONS = (
  ['disease', 'water_quality', 'predation', 'handling', 'climate', 'unknown', 'other'] as const satisfies readonly MortalityCause[]
).map((value) => ({ value, label: CAUSE_LABELS[value] }));

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
  onCancel,
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
      cause: 'disease',
      severity: 'medium',
      description: '',
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((data) => {
        onSubmit({
          ...data,
          mortalityDate: toMortalityDateString(data.mortalityDate),
        });
      })}
    >
      <div className="mb-2">
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
          error={errors?.batchId?.message}
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

        <Controller
          name="cause"
          control={control}
          render={({ field }) => (
            <Select
              label="Causa"
              required
              disabled={isSubmitting}
              placeholder="Selecione a causa"
              options={CAUSE_OPTIONS}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value as MortalityCause)}
              error={errors.cause?.message}
            />
          )}
        />

        <Controller
          name="severity"
          control={control}
          render={({ field }) => (
            <Select
              label="Severidade"
              required
              disabled={isSubmitting}
              placeholder="Selecione a severidade"
              options={SEVERITY_OPTIONS}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value as MortalitySeverity)}
              error={errors.severity?.message}
            />
          )}
        />
        <div className="md:col-span-2">
          <Input
            label="Descrição"
            type="text"
            disabled={isSubmitting}
            placeholder="Observações adicionais sobre a ocorrência"
            {...register('description')}
            error={errors.description?.message}
          />
        </div>
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
