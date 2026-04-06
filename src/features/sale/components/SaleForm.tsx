'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useClients } from '@/features/client';
import { useBatches } from '@/features/batch';
import { useStockings } from '@/features/stocking';
import { Checkbox, FormActions } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';
import { SaleEditableFields } from './SaleEditableFields';
import type { CreateSaleData } from '../types';
import { createSaleFormSchema, saleStatusValues, type CreateSaleFormData } from '../schemas';

type SaleFormProps = {
  initialValues?: CreateSaleFormData;
  onSubmit: (data: CreateSaleData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
};

export function SaleForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
}: Readonly<SaleFormProps>) {
  const { data: clientsData, isLoading: isLoadingClients } = useClients({ page: 1, limit: 1000 });
  const { batches, isLoading: isLoadingBatches } = useBatches({ page: 1, limit: 1000 });

  const clientOptions = useMemo(
    () => (clientsData?.clients ?? []).map((c) => ({ value: c.id, label: c.name })),
    [clientsData?.clients],
  );
  const batchOptions = useMemo(
    () => batches.map((b) => ({ value: b.id, label: b.name || b.id })),
    [batches],
  );

  const statusOptions = useMemo(
    () => [
      { value: saleStatusValues[0], label: 'Pendente' },
      { value: saleStatusValues[1], label: 'Confirmado' },
    ],
    [],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateSaleFormData>({
    resolver: zodResolver(createSaleFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      clientId: '',
      batchId: '',
      stockingId: '',
      financialCategoryId: '',
      totalWeight: 0,
      pricePerKg: 0,
      saleDate: '',
      isTotalHarvest: false,
      needsInvoice: false,
      status: saleStatusValues[0],
      notes: '',
    },
  });

  const batchIdWatch = useWatch({ control, name: 'batchId' }) ?? '';
  const batchIdForStockings = batchIdWatch.trim();
  const { data: stockingsData, isLoading: isLoadingStockings } = useStockings({
    page: 1,
    perPage: 1000,
    enabled: batchIdForStockings.length > 0,
    ...(batchIdForStockings ? { batchId: batchIdForStockings } : {}),
  });

  const stockingOptions = useMemo(
    () =>
      (stockingsData?.stockings ?? []).map((s) => ({
        value: s.id,
        label: `${s.batchName || s.batchId || 'Lote'} · ${s.stockingDate || '—'}`,
      })),
    [stockingsData?.stockings],
  );

  /** Ao mudar o lote, zera povoamento — exceto na transição inicial '' → lote (create/reset). */
  const prevBatchIdRef = useRef<string | null>(null);
  useEffect(() => {
    const prev = prevBatchIdRef.current;
    if (prev === null) {
      prevBatchIdRef.current = batchIdWatch;
      return;
    }
    if (prev !== batchIdWatch) {
      const shouldClear = prev !== '' || batchIdWatch === '';
      if (shouldClear) {
        setValue('stockingId', '');
      }
      prevBatchIdRef.current = batchIdWatch;
    }
  }, [batchIdWatch, setValue]);

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const hasBatchSelected = Boolean(batchIdWatch.trim());
  let stockingPlaceholder = 'Selecione o povoamento';
  if (isLoadingStockings) {
    stockingPlaceholder = 'Carregando povoamentos...';
  }
  if (!hasBatchSelected) {
    stockingPlaceholder = 'Selecione o lote primeiro';
  }

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit({
          clientId: data.clientId,
          batchId: data.batchId,
          stockingId: data.stockingId.trim(),
          financialCategoryId: data.financialCategoryId.trim(),
          totalWeight: data.totalWeight,
          pricePerKg: data.pricePerKg,
          saleDate: data.saleDate,
          isTotalHarvest: data.isTotalHarvest,
          needsInvoice: data.needsInvoice,
          status: data.status,
          notes: data.notes?.trim() ? data.notes.trim() : null,
        });
      })}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Dados da venda</h2>
          <p className="mt-1 text-sm text-slate-600">
            Informe cliente, lote, peso e informações financeiras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Cliente"
            requiredIndicator
            disabled={isSubmitting || isLoadingClients}
            options={clientOptions}
            placeholder={isLoadingClients ? 'Carregando clientes...' : 'Selecione o cliente'}
            {...register('clientId')}
            error={errors.clientId?.message}
          />

          <Select
            label="Lote"
            requiredIndicator
            disabled={isSubmitting || isLoadingBatches}
            options={batchOptions}
            placeholder={isLoadingBatches ? 'Carregando lotes...' : 'Selecione o lote'}
            {...register('batchId')}
            error={errors.batchId?.message}
          />

          <Select
            label="Povoamento"
            requiredIndicator
            disabled={isSubmitting || !hasBatchSelected || isLoadingStockings}
            options={stockingOptions}
            placeholder={stockingPlaceholder}
            {...register('stockingId')}
            error={errors.stockingId?.message}
          />

          <Input
            label="Categoria financeira (ID)"
            requiredIndicator
            type="text"
            disabled={isSubmitting}
            placeholder="UUID da categoria financeira"
            {...register('financialCategoryId')}
            error={errors.financialCategoryId?.message}
          />

          <Input
            label="Peso total"
            requiredIndicator
            type="number"
            step={0.01}
            min={0.01}
            disabled={isSubmitting}
            {...register('totalWeight', { valueAsNumber: true })}
            error={errors.totalWeight?.message}
          />

          <SaleEditableFields
            isSubmitting={isSubmitting}
            statusOptions={statusOptions}
            pricePerKgMin={0.01}
            pricePerKgRegister={register('pricePerKg', { valueAsNumber: true })}
            saleDateRegister={register('saleDate')}
            statusRegister={register('status')}
            notesRegister={register('notes')}
            pricePerKgError={errors.pricePerKg?.message}
            saleDateError={errors.saleDate?.message}
            statusError={errors.status?.message}
            notesError={errors.notes?.message}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm font-medium text-[#0F172A] mb-4">Opções da venda</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-6">
            <Controller
              control={control}
              name="isTotalHarvest"
              render={({ field }) => (
                <Checkbox
                  label="Despesca total"
                  disabled={isSubmitting}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                />
              )}
            />

            <Controller
              control={control}
              name="needsInvoice"
              render={({ field }) => (
                <Checkbox
                  label="Precisa de nota fiscal"
                  disabled={isSubmitting}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                />
              )}
            />
          </div>
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
