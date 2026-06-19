'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCompanyGate } from '@/shared/components/states/AuthCompanyGate';
import { useFormWithCompany } from '@/shared/hooks/useFormWithCompany';
import { FormActions, FormCardSection, Select, TextArea } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';
import type { CreateStockLocationData, UpdateStockLocationData } from '../types';
import {
  createStockFormSchema,
  updateStockFormSchema,
  stockLocationTypeOptions,
  stockLocationStatusOptions,
  type CreateStockFormData,
  type UpdateStockFormData,
} from '../schemas';

type StockFormProps =
  | {
      mode: 'create';
      onSubmit: (data: CreateStockLocationData) => void;
      onCancel?: () => void;
      isSubmitting?: boolean;
      submitLabel: string;
      submittingLabel: string;
      inDialog?: boolean;
    }
  | {
      mode: 'edit';
      initialValues: UpdateStockFormData;
      stockCode: string;
      onSubmit: (data: Omit<UpdateStockLocationData, 'id'>) => void;
      onCancel?: () => void;
      isSubmitting?: boolean;
      submitLabel: string;
      submittingLabel: string;
      inDialog?: boolean;
    };

function StockCreateForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
  inDialog,
}: Readonly<{
  onSubmit: (data: CreateStockLocationData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  inDialog?: boolean;
}>) {
  const { user, showCompanySelect, resolverSchema, loadingCompanies, companyOptions } =
    useFormWithCompany(createStockFormSchema);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateStockFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      companyId: '',
      code: '',
      name: '',
      type: 'deposito',
      location: '',
      responsible: '',
      notes: '',
      status: 'active',
    },
  });

  const fields = (
    <div className="space-y-5">
      {showCompanySelect ? (
        <Controller
          control={control}
          name="companyId"
          render={({ field }) => (
            <Select
              label="Empresa"
              required
              disabled={isSubmitting || loadingCompanies}
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
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Código"
          requiredIndicator
          type="text"
          disabled={isSubmitting}
          placeholder="Ex.: ARM-001"
          {...register('code')}
          error={errors.code?.message}
        />
        <Input
          label="Nome"
          requiredIndicator
          type="text"
          disabled={isSubmitting}
          placeholder="Ex.: Armazém Principal"
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              label="Tipo"
              required
              disabled={isSubmitting}
              options={stockLocationTypeOptions}
              placeholder="Selecione o tipo"
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={errors.type?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              label="Status"
              required
              disabled={isSubmitting}
              options={stockLocationStatusOptions}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={errors.status?.message}
            />
          )}
        />
      </div>

      <Input
        label="Localização"
        requiredIndicator
        type="text"
        disabled={isSubmitting}
        placeholder="Ex.: Galpão Norte, Setor B"
        {...register('location')}
        error={errors.location?.message}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Responsável"
          type="text"
          disabled={isSubmitting}
          placeholder="Nome do responsável"
          {...register('responsible')}
          error={errors.responsible?.message}
        />
        <Input
          label="Capacidade"
          type="number"
          step={0.01}
          min={0.01}
          disabled={isSubmitting}
          placeholder="Ex.: 5000"
          {...register('capacity', {
            valueAsNumber: true,
            setValueAs: (v: string) => (v === '' ? undefined : Number(v)),
          })}
          error={errors.capacity?.message}
        />
      </div>

      <TextArea
        label="Observações"
        disabled={isSubmitting}
        placeholder="Informações adicionais sobre este local (opcional)"
        rows={3}
        {...register('notes')}
        error={errors.notes?.message}
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
          const payload: CreateStockLocationData = {
            code: data.code.trim(),
            name: data.name.trim(),
            type: data.type,
            location: data.location.trim(),
            responsible: data.responsible?.trim() || null,
            capacity: data.capacity ?? null,
            status: data.status,
            notes: data.notes?.trim() || null,
          };
          if (showCompanySelect && data.companyId?.trim()) {
            payload.companyId = data.companyId.trim();
          }
          onSubmit(payload);
        })}
      >
        {inDialog ? (
          fields
        ) : (
          <FormCardSection
            title="Novo local de armazenamento"
            description="Preencha os dados para cadastrar um novo local de armazenamento."
          >
            {fields}
          </FormCardSection>
        )}
      </form>
    </AuthCompanyGate>
  );
}

function StockEditForm({
  initialValues,
  stockCode,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
  inDialog,
}: Readonly<{
  initialValues: UpdateStockFormData;
  stockCode: string;
  onSubmit: (data: Omit<UpdateStockLocationData, 'id'>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  inDialog?: boolean;
}>) {
  const {
    register,
    handleSubmit,
    reset,
    control,
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

  const fields = (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs text-slate-500">Código</p>
        <p className="text-sm font-medium text-slate-800">{stockCode}</p>
      </div>

      <Input
        label="Nome"
        requiredIndicator
        type="text"
        disabled={isSubmitting}
        placeholder="Ex.: Armazém Principal"
        {...register('name')}
        error={errors.name?.message}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              label="Tipo"
              required
              disabled={isSubmitting}
              options={stockLocationTypeOptions}
              placeholder="Selecione o tipo"
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={errors.type?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              label="Status"
              required
              disabled={isSubmitting}
              options={stockLocationStatusOptions}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={errors.status?.message}
            />
          )}
        />
      </div>

      <Input
        label="Localização"
        requiredIndicator
        type="text"
        disabled={isSubmitting}
        placeholder="Ex.: Galpão Norte, Setor B"
        {...register('location')}
        error={errors.location?.message}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Responsável"
          type="text"
          disabled={isSubmitting}
          placeholder="Nome do responsável"
          {...register('responsible')}
          error={errors.responsible?.message}
        />
        <Input
          label="Capacidade"
          type="number"
          step={0.01}
          min={0.01}
          disabled={isSubmitting}
          placeholder="Ex.: 5000"
          {...register('capacity', {
            valueAsNumber: true,
            setValueAs: (v: string) => (v === '' ? undefined : Number(v)),
          })}
          error={errors.capacity?.message}
        />
      </div>

      <TextArea
        label="Observações"
        disabled={isSubmitting}
        placeholder="Informações adicionais sobre este local (opcional)"
        rows={3}
        {...register('notes')}
        error={errors.notes?.message}
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
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit({
          code: stockCode,
          name: data.name.trim(),
          type: data.type,
          location: data.location.trim(),
          responsible: data.responsible?.trim() || null,
          capacity: data.capacity ?? null,
          status: data.status,
          notes: data.notes?.trim() || null,
        });
      })}
    >
      {inDialog ? (
        fields
      ) : (
        <FormCardSection
          title="Editar local de armazenamento"
          description="Atualize os dados deste local de armazenamento."
        >
          {fields}
        </FormCardSection>
      )}
    </form>
  );
}

export function StockForm(props: Readonly<StockFormProps>) {
  if (props.mode === 'edit') {
    return (
      <StockEditForm
        initialValues={props.initialValues}
        stockCode={props.stockCode}
        onSubmit={props.onSubmit}
        onCancel={props.onCancel}
        isSubmitting={props.isSubmitting}
        submitLabel={props.submitLabel}
        submittingLabel={props.submittingLabel}
        inDialog={props.inDialog}
      />
    );
  }

  return (
    <StockCreateForm
      onSubmit={props.onSubmit}
      onCancel={props.onCancel}
      isSubmitting={props.isSubmitting}
      submitLabel={props.submitLabel}
      submittingLabel={props.submittingLabel}
      inDialog={props.inDialog}
    />
  );
}
