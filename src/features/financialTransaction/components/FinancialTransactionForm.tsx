'use client';

import { useEffect, useMemo } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCompanyGate } from '@/shared/components/states/AuthCompanyGate';
import { useFormWithCompany } from '@/shared/hooks/useFormWithCompany';
import { FormActions, FormCardSection, Select, TextArea } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';
import type { CreateFinancialTransactionData } from '../types';
import {
  createFinancialTransactionFormSchema,
  transactionMethodValues,
  transactionStatusValues,
  transactionTypeValues,
  type CreateFinancialTransactionFormData,
} from '../schemas';
import { useFinancialCategories } from '@/features/financialCategory/hooks/useFinancialCategories';

type Props = {
  initialValues?: CreateFinancialTransactionFormData;
  onSubmit: (data: CreateFinancialTransactionData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
  submitLabel: string;
  submittingLabel: string;
  inDialog?: boolean;
};

const TYPE_OPTIONS = [
  { value: transactionTypeValues[0], label: 'Receita' },
  { value: transactionTypeValues[1], label: 'Despesa' },
  { value: transactionTypeValues[2], label: 'Transferência' },
  { value: transactionTypeValues[3], label: 'Investimento' },
];

const STATUS_OPTIONS = [
  { value: transactionStatusValues[0], label: 'Pago' },
  { value: transactionStatusValues[1], label: 'Pendente' },
  { value: transactionStatusValues[2], label: 'Atrasado' },
  { value: transactionStatusValues[3], label: 'Cancelado' },
];

const METHOD_OPTIONS = [
  { value: '', label: 'Não informado' },
  { value: transactionMethodValues[0], label: 'Boleto' },
  { value: transactionMethodValues[1], label: 'PIX' },
  { value: transactionMethodValues[2], label: 'Transferência Bancária' },
  { value: transactionMethodValues[3], label: 'Cartão de Crédito' },
  { value: transactionMethodValues[4], label: 'Cartão de Débito' },
  { value: transactionMethodValues[5], label: 'Dinheiro' },
  { value: transactionMethodValues[6], label: 'Cheque' },
];

export function FinancialTransactionForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isEdit = false,
  submitLabel,
  submittingLabel,
  inDialog = false,
}: Readonly<Props>) {
  const { user, showCompanySelect, resolverSchema, loadingCompanies, companyOptions } =
    useFormWithCompany(createFinancialTransactionFormSchema);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateFinancialTransactionFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      companyId: '',
      type: 'expense',
      status: 'pending',
      method: undefined,
      amount: 0,
      dueDate: '',
      paymentDate: '',
      description: '',
      notes: '',
      categoryId: '',
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const selectedCompanyId = useWatch({ control, name: 'companyId' });
  const { data: categoriesData, isLoading: loadingCategories } = useFinancialCategories({
    limit: 100,
    companyId: showCompanySelect ? selectedCompanyId : undefined,
    enabled: showCompanySelect ? !!selectedCompanyId?.trim() : true,
  });
  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'Sem categoria' },
      ...(categoriesData?.financialCategories ?? []).map((c) => ({ value: c.id, label: c.name })),
    ],
    [categoriesData],
  );

  const handleFormSubmit = handleSubmit((data) => {
    const companyId = showCompanySelect ? data.companyId?.trim() : undefined;
    onSubmit({
      ...(companyId ? { companyId } : {}),
      type: data.type,
      status: data.status,
      method: data.method || undefined,
      amount: data.amount,
      dueDate: data.dueDate || undefined,
      paymentDate: data.paymentDate || undefined,
      description: data.description?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      categoryId: data.categoryId?.trim() || undefined,
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
          disabled={isSubmitting || isEdit}
          options={TYPE_OPTIONS}
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
          disabled={isSubmitting}
          options={STATUS_OPTIONS}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          name={field.name}
          error={errors.status?.message}
        />
      )}
    />
  );

  const methodField = (
    <Controller
      control={control}
      name="method"
      render={({ field }) => (
        <Select
          label="Forma de Pagamento"
          disabled={isSubmitting}
          options={METHOD_OPTIONS}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          name={field.name}
          error={errors.method?.message}
        />
      )}
    />
  );

  const categoryField = (
    <Controller
      control={control}
      name="categoryId"
      render={({ field }) => (
        <Select
          label="Categoria"
          disabled={isSubmitting || loadingCategories}
          options={categoryOptions}
          placeholder={loadingCategories ? 'Carregando categorias...' : 'Selecione a categoria'}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          name={field.name}
          error={errors.categoryId?.message}
        />
      )}
    />
  );

  const amountField = (
    <Input
      label="Valor (R$)"
      requiredIndicator
      type="number"
      step="0.01"
      min="0"
      disabled={isSubmitting}
      placeholder="0,00"
      {...register('amount', { valueAsNumber: true })}
      error={errors.amount?.message}
    />
  );

  const dueDateField = (
    <Input
      label="Data de Vencimento"
      type="date"
      disabled={isSubmitting}
      {...register('dueDate')}
      error={errors.dueDate?.message}
    />
  );

  const paymentDateField = (
    <Input
      label="Data de Pagamento"
      type="date"
      disabled={isSubmitting}
      {...register('paymentDate')}
      error={errors.paymentDate?.message}
    />
  );

  const descriptionField = (
    <Input
      label="Descrição"
      type="text"
      disabled={isSubmitting}
      placeholder="Ex.: Pagamento de fornecedor"
      {...register('description')}
      error={errors.description?.message}
    />
  );

  const notesField = (
    <TextArea
      label="Observações"
      disabled={isSubmitting}
      placeholder="Informações adicionais..."
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
          {typeField}
          {statusField}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {amountField}
          {methodField}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dueDateField}
          {paymentDateField}
        </div>
        {categoryField}
        {descriptionField}
        {notesField}
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
      <FormCardSection
        title="Dados da transação"
        description="Informe tipo, valor, datas e método de pagamento."
        footer={
          <FormActions
            submitLabel={submitLabel}
            loadingLabel={submittingLabel}
            isLoading={isSubmitting}
            onCancel={onCancel}
          />
        }
      >
        <div className="space-y-4">
          {companyField}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {typeField}
            {statusField}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {amountField}
            {methodField}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dueDateField}
            {paymentDateField}
          </div>
          {categoryField}
          {descriptionField}
          {notesField}
        </div>
      </FormCardSection>
    </form>
  );

  return (
    <AuthCompanyGate user={user} showCompanySelect={showCompanySelect}>
      {formContent}
    </AuthCompanyGate>
  );
}
