'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCompanies } from '@/features/company';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { FormActions } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';
import { maskPhone } from '@/shared/utils/phoneMask';
import { addRequiredCompanyIssue } from '@/shared/utils/zod';
import type { CreateSupplierData } from '../types';
import { createSupplierFormSchema, type CreateSupplierFormData } from '../schemas';

type SupplierFormProps = {
  initialValues?: CreateSupplierFormData;
  onSubmit: (data: CreateSupplierData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
};

export function SupplierForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
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
    reset,
    formState: { errors },
  } = useForm<CreateSupplierFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      companyId: '',
      name: '',
      contact: '',
      phone: '',
      email: '',
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

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
        onSubmit({
          ...(companyId ? { companyId } : {}),
          name: data.name.trim(),
          contact: data.contact.trim(),
          phone: data.phone.trim(),
          email: data.email.trim(),
        });
      })}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Dados do fornecedor</h2>
          <p className="mt-1 text-sm text-slate-600">
            Informe os dados de contato do fornecedor.
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

          <Input
            label="Nome"
            requiredIndicator
            type="text"
            disabled={isSubmitting}
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="Contato"
            requiredIndicator
            type="text"
            disabled={isSubmitting}
            inputMode="numeric"
            placeholder="(00) 00000-0000"
            maxLength={15}
            {...register('contact', {
              onChange: (event) => {
                event.target.value = maskPhone(event.target.value);
              },
            })}
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

          <Input
            label="E-mail"
            requiredIndicator
            type="email"
            disabled={isSubmitting}
            {...register('email')}
            error={errors.email?.message}
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
