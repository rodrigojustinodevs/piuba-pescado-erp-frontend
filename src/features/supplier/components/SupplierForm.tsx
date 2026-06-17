'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { FormActions, Select as ControlledSelect } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';
import { AuthCompanyGate } from '@/shared/components/states/AuthCompanyGate';
import { useCompanyOptions } from '@/shared/hooks/useCompanyOptions';
import { maskPhone } from '@/shared/utils/phoneMask';
import { maskCpfCnpj } from '@/shared/utils/documentMask';
import { addRequiredCompanyIssue } from '@/shared/utils/zod';
import type { CreateSupplierData } from '../types';
import {
  createSupplierFormSchema,
  supplierCategoryOptions,
  supplierStatusOptions,
  type CreateSupplierFormData,
} from '../schemas';

type SupplierFormProps = {
  initialValues?: CreateSupplierFormData;
  onSubmit: (data: CreateSupplierData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  inDialog?: boolean;
};

export function SupplierForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
  inDialog = false,
}: Readonly<SupplierFormProps>) {
  const { user, isMaster } = useAuthContext();
  const showCompanySelect = isMaster();

  const resolverSchema = useMemo(
    () =>
      createSupplierFormSchema.superRefine((data, ctx) => {
        if (showCompanySelect && !data.companyId?.trim()) {
          addRequiredCompanyIssue(ctx);
        }
      }),
    [showCompanySelect],
  );

  const { loadingCompanies, companyOptions } = useCompanyOptions(showCompanySelect);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateSupplierFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      companyId: '',
      name: '',
      tradeName: '',
      document: '',
      stateRegistration: '',
      contact: '',
      phone: '',
      email: '',
      category: undefined,
      paymentTerms: '',
      status: 'active',
      rating: undefined,
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const fields = (
    <div className="space-y-6">
      {showCompanySelect ? (
        <ControlledSelect
          label="Empresa"
          required
          disabled={isSubmitting || loadingCompanies}
          options={companyOptions}
          placeholder={loadingCompanies ? 'Carregando empresas...' : 'Selecione a empresa'}
          {...register('companyId')}
          error={errors.companyId?.message}
        />
      ) : null}

      {/* Dados gerais */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Dados gerais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Razão social"
              requiredIndicator
              type="text"
              disabled={isSubmitting}
              {...register('name')}
              error={errors.name?.message}
            />
          </div>
          <Input
            label="Nome fantasia"
            type="text"
            disabled={isSubmitting}
            {...register('tradeName')}
            error={errors.tradeName?.message}
          />
          <Input
            label="CPF/CNPJ"
            requiredIndicator
            type="text"
            disabled={isSubmitting}
            inputMode="numeric"
            placeholder="000.000.000-00"
            maxLength={18}
            {...register('document', {
              onChange: (event) => {
                event.target.value = maskCpfCnpj(event.target.value);
              },
            })}
            error={errors.document?.message}
          />
          <Input
            label="Inscrição estadual"
            type="text"
            disabled={isSubmitting}
            {...register('stateRegistration')}
            error={errors.stateRegistration?.message}
          />
        </div>
      </div>

      {/* Categoria/Comercial */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Categoria e comercial</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <ControlledSelect
                label="Categoria"
                disabled={isSubmitting}
                options={supplierCategoryOptions}
                placeholder="Selecione"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.category?.message}
              />
            )}
          />
          <Input
            label="Forma de pagamento"
            type="text"
            disabled={isSubmitting}
            placeholder="Ex.: 30/60/90 dias"
            {...register('paymentTerms')}
            error={errors.paymentTerms?.message}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <ControlledSelect
                label="Status"
                required
                disabled={isSubmitting}
                options={supplierStatusOptions}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.status?.message}
              />
            )}
          />
          <Input
            label="Avaliação (0-5)"
            type="number"
            min={0}
            max={5}
            step="0.1"
            disabled={isSubmitting}
            placeholder="0"
            {...register('rating', {
              setValueAs: (value) => (value === '' || value == null ? undefined : Number(value)),
            })}
            error={errors.rating?.message}
          />
        </div>
      </div>

      {/* Contato */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="Nome do contato"
            type="text"
            disabled={isSubmitting}
            {...register('contact')}
            error={errors.contact?.message}
          />
          <Input
            label="Telefone"
            requiredIndicator
            type="text"
            disabled={isSubmitting}
            inputMode="numeric"
            placeholder="(00) 00000-0000"
            maxLength={15}
            {...register('phone', {
              onChange: (event) => {
                event.target.value = maskPhone(event.target.value);
              },
            })}
            error={errors.phone?.message}
          />
          <div className="md:col-span-2">
            <Input
              label="E-mail"
              requiredIndicator
              type="email"
              disabled={isSubmitting}
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Rua"
            type="text"
            disabled={isSubmitting}
            {...register('address.street')}
            error={errors.address?.street?.message}
          />
          <Input
            label="Número"
            type="text"
            disabled={isSubmitting}
            {...register('address.number')}
            error={errors.address?.number?.message}
          />
          <Input
            label="Complemento"
            type="text"
            disabled={isSubmitting}
            {...register('address.complement')}
            error={errors.address?.complement?.message}
          />
          <Input
            label="Bairro"
            type="text"
            disabled={isSubmitting}
            {...register('address.neighborhood')}
            error={errors.address?.neighborhood?.message}
          />
          <Input
            label="Cidade"
            type="text"
            disabled={isSubmitting}
            {...register('address.city')}
            error={errors.address?.city?.message}
          />
          <Input
            label="Estado (UF)"
            type="text"
            maxLength={2}
            disabled={isSubmitting}
            {...register('address.state')}
            error={errors.address?.state?.message}
          />
          <Input
            label="CEP"
            type="text"
            disabled={isSubmitting}
            {...register('address.zipCode')}
            error={errors.address?.zipCode?.message}
          />
        </div>
      </div>

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
          onSubmit({
            ...(companyId ? { companyId } : {}),
            name: data.name.trim(),
            tradeName: data.tradeName?.trim() || null,
            document: data.document.replace(/\D/g, ''),
            stateRegistration: data.stateRegistration?.trim() || null,
            contact: data.contact?.trim() || null,
            phone: data.phone.trim(),
            email: data.email.trim(),
            category: data.category ?? null,
            paymentTerms: data.paymentTerms?.trim() || null,
            status: data.status,
            rating: data.rating ?? null,
            address: {
              street: data.address.street?.trim() || null,
              number: data.address.number?.trim() || null,
              complement: data.address.complement?.trim() || null,
              neighborhood: data.address.neighborhood?.trim() || null,
              city: data.address.city?.trim() || null,
              state: data.address.state?.trim() || null,
              zipCode: data.address.zipCode?.trim() || null,
            },
          });
        })}
      >
        {inDialog ? (
          fields
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-[#0F172A]">Dados do fornecedor</h2>
              <p className="mt-1 text-sm text-slate-600">
                Informe os dados de contato do fornecedor.
              </p>
            </div>
            {fields}
          </div>
        )}
      </form>
    </AuthCompanyGate>
  );
}
