'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateFeedingData } from '../types';
import { FEED_TYPE_OPTIONS, FEED_TYPE_SELECT_OPTIONS } from '../constants';
import { createFeedingSchema, type CreateFeedingFormData } from '../schemas';
import { useFeedingStocks } from '../hooks/useFeedingStocks';
import { BatchSelectField, useBatches } from '@/features/batch';
import { FormActions, Select } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';

type FeedingFormProps = {
  initialValues?: CreateFeedingFormData;
  onSubmit: (data: CreateFeedingData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  /** Layout compacto para uso em diálogo (sem card de página). */
  variant?: 'page' | 'dialog';
  onCancel?: () => void;
};

/** Converte valor de datetime-local para formato esperado pelo backend (YYYY-MM-DD HH:mm:ss) */
function toFeedingDateString(value: string): string {
  if (!value) return '';
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Converte data do backend (YYYY-MM-DD HH:mm:ss ou ISO) para datetime-local (YYYY-MM-DDTHH:mm) */
export function toDateTimeLocalValue(value: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function FeedingForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
  variant = 'page',
  onCancel,
}: Readonly<FeedingFormProps>) {
  const { batches, isLoading: isLoadingBatches } = useBatches({
    page: 1,
    limit: 1000,
  });
  const { data: stocksData, isLoading: isLoadingStocks } = useFeedingStocks(true);
  const stockOptions = (stocksData?.supplies ?? []).map((supply) => ({
    value: supply.id,
    label: supply.defaultUnit?.trim() ? `${supply.name} (${supply.defaultUnit})` : supply.name,
  }));

  const feedTypeOptions = useMemo(() => {
    const extra = initialValues?.feedType?.trim();
    if (extra && !FEED_TYPE_OPTIONS.includes(extra)) {
      return [{ value: extra, label: extra }, ...FEED_TYPE_SELECT_OPTIONS];
    }
    return FEED_TYPE_SELECT_OPTIONS;
  }, [initialValues?.feedType]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateFeedingFormData>({
    resolver: zodResolver(createFeedingSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      batchId: '',
      feedingDate: '',
      quantityProvided: 0,
      feedType: '',
      stockId: '',
      stockReductionQuantity: 0,
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const isDialog = variant === 'dialog';

  const fieldsGrid = (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${isDialog ? 'gap-4' : 'gap-6'}`}>
      <BatchSelectField
        control={control}
        batches={batches}
        isLoadingBatches={isLoadingBatches}
        disabled={isSubmitting}
        error={errors.batchId?.message}
      />

      <Input
        label="Data e hora da alimentação"
        requiredIndicator
        type="datetime-local"
        disabled={isSubmitting}
        {...register('feedingDate')}
        error={errors.feedingDate?.message}
      />

      <Input
        label="Quantidade fornecida"
        requiredIndicator
        type="number"
        step={0.01}
        min={0.01}
        disabled={isSubmitting}
        {...register('quantityProvided', { valueAsNumber: true })}
        error={errors.quantityProvided?.message}
      />

      <Select
        label="Tipo de ração"
        required
        disabled={isSubmitting}
        options={feedTypeOptions}
        placeholder="Selecione o tipo de ração"
        {...register('feedType')}
        error={errors.feedType?.message}
      />

      <Select
        label="Estoque"
        required
        disabled={isSubmitting || isLoadingStocks}
        options={stockOptions}
        placeholder={isLoadingStocks ? 'Carregando estoques...' : 'Selecione um estoque'}
        {...register('stockId')}
        error={errors.stockId?.message}
      />

      <Input
        label="Redução de estoque"
        requiredIndicator
        type="number"
        step={0.01}
        min={0}
        disabled={isSubmitting}
        {...register('stockReductionQuantity', { valueAsNumber: true })}
        error={errors.stockReductionQuantity?.message}
      />
    </div>
  );

  const actions = (
    <div className={isDialog ? 'mt-4' : 'mt-8'}>
      <FormActions
        submitLabel={submitLabel}
        loadingLabel={submittingLabel}
        isLoading={isSubmitting}
        onCancel={onCancel}
      />
    </div>
  );

  return (
    <form
      className={isDialog ? 'space-y-4' : undefined}
      onSubmit={handleSubmit((data) => {
        onSubmit({
          ...data,
          feedingDate: toFeedingDateString(data.feedingDate),
        });
      })}
    >
      {isDialog ? (
        <>
          {fieldsGrid}
          {actions}
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#0F172A]">Informações da Alimentação</h2>
            <p className="mt-1 text-sm text-slate-600">
              Registre a data, quantidade e tipo de ração fornecida ao lote.
            </p>
          </div>

          {fieldsGrid}
          {actions}
        </div>
      )}
    </form>
  );
}
