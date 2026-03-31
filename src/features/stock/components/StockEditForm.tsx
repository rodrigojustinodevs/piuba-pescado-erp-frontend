'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuppliers } from '@/features/supplier';
import { FormActions } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import type { UpdateStockPayload } from '../types';
import { updateStockFormSchema, type UpdateStockFormData } from '../schemas';

type StockEditFormProps = {
  lookupCompanyId?: string | null;
  initialValues: UpdateStockFormData;
  onSubmit: (data: UpdateStockPayload) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
};

export function StockEditForm({
  lookupCompanyId,
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
}: Readonly<StockEditFormProps>) {
  const { user } = useAuthContext();
  const cid = (lookupCompanyId?.trim() || user?.companyId?.trim() || '').trim();
  const { data: suppliersData, isLoading: loadingSuppliers } = useSuppliers();
  const supplierOptions = [
    { value: '', label: 'Sem fornecedor' },
    ...(suppliersData?.suppliers ?? []).map((s) => ({ value: s.id, label: s.name })),
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateStockFormData>({
    resolver: zodResolver(updateStockFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit({
          unit: data.unit.trim(),
          supplierId: data.supplierId.trim() || null,
          unitPrice: data.unitPrice,
          minimumStock: data.minimumStock,
          withdrawalQuantity: data.withdrawalQuantity,
        });
      })}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Editar estoque</h2>
          <p className="mt-1 text-sm text-slate-600">
            Apenas unidade, fornecedor, preço, estoque mínimo e retiradas podem ser alterados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Fornecedor"
            disabled={isSubmitting || loadingSuppliers}
            options={supplierOptions}
            {...register('supplierId')}
            error={errors.supplierId?.message}
          />

          <Input
            label="Unidade"
            requiredIndicator
            type="text"
            disabled={isSubmitting}
            placeholder="Ex.: kg"
            {...register('unit')}
            error={errors.unit?.message}
          />

          <Input
            label="Preço unitário"
            requiredIndicator
            type="number"
            step={0.01}
            min={0}
            disabled={isSubmitting}
            {...register('unitPrice', { valueAsNumber: true })}
            error={errors.unitPrice?.message}
          />

          <Input
            label="Estoque mínimo"
            requiredIndicator
            type="number"
            step={0.01}
            min={0}
            disabled={isSubmitting}
            {...register('minimumStock', { valueAsNumber: true })}
            error={errors.minimumStock?.message}
          />

          <Input
            label="Quantidade de retirada"
            requiredIndicator
            type="number"
            step={0.01}
            min={0}
            disabled={isSubmitting}
            {...register('withdrawalQuantity', { valueAsNumber: true })}
            error={errors.withdrawalQuantity?.message}
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
