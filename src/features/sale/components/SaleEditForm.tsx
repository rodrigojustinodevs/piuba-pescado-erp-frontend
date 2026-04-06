'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, FormActions } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';
import { SaleEditableFields } from './SaleEditableFields';
import type { UpdateSaleData } from '../types';
import {
  saleUpdateStatusValues,
  updateSaleFormSchema,
  type UpdateSaleFormData,
} from '../schemas';

export type SaleEditReadOnlyContext = {
  clientName: string;
  batchName: string;
  stockingId: string | null;
  financialCategoryId: string | null;
};

type SaleEditFormProps = {
  readOnlyContext: SaleEditReadOnlyContext;
  initialValues?: UpdateSaleFormData;
  onSubmit: (data: Omit<UpdateSaleData, 'id'>) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
};

export function SaleEditForm({
  readOnlyContext,
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
}: Readonly<SaleEditFormProps>) {
  const statusOptions = [
    { value: saleUpdateStatusValues[0], label: 'Pendente' },
    { value: saleUpdateStatusValues[1], label: 'Confirmado' },
  ];
  const readOnlyFields = [
    {
      key: 'clientName',
      label: 'Cliente',
      value: readOnlyContext.clientName,
      className: 'bg-slate-50 text-slate-600 cursor-not-allowed',
    },
    {
      key: 'batchName',
      label: 'Lote',
      value: readOnlyContext.batchName,
      className: 'bg-slate-50 text-slate-600 cursor-not-allowed',
    },
    {
      key: 'stockingId',
      label: 'Povoamento',
      value: readOnlyContext.stockingId,
      className: 'bg-slate-50 text-slate-600 cursor-not-allowed font-mono text-xs',
    },
    {
      key: 'financialCategoryId',
      label: 'Categoria financeira',
      value: readOnlyContext.financialCategoryId,
      className: 'bg-slate-50 text-slate-600 cursor-not-allowed font-mono text-xs',
    },
  ] as const;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateSaleFormData>({
    resolver: zodResolver(updateSaleFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      totalWeight: 0,
      pricePerKg: 0,
      saleDate: '',
      status: saleUpdateStatusValues[0],
      notes: '',
      isTotalHarvest: false,
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit({
          totalWeight: data.totalWeight,
          pricePerKg: data.pricePerKg,
          saleDate: data.saleDate,
          status: data.status,
          notes: data.notes?.trim() ? data.notes.trim() : null,
          isTotalHarvest: data.isTotalHarvest,
        });
      })}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Alterar venda</h2>
          <p className="mt-1 text-sm text-slate-600">
            Cliente, lote, povoamento e categoria financeira não podem ser alterados. Edite peso,
            preço, data, status, observações e despesca total abaixo.
          </p>
        </div>

        <div className="mb-8 pb-8 border-b border-slate-200">
          <p className="text-sm font-medium text-[#0F172A] mb-4">Vínculos (somente leitura)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {readOnlyFields.map((field) => (
              <Input
                key={field.key}
                label={field.label}
                type="text"
                disabled
                readOnly
                value={field.value || '—'}
                onChange={() => {}}
                className={field.className}
              />
            ))}
          </div>
        </div>

        <p className="text-sm font-medium text-[#0F172A] mb-4">Campos editáveis</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Peso total"
            requiredIndicator
            type="number"
            step={0.001}
            min={0.001}
            disabled={isSubmitting}
            {...register('totalWeight', { valueAsNumber: true })}
            error={errors.totalWeight?.message}
          />

          <SaleEditableFields
            isSubmitting={isSubmitting}
            statusOptions={statusOptions}
            pricePerKgMin={0}
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
