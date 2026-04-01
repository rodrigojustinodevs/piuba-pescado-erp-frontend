'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { AuthCompanyGate } from '@/shared/components/states/AuthCompanyGate';
import { useCompanyOptions } from '@/shared/hooks/useCompanyOptions';
import { withRequiredCompany } from '@/shared/utils/zod';
import { maskCpfCnpj } from '@/shared/utils/documentMask';
import { maskPhone } from '@/shared/utils/phoneMask';
import { FormActions } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';
import type { FormSubmitProps } from '@/shared/components/form/types';
import type { CreateClientData } from '../types';
import {
  clientPersonTypeValues,
  clientPriceGroupValues,
  createClientFormSchema,
  type CreateClientFormData,
} from '../schemas';

type ClientFormProps = FormSubmitProps & {
  initialValues?: CreateClientFormData;
  onSubmit: (data: CreateClientData) => void;
};

export function ClientForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
}: Readonly<ClientFormProps>) {
  const { user, isMaster } = useAuthContext();
  const showCompanySelect = isMaster();

  const resolverSchema = useMemo(
    () => withRequiredCompany(createClientFormSchema, showCompanySelect),
    [showCompanySelect],
  );

  const { loadingCompanies, companyOptions } = useCompanyOptions(showCompanySelect);

  const personTypeOptions = useMemo(
    () => [
      { value: clientPersonTypeValues[0], label: 'Pessoa jurídica' },
      { value: clientPersonTypeValues[1], label: 'Pessoa física' },
    ],
    [],
  );
  const priceGroupOptions = useMemo(
    () => [
      { value: clientPriceGroupValues[0], label: 'Varejo' },
      { value: clientPriceGroupValues[1], label: 'Atacado' },
    ],
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      companyId: '',
      name: '',
      personType: clientPersonTypeValues[0],
      documentNumber: '',
      email: '',
      phone: '',
      contact: '',
      address: '',
      creditLimit: 0,
      priceGroup: clientPriceGroupValues[0],
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
          const credit =
            data.creditLimit == null || !Number.isFinite(data.creditLimit) || data.creditLimit <= 0
              ? null
              : data.creditLimit;

          onSubmit({
            ...(companyId ? { companyId } : {}),
            name: data.name.trim(),
            personType: data.personType,
            documentNumber: data.documentNumber?.trim() ? data.documentNumber.trim() : null,
            email: data.email?.trim() ? data.email.trim() : null,
            phone: data.phone?.trim() ? data.phone.trim() : null,
            contact: data.contact?.trim() ? data.contact.trim() : null,
            address: data.address?.trim() ? data.address.trim() : null,
            creditLimit: credit,
            priceGroup: data.priceGroup,
          });
        })}
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#0F172A]">Dados do cliente</h2>
            <p className="mt-1 text-sm text-slate-600">Cadastro de clientes pessoa física ou jurídica.</p>
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

            <Select
              label="Tipo de pessoa"
              requiredIndicator
              disabled={isSubmitting}
              options={personTypeOptions}
              {...register('personType')}
              error={errors.personType?.message}
            />

            <Input
              label="Documento"
              type="text"
              disabled={isSubmitting}
              placeholder="CPF/CNPJ"
              inputMode="numeric"
              maxLength={18}
              {...register('documentNumber', {
                onChange: (event) => {
                  event.target.value = maskCpfCnpj(event.target.value);
                },
              })}
              error={errors.documentNumber?.message}
            />

            <Input
              label="E-mail"
              type="email"
              disabled={isSubmitting}
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Telefone"
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
              label="Contato"
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
              label="Endereço"
              type="text"
              disabled={isSubmitting}
              {...register('address')}
              error={errors.address?.message}
            />

            <Input
              label="Limite de crédito"
              type="number"
              step={0.01}
              min={0}
              disabled={isSubmitting}
              {...register('creditLimit', { valueAsNumber: true })}
              error={errors.creditLimit?.message}
            />

            <Select
              label="Grupo de preço"
              requiredIndicator
              disabled={isSubmitting}
              options={priceGroupOptions}
              {...register('priceGroup')}
              error={errors.priceGroup?.message}
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

