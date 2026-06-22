'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCompanyGate } from '@/shared/components/states/AuthCompanyGate';
import { useFormWithCompany } from '@/shared/hooks/useFormWithCompany';
import { FormActions, FormCardSection, ControlledSelect, TextArea } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';
import type { CreateStockLocationData, UpdateStockLocationData } from '../types';
import {
  createStockFormSchema,
  stockLocationTypeOptions,
  stockLocationStatusOptions,
  type CreateStockFormData,
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
      initialValues: CreateStockFormData;
      stockCode: string;
      onSubmit: (data: Omit<UpdateStockLocationData, 'id'>) => void;
      onCancel?: () => void;
      isSubmitting?: boolean;
      submitLabel: string;
      submittingLabel: string;
      inDialog?: boolean;
    };

export function StockForm(props: Readonly<StockFormProps>) {
  const isEdit = props.mode === 'edit';
  const isSubmitting = props.isSubmitting ?? false;

  const { user, showCompanySelect, resolverSchema, loadingCompanies, companyOptions } =
    useFormWithCompany(createStockFormSchema);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateStockFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: isEdit
      ? props.initialValues
      : {
          companyId: '',
          code: '',
          name: '',
          type: undefined,
          location: '',
          responsible: '',
          notes: '',
          status: 'active',
        },
  });

  useEffect(() => {
    if (isEdit) reset(props.initialValues);
  }, [isEdit, props, reset]);

  const sharedFields = (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ControlledSelect
          control={control}
          name="type"
          label="Tipo"
          required
          disabled={isSubmitting}
          options={stockLocationTypeOptions}
          placeholder="Selecione o tipo"
          error={errors.type?.message}
        />
        <ControlledSelect
          control={control}
          name="status"
          label="Status"
          required
          disabled={isSubmitting}
          options={stockLocationStatusOptions}
          error={errors.status?.message}
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
    </>
  );

  const fields = (
    <div className="space-y-5">
      {isEdit ? (
        <>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-500">Código</p>
            <p className="text-sm font-medium text-slate-800">{props.stockCode}</p>
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
        </>
      ) : (
        <>
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
        </>
      )}

      {sharedFields}

      <div className="mt-2">
        <FormActions
          submitLabel={props.submitLabel}
          loadingLabel={props.submittingLabel}
          isLoading={isSubmitting}
          onCancel={props.onCancel}
        />
      </div>
    </div>
  );

  const cardTitle = isEdit ? 'Editar local de armazenamento' : 'Novo local de armazenamento';
  const cardDescription = isEdit
    ? 'Atualize os dados deste local de armazenamento.'
    : 'Preencha os dados para cadastrar um novo local de armazenamento.';

  const form = (
    <form
      onSubmit={handleSubmit((data) => {
        const base = {
          name: data.name.trim(),
          type: data.type,
          location: data.location.trim(),
          responsible: data.responsible?.trim() || null,
          capacity: data.capacity ?? null,
          status: data.status,
          notes: data.notes?.trim() || null,
        };
        if (isEdit) {
          props.onSubmit({ ...base, code: props.stockCode });
        } else {
          const payload: CreateStockLocationData = { ...base, code: data.code.trim() };
          if (showCompanySelect && data.companyId?.trim()) {
            payload.companyId = data.companyId.trim();
          }
          props.onSubmit(payload);
        }
      })}
    >
      {props.inDialog ? (
        fields
      ) : (
        <FormCardSection title={cardTitle} description={cardDescription}>
          {fields}
        </FormCardSection>
      )}
    </form>
  );

  if (isEdit) return form;

  return (
    <AuthCompanyGate user={user} showCompanySelect={showCompanySelect}>
      {form}
    </AuthCompanyGate>
  );
}
