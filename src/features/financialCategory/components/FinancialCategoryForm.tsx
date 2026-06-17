'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { AuthCompanyGate } from '@/shared/components/states/AuthCompanyGate';
import { useCompanyOptions } from '@/shared/hooks/useCompanyOptions';
import { addRequiredCompanyIssue } from '@/shared/utils/zod';
import { FormActions, Select, TextArea } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';
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
  onCancel?: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
  submitLabel: string;
  submittingLabel: string;
  inDialog?: boolean;
};

export function FinancialCategoryForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isEdit = false,
  submitLabel,
  submittingLabel,
  inDialog = false,
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
    control,
    formState: { errors },
  } = useForm<CreateFinancialCategoryFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      companyId: '',
      name: '',
      notes: '',
      type: financialCategoryTypeValues[0],
      status: financialCategoryStatusValues[0],
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const handleFormSubmit = handleSubmit((data) => {
    const companyId = showCompanySelect ? data.companyId?.trim() : undefined;
    onSubmit({
      ...(companyId ? { companyId } : {}),
      name: data.name.trim(),
      notes: data.notes?.trim() || undefined,
      type: data.type,
      status: data.status,
    });
  });

  const companyField = showCompanySelect ? (
    <Controller
      control={control}
      name="companyId"
      render={({ field }) => (
        <Select
          label="Empresa"
          required
          disabled={isSubmitting || loadingCompanies || isEdit}
          options={companyOptions}
          placeholder={loadingCompanies ? 'Carregando empresas...' : 'Selecione a empresa'}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          name={field.name}
          error={errors.companyId?.message}
        />
      )}
    />
  ) : null;

  const typeField = (
    <Controller
      control={control}
      name="type"
      render={({ field }) => (
        <Select
          label="Tipo"
          required
          disabled={isSubmitting}
          options={typeOptions}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          name={field.name}
          error={errors.type?.message}
        />
      )}
    />
  );

  const statusField = (
    <Controller
      control={control}
      name="status"
      render={({ field }) => (
        <Select
          label="Status"
          required
          disabled={isSubmitting || isEdit}
          options={statusOptions}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          name={field.name}
          error={errors.status?.message}
        />
      )}
    />
  );

  const nameField = (
    <Input
      label="Nome"
      requiredIndicator
      type="text"
      disabled={isSubmitting}
      placeholder="Ex.: Venda de Tilápia"
      {...register('name')}
      error={errors.name?.message}
    />
  );

  const notesField = (
    <TextArea
      label="Descrição"
      disabled={isSubmitting}
      placeholder="Descrição opcional da categoria..."
      rows={inDialog ? 2 : 3}
      {...register('notes')}
      error={errors.notes?.message}
    />
  );

  const formContent = inDialog ? (
    <form onSubmit={handleFormSubmit}>
      <div className="space-y-4 py-2">
        {companyField}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nameField}
          {typeField}
        </div>
        {notesField}
        {statusField}
        <FormActions
          submitLabel={submitLabel}
          loadingLabel={submittingLabel}
          isLoading={isSubmitting}
          onCancel={onCancel}
        />
      </div>
    </form>
  ) : (
    <form onSubmit={handleFormSubmit}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Dados da categoria</h2>
          <p className="mt-1 text-sm text-slate-600">
            Informe nome, tipo e status da categoria financeira.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companyField}
          {nameField}
          {typeField}
          {statusField}
        </div>

        <div className="mt-4">{notesField}</div>

        <div className="mt-8">
          <FormActions
            submitLabel={submitLabel}
            loadingLabel={submittingLabel}
            isLoading={isSubmitting}
            onCancel={onCancel}
          />
        </div>
      </div>
    </form>
  );

  return (
    <AuthCompanyGate user={user} showCompanySelect={showCompanySelect}>
      {formContent}
    </AuthCompanyGate>
  );
}
