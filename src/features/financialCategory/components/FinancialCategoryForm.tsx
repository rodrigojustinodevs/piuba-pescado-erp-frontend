'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { AuthCompanyGate } from '@/shared/components/states/AuthCompanyGate';
import { useCompanyOptions } from '@/shared/hooks/useCompanyOptions';
import { addRequiredCompanyIssue } from '@/shared/utils/zod';
import { FormActions } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';
import type { CreateFinancialCategoryData } from '../types';
import {
  createFinancialCategoryFormSchema,
  financialCategoryStatusValues,
  financialCategoryTypeValues,
  type CreateFinancialCategoryFormData,
} from '../schemas';

type FinancialCategoryFormProps = {
  initialValues?: CreateFinancialCategoryFormData;
  onSubmit: (data: CreateFinancialCategoryData) => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
  submitLabel: string;
  submittingLabel: string;
};

export function FinancialCategoryForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  submitLabel,
  submittingLabel,
}: Readonly<FinancialCategoryFormProps>) {
  const { user, isMaster } = useAuthContext();
  const showCompanySelect = isMaster();

  const resolverSchema = useMemo(
    () =>
      createFinancialCategoryFormSchema.superRefine((data, ctx) => {
        if (showCompanySelect && !data.companyId?.trim()) {
          addRequiredCompanyIssue(ctx);
        }
      }),
    [showCompanySelect],
  );

  const { loadingCompanies, companyOptions } = useCompanyOptions(showCompanySelect);

  const typeOptions = useMemo(
    () => [
      { value: financialCategoryTypeValues[0], label: 'Receita' },
      { value: financialCategoryTypeValues[1], label: 'Despesa' },
      { value: financialCategoryTypeValues[2], label: 'Investimento' },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { value: financialCategoryStatusValues[0], label: 'Ativo' },
      { value: financialCategoryStatusValues[1], label: 'Inativo' },
    ],
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFinancialCategoryFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      companyId: '',
      name: '',
      type: financialCategoryTypeValues[0],
      status: financialCategoryStatusValues[0],
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
          onSubmit({
            ...(companyId ? { companyId } : {}),
            name: data.name.trim(),
            type: data.type,
            status: data.status,
          });
        })}
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#0F172A]">Dados da categoria</h2>
            <p className="mt-1 text-sm text-slate-600">
              Informe nome, tipo e status da categoria financeira.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showCompanySelect ? (
              <Select
                label="Empresa"
                requiredIndicator
                disabled={isSubmitting || loadingCompanies || isEdit}
                options={companyOptions}
                placeholder={loadingCompanies ? 'Carregando empresas...' : 'Selecione a empresa'}
                {...register('companyId')}
                error={errors.companyId?.message}
              />
            ) : null}

            <Input
              label="Nome"
              requiredIndicator
              type="text"
              disabled={isSubmitting}
              placeholder="Ex.: Venda de Tilápia"
              {...register('name')}
              error={errors.name?.message}
            />

            <Select
              label="Tipo"
              requiredIndicator
              disabled={isSubmitting}
              options={typeOptions}
              {...register('type')}
              error={errors.type?.message}
            />

            <Select
              label="Status"
              requiredIndicator
              disabled={isSubmitting || isEdit}
              options={statusOptions}
              {...register('status')}
              error={errors.status?.message}
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
