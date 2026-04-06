'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, FormActions, TextArea } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';
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
            <Input
              label="Cliente"
              type="text"
              disabled
              readOnly
              value={readOnlyContext.clientName || '—'}
              onChange={() => {}}
              className="bg-slate-50 text-slate-600 cursor-not-allowed"
            />
            <Input
              label="Lote"
              type="text"
              disabled
              readOnly
              value={readOnlyContext.batchName || '—'}
              onChange={() => {}}
              className="bg-slate-50 text-slate-600 cursor-not-allowed"
            />
            <Input
              label="Povoamento"
              type="text"
              disabled
              readOnly
              value={readOnlyContext.stockingId || '—'}
              onChange={() => {}}
              className="bg-slate-50 text-slate-600 cursor-not-allowed font-mono text-xs"
            />
            <Input
              label="Categoria financeira"
              type="text"
              disabled
              readOnly
              value={readOnlyContext.financialCategoryId || '—'}
              onChange={() => {}}
              className="bg-slate-50 text-slate-600 cursor-not-allowed font-mono text-xs"
            />
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

          <Input
            label="Preço por kg"
            requiredIndicator
            type="number"
            step={0.01}
            min={0}
            disabled={isSubmitting}
            {...register('pricePerKg', { valueAsNumber: true })}
            error={errors.pricePerKg?.message}
          />

          <Input
            label="Data da venda"
            requiredIndicator
            type="date"
            disabled={isSubmitting}
            {...register('saleDate')}
            error={errors.saleDate?.message}
          />

          <Select
            label="Status"
            requiredIndicator
            disabled={isSubmitting}
            options={statusOptions}
            {...register('status')}
            error={errors.status?.message}
          />

          <div className="md:col-span-2 w-full min-w-0">
            <TextArea
              label="Observações"
              disabled={isSubmitting}
              placeholder="Observações da venda"
              rows={4}
              className="w-full"
              inputClassName="w-full min-h-[100px]"
              {...register('notes')}
              error={errors.notes?.message}
            />
          </div>
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
