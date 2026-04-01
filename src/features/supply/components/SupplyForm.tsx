'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { AuthCompanyGate } from '@/shared/components/states/AuthCompanyGate';
import { useCompanyOptions } from '@/shared/hooks/useCompanyOptions';
import { addRequiredCompanyIssue } from '@/shared/utils/zod';
import { FormActions } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';
import type { CreateSupplyData } from '../types';
import {
  createSupplyFormSchema,
  supplyDefaultUnitValues,
  type CreateSupplyFormData,
} from '../schemas';

type SupplyFormProps = {
  initialValues?: CreateSupplyFormData;
  onSubmit: (data: CreateSupplyData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
};

export function SupplyForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
}: Readonly<SupplyFormProps>) {
  const { user, isMaster } = useAuthContext();
  const showCompanySelect = isMaster();

  const resolverSchema = useMemo(
    () =>
      createSupplyFormSchema.superRefine((data, ctx) => {
        if (showCompanySelect && !data.companyId?.trim()) {
          addRequiredCompanyIssue(ctx);
        }
      }),
    [showCompanySelect],
  );

  const { loadingCompanies, companyOptions } = useCompanyOptions(showCompanySelect);
  const defaultUnitOptions = useMemo(
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
    formState: { errors },
  } = useForm<CreateSupplyFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      companyId: '',
      name: '',
      category: '',
      defaultUnit: supplyDefaultUnitValues[0],
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  return (
    <AuthCompanyGate user={user} showCompanySelect={showCompanySelect}>
      <form
        onSubmit={handleSubmit((data) => {
          const companyId = showCompanySelect ? data.companyId?.trim() : undefined;
          const category = data.category?.trim();
          onSubmit({
            ...(companyId ? { companyId } : {}),
            name: data.name.trim(),
            category: category ? category : null,
            defaultUnit: data.defaultUnit.trim(),
          });
        })}
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#0F172A]">Dados do produto</h2>
            <p className="mt-1 text-sm text-slate-600">Informe nome, categoria e unidade padrão.</p>
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

            <Input
              label="Nome"
              requiredIndicator
              type="text"
              disabled={isSubmitting}
              placeholder="Ex.: Ração 40%"
              {...register('name')}
              error={errors.name?.message}
            />

            <Input
              label="Categoria"
              type="text"
              disabled={isSubmitting}
              placeholder="Ex.: Alimentação"
              {...register('category')}
              error={errors.category?.message}
            />

            <Select
              label="Unidade padrão"
              requiredIndicator
              disabled={isSubmitting}
              options={defaultUnitOptions}
              {...register('defaultUnit')}
              error={errors.defaultUnit?.message}
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
    </AuthCompanyGate>
  );
}
