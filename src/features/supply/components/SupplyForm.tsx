'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCompanyGate } from '@/shared/components/states/AuthCompanyGate';
import { useFormWithCompany } from '@/shared/hooks/useFormWithCompany';
import { useSuppliers } from '@/features/supplier/hooks/useSuppliers';
import { FormActions, FormCardSection, Switch, ControlledSelect, TextArea } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';
import type { CreateSupplyData } from '../types';
import {
  createSupplyFormSchema,
  supplyDefaultUnitValues,
  supplyCategoryOptions,
  type CreateSupplyFormData,
} from '../schemas';

type SupplyFormProps = {
  initialValues?: CreateSupplyFormData;
  onSubmit: (data: CreateSupplyData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  inDialog?: boolean;
};

export function SupplyForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
  inDialog = false,
}: Readonly<SupplyFormProps>) {
  const { user, showCompanySelect, resolverSchema, loadingCompanies, companyOptions } =
    useFormWithCompany(createSupplyFormSchema);

  const unitOptions = useMemo(
    () => [
      { value: 'kg', label: 'Kg' },
      { value: 'g', label: 'Gramas' },
      { value: 'liter', label: 'Litro' },
      { value: 'ml', label: 'ML' },
      { value: 'unit', label: 'Unidade' },
      { value: 'box', label: 'Caixa' },
      { value: 'piece', label: 'Peça' },
    ],
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateSupplyFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      companyId: '',
      sku: '',
      name: '',
      category: '',
      defaultUnit: supplyDefaultUnitValues[0],
      supplierId: '',
      unitCost: 0,
      salePrice: 0,
      currentStock: 0,
      minStock: 0,
      isProduct: false,
      description: '',
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const isProduct = useWatch({ control, name: 'isProduct' });
  const { data: suppliersData, isLoading: loadingSuppliers } = useSuppliers({ limit: 500 });
  const supplierOptions = useMemo(
    () => (suppliersData?.suppliers ?? []).map((s) => ({ value: s.id, label: s.name })),
    [suppliersData?.suppliers],
  );

  const fields = (
    <div className="space-y-5">
      {showCompanySelect ? (
        <ControlledSelect
          control={control}
          name="companyId"
          label="Empresa"
          required
          disabled={isSubmitting || loadingCompanies}
          options={companyOptions}
          placeholder={loadingCompanies ? 'Carregando empresas...' : 'Selecione a empresa'}
          error={errors.companyId?.message}
        />
      ) : null}

      {/* Toggle produto vendável */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-slate-800">Produto vendável</p>
          <p className="text-xs text-slate-500">
            Habilite para itens comercializados (ex.: filé, peixe inteiro).
          </p>
        </div>
        <Controller
          control={control}
          name="isProduct"
          render={({ field }) => (
            <Switch
              name={field.name}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      {/* SKU + Nome */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="SKU"
          type="text"
          disabled={isSubmitting}
          placeholder="Ex.: RAC-ENG-24"
          {...register('sku')}
          error={errors.sku?.message}
        />
        <Input
          label="Nome"
          requiredIndicator
          type="text"
          disabled={isSubmitting}
          placeholder="Ex.: Ração Engorda 24% PB"
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

      {/* Categoria + Unidade + Fornecedor */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ControlledSelect
          control={control}
          name="category"
          label="Categoria"
          disabled={isSubmitting}
          options={supplyCategoryOptions}
          placeholder="Selecione"
          error={errors.category?.message}
        />
        <ControlledSelect
          control={control}
          name="defaultUnit"
          label="Unidade"
          required
          disabled={isSubmitting}
          options={unitOptions}
          error={errors.defaultUnit?.message}
        />
        <ControlledSelect
          control={control}
          name="supplierId"
          label="Fornecedor"
          disabled={isSubmitting || loadingSuppliers}
          options={supplierOptions}
          placeholder={loadingSuppliers ? 'Carregando...' : 'Selecione'}
          error={errors.supplierId?.message}
        />
      </div>

      {/* Custo unitário + Preço de venda */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Custo unitário (R$)"
          type="number"
          min={0}
          step="0.01"
          disabled={isSubmitting}
          placeholder="0"
          {...register('unitCost', { valueAsNumber: true })}
          error={errors.unitCost?.message}
        />
        <Input
          label="Preço de venda (R$)"
          type="number"
          min={0}
          step="0.01"
          disabled={isSubmitting || !isProduct}
          placeholder="0"
          {...register('salePrice', { valueAsNumber: true })}
          error={errors.salePrice?.message}
        />
      </div>

      {/* Estoque atual + Estoque mínimo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Estoque atual"
          type="number"
          min={0}
          disabled={isSubmitting}
          placeholder="0"
          {...register('currentStock', { valueAsNumber: true })}
          error={errors.currentStock?.message}
        />
        <Input
          label="Estoque mínimo"
          type="number"
          min={0}
          disabled={isSubmitting}
          placeholder="0"
          {...register('minStock', { valueAsNumber: true })}
          error={errors.minStock?.message}
        />
      </div>

      {/* Descrição */}
      <TextArea
        label="Descrição"
        disabled={isSubmitting}
        placeholder="Detalhes técnicos, observações..."
        rows={4}
        {...register('description')}
        error={errors.description?.message}
        inputClassName="resize-none"
      />

      <div className="mt-2">
        <FormActions
          submitLabel={submitLabel}
          loadingLabel={submittingLabel}
          isLoading={isSubmitting}
          onCancel={onCancel}
        />
      </div>
    </div>
  );

  return (
    <AuthCompanyGate user={user} showCompanySelect={showCompanySelect}>
      <form
        onSubmit={handleSubmit((data) => {
          const companyId = showCompanySelect ? data.companyId?.trim() : undefined;
          const category = data.category?.trim() || null;
          const sku = data.sku?.trim() || null;
          const supplierId = data.supplierId?.trim() || null;
          const description = data.description?.trim() || null;
          onSubmit({
            ...(companyId ? { companyId } : {}),
            sku,
            name: data.name.trim(),
            category,
            defaultUnit: data.defaultUnit,
            supplierId,
            unitCost: data.unitCost,
            salePrice: data.salePrice,
            currentStock: data.currentStock,
            minStock: data.minStock,
            isProduct: data.isProduct,
            description,
          });
        })}
      >
        {inDialog ? (
          fields
        ) : (
          <FormCardSection
            title="Dados do produto"
            description="Informe os dados do insumo ou produto."
          >
            {fields}
          </FormCardSection>
        )}
      </form>
    </AuthCompanyGate>
  );
}
