'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCompanies } from '@/features/company';
import { usePurchaseSuppliers, usePurchaseSupplies } from '@/features/purchase';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { FormActions } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';
import { addRequiredCompanyIssue } from '@/shared/utils/zod';
import type { CreateStockData } from '../types';
import { createStockFormSchema, type CreateStockFormData } from '../schemas';

type StockFormProps = {
  initialValues?: CreateStockFormData;
  onSubmit: (data: CreateStockData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
};

export function StockForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
}: Readonly<StockFormProps>) {
  const { user, isMaster } = useAuthContext();
  const showCompanySelect = isMaster();

  const resolverSchema = useMemo(
    () =>
      createStockFormSchema.superRefine((data, ctx) => {
        if (showCompanySelect && !data.companyId?.trim()) {
          addRequiredCompanyIssue(ctx);
        }
      }),
    [showCompanySelect],
  );

  const { data: companiesData, isLoading: loadingCompanies } = useCompanies({
    page: 1,
    limit: 500,
    enabled: showCompanySelect,
  });
  const companyOptions = useMemo(
    () => (companiesData?.companies ?? []).map((c) => ({ value: c.id, label: c.name })),
    [companiesData?.companies],
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateStockFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      companyId: '',
      supplierId: '',
      supplyId: '',
      quantity: 0,
      unit: '',
      minimumStock: 0,
      unitPrice: 0,
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const selectedCompanyId = useWatch({ control, name: 'companyId' });
  const effectiveCompanyId =
    (showCompanySelect ? selectedCompanyId : user?.companyId)?.trim() || '';

  const { data: suppliersData, isLoading: loadingSuppliers } = usePurchaseSuppliers(
    !!effectiveCompanyId,
    effectiveCompanyId,
  );
  const { data: suppliesData, isLoading: loadingSupplies } = usePurchaseSupplies(
    !!effectiveCompanyId,
    effectiveCompanyId,
  );

  const supplierOptions = useMemo(
    () => (suppliersData?.suppliers ?? []).map((s) => ({ value: s.id, label: s.name })),
    [suppliersData?.suppliers],
  );
  const supplyOptions = useMemo(
    () => (suppliesData?.supplies ?? []).map((s) => ({ value: s.id, label: s.name })),
    [suppliesData?.supplies],
  );

  const prevCompanyForReset = useRef<string | undefined>(undefined);
  useEffect(() => {
    const id = effectiveCompanyId || undefined;
    if (!id) return;
    if (prevCompanyForReset.current !== undefined && prevCompanyForReset.current !== id) {
      setValue('supplierId', '');
      setValue('supplyId', '');
    }
    prevCompanyForReset.current = id;
  }, [effectiveCompanyId, setValue]);

  if (!user) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-700">
        Carregando sessão...
      </div>
    );
  }

  if (!showCompanySelect && !user.companyId) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-900">
        Não foi possível identificar a empresa do usuário. Faça login novamente ou contate o suporte.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const companyId = showCompanySelect ? data.companyId?.trim() : undefined;
        const payload: CreateStockData = {
          supplierId: data.supplierId.trim(),
          supplyId: data.supplyId,
          quantity: data.quantity,
          unit: data.unit.trim(),
          minimumStock: data.minimumStock,
          unitPrice: data.unitPrice,
        };
        if (companyId) {
          payload.companyId = companyId;
        }
        onSubmit(payload);
      })}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Novo estoque</h2>
          <p className="mt-1 text-sm text-slate-600">
            Vincule fornecedor e insumo, informe quantidade e parâmetros de controle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showCompanySelect ? (
            <div className="md:col-span-2">
              <Select
                label="Empresa"
                requiredIndicator
                disabled={isSubmitting || loadingCompanies}
                options={companyOptions}
                placeholder={loadingCompanies ? 'Carregando empresas...' : 'Selecione a empresa'}
                {...register('companyId')}
                error={errors.companyId?.message}
              />
            </div>
          ) : null}

          <Select
            label="Fornecedor"
            requiredIndicator
            disabled={isSubmitting || loadingSuppliers || !effectiveCompanyId}
            options={supplierOptions}
            placeholder={
              !effectiveCompanyId
                ? 'Selecione a empresa primeiro'
                : loadingSuppliers
                  ? 'Carregando fornecedores...'
                  : 'Selecione um fornecedor'
            }
            {...register('supplierId')}
            error={errors.supplierId?.message}
          />

          <Select
            label="Insumo"
            requiredIndicator
            disabled={isSubmitting || loadingSupplies || !effectiveCompanyId}
            options={supplyOptions}
            placeholder={
              !effectiveCompanyId
                ? 'Selecione a empresa primeiro'
                : loadingSupplies
                  ? 'Carregando insumos...'
                  : 'Selecione um insumo'
            }
            {...register('supplyId')}
            error={errors.supplyId?.message}
          />

          <Input
            label="Quantidade inicial"
            requiredIndicator
            type="number"
            step={0.01}
            min={0.01}
            disabled={isSubmitting}
            {...register('quantity', { valueAsNumber: true })}
            error={errors.quantity?.message}
          />

          <Input
            label="Unidade"
            requiredIndicator
            type="text"
            disabled={isSubmitting}
            placeholder="Ex.: kg, ração"
            {...register('unit')}
            error={errors.unit?.message}
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
            label="Preço unitário"
            requiredIndicator
            type="number"
            step={0.01}
            min={0}
            disabled={isSubmitting}
            {...register('unitPrice', { valueAsNumber: true })}
            error={errors.unitPrice?.message}
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
