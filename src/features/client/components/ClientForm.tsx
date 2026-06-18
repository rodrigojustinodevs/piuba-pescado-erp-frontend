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
import { FormActions, Select, TextArea } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';
import type { CreateClientData } from '../types';
import {
  clientPersonTypeValues,
  clientPriceGroupValues,
  clientStatusFormValues,
  createClientFormSchema,
  type CreateClientFormData,
} from '../schemas';

type ClientFormProps = {
  initialValues?: CreateClientFormData;
  onSubmit: (data: CreateClientData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
  inDialog?: boolean;
};

export function ClientForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Cadastrar',
  submittingLabel = 'Cadastrando...',
  inDialog = false,
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
      { value: clientPersonTypeValues[0], label: 'Pessoa Jurídica' },
      { value: clientPersonTypeValues[1], label: 'Pessoa Física' },
    ],
    [],
  );

  const segmentOptions = useMemo(
    () => [
      { value: clientPriceGroupValues[0], label: 'Varejo' },
      { value: clientPriceGroupValues[1], label: 'Atacado' },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { value: clientStatusFormValues[0], label: 'Ativo' },
      { value: clientStatusFormValues[1], label: 'Prospect' },
      { value: clientStatusFormValues[2], label: 'Inativo' },
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
      personType: clientPersonTypeValues[0],
      name: '',
      tradeName: '',
      documentNumber: '',
      contact: '',
      email: '',
      phone: '',
      priceGroup: clientPriceGroupValues[0],
      city: '',
      state: '',
      status: clientStatusFormValues[0],
      creditLimit: 0,
      notes: '',
      address: '',
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
            personType: data.personType,
            name: data.name.trim(),
            tradeName: data.tradeName?.trim() || null,
            documentNumber: data.documentNumber?.trim() || null,
            contact: data.contact?.trim() || null,
            email: data.email?.trim() || null,
            phone: data.phone?.trim() || null,
            priceGroup: data.priceGroup,
            city: data.city?.trim() || null,
            state: data.state?.trim().toUpperCase() || null,
            address: data.address?.trim() || null,
            status: data.status,
            creditLimit: credit,
            notes: data.notes?.trim() || null,
          });
        })}
      >
        <div className={inDialog ? 'space-y-4' : 'bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4'}>

          {/* Linha 1 — company select (apenas master) */}
          {showCompanySelect && (
            <div>
              <Select
                label="Empresa"
                disabled={isSubmitting || loadingCompanies}
                options={companyOptions}
                {...register('companyId')}
                error={errors.companyId?.message}
              />
            </div>
          )}

          {/* Linha 2 — Tipo + Razão Social */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo"
              required
              disabled={isSubmitting}
              options={personTypeOptions}
              {...register('personType')}
              error={errors.personType?.message}
            />
            <Input
              label="Razão Social"
              required
              type="text"
              disabled={isSubmitting}
              placeholder="Nome ou razão social"
              {...register('name')}
              error={errors.name?.message}
            />
          </div>

          {/* Linha 3 — Nome Fantasia + CNPJ */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome Fantasia"
              type="text"
              disabled={isSubmitting}
              placeholder="Nome fantasia"
              {...register('tradeName')}
              error={errors.tradeName?.message}
            />
            <Input
              label="CNPJ"
              required
              type="text"
              disabled={isSubmitting}
              placeholder="00.000.000/0000-00"
              inputMode="numeric"
              maxLength={18}
              {...register('documentNumber', {
                onChange: (e) => { e.target.value = maskCpfCnpj(e.target.value); },
              })}
              error={errors.documentNumber?.message}
            />
          </div>

          {/* Linha 4 — Contato + E-mail + Telefone */}
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Contato"
              type="text"
              disabled={isSubmitting}
              placeholder="Nome do contato"
              {...register('contact')}
              error={errors.contact?.message}
            />
            <Input
              label="E-mail"
              type="email"
              disabled={isSubmitting}
              placeholder="email@exemplo.com"
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
                onChange: (e) => { e.target.value = maskPhone(e.target.value); },
              })}
              error={errors.phone?.message}
            />
          </div>

          {/* Linha 5 — Segmento + Cidade + UF */}
          <div className="grid grid-cols-[1fr_1fr_80px] gap-4">
            <Select
              label="Segmento"
              required
              disabled={isSubmitting}
              options={segmentOptions}
              {...register('priceGroup')}
              error={errors.priceGroup?.message}
            />
            <Input
              label="Cidade"
              type="text"
              disabled={isSubmitting}
              placeholder="Fortaleza"
              {...register('city')}
              error={errors.city?.message}
            />
            <Input
              label="UF"
              type="text"
              disabled={isSubmitting}
              placeholder="CE"
              maxLength={2}
              className="uppercase"
              {...register('state')}
              error={errors.state?.message}
            />
          </div>

          {/* Linha 6 — Status + Limite de Crédito */}
          <div className="grid grid-cols-[1fr_1fr] gap-4">
            <Select
              label="Status"
              disabled={isSubmitting}
              options={statusOptions}
              {...register('status')}
              error={errors.status?.message}
            />
            <Input
              label="Limite de Crédito (R$)"
              type="number"
              step={0.01}
              min={0}
              disabled={isSubmitting}
              placeholder="0"
              {...register('creditLimit', { valueAsNumber: true })}
              error={errors.creditLimit?.message}
            />
          </div>

          {/* Linha 7 — Observações */}
          <TextArea
            label="Observações"
            disabled={isSubmitting}
            placeholder="Informações adicionais sobre o cliente..."
            rows={3}
            {...register('notes')}
            error={errors.notes?.message}
          />

          <FormActions
            submitLabel={submitLabel}
            loadingLabel={submittingLabel}
            isLoading={isSubmitting}
            onCancel={onCancel}
          />
        </div>
      </form>
    </AuthCompanyGate>
  );
}
