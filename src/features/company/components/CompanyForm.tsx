'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCompanySchema, type CreateCompanyFormData } from '../schemas';
import type { Company } from '../types';

interface CompanyFormProps {
  initialData?: Company;
  onSubmit: (data: CreateCompanyFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  totalSteps?: number;
  isEditMode?: boolean;
}

export function CompanyForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Salvar',
  currentStep,
  onStepChange,
  totalSteps,
  isEditMode = false,
}: CompanyFormProps) {
  const baseInputClass =
    'peer w-full rounded-lg border border-slate-200 bg-white px-4 pt-6 pb-2 text-sm text-[#0F172A] placeholder:text-transparent focus:border-[#0EA5A4] focus:outline-none';
  const getInputClass = (hasError?: boolean) =>
    `${baseInputClass} ${hasError ? 'border-red-500 focus:border-red-500' : ''}`;

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCompanySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          cnpj: initialData.cnpj,
          email: initialData.email,
          phone: initialData.phone,
          address: {
            street: initialData.address.street,
            number: initialData.address.number,
            complement: initialData.address.complement,
            neighborhood: initialData.address.neighborhood,
            city: initialData.address.city,
            state: initialData.address.state,
            zipCode: initialData.address.zipCode,
          },
          active: initialData.active,
        }
      : {
          active: true,
        },
  });
  const isStepMode =
    currentStep !== undefined && onStepChange !== undefined && totalSteps !== undefined;
  const isLastStep = isStepMode ? currentStep === totalSteps : true;

  const handleStepSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isStepMode) {
      return handleSubmit(onSubmit)(event);
    }

    const fieldsByStep: Record<number, string[]> = {
      1: ['name', 'cnpj'],
      2: ['email', 'phone'],
      3: [
        'address.street',
        'address.number',
        'address.neighborhood',
        'address.city',
        'address.state',
        'address.zipCode',
      ],
    };

    if (isLastStep) {
      return handleSubmit(onSubmit)(event);
    }

    const fieldsToValidate = fieldsByStep[currentStep] ?? [];
    const isValid = await trigger(fieldsToValidate as never[]);
    if (isValid) {
      onStepChange(currentStep + 1);
    }
  };

  // Edit mode layout (two columns)
  if (isEditMode) {
    return (
      <form onSubmit={handleStepSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column: Informações Básicas */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[#0F172A]">Informações Básicas</h2>

            <div className="space-y-4">
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  placeholder=" "
                  {...register('name')}
                  className={getInputClass(!!errors.name)}
                />
                <label
                  htmlFor="name"
                  className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
                >
                  Nome da Empresa *
                </label>
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>

              <div className="relative">
                <input
                  id="cnpj"
                  type="text"
                  placeholder=" "
                  {...register('cnpj')}
                  className={getInputClass(!!errors.cnpj)}
                />
                <label
                  htmlFor="cnpj"
                  className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
                >
                  CNPJ *
                </label>
                {errors.cnpj && <p className="mt-1 text-xs text-red-600">{errors.cnpj.message}</p>}
              </div>

              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  {...register('email')}
                  className={getInputClass(!!errors.email)}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
                >
                  E-mail
                </label>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  id="phone"
                  type="text"
                  placeholder=" "
                  {...register('phone')}
                  className={getInputClass(!!errors.phone)}
                />
                <label
                  htmlFor="phone"
                  className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
                >
                  Telefone
                </label>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Status Section */}
              <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Empresa ativa</p>
                    <p className="text-xs text-slate-500">Unidade disponível para monitoramento.</p>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    id="active"
                    type="checkbox"
                    {...register('active')}
                    className="sr-only peer"
                  />
                  <span className="relative h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-[#0EA5A4]">
                    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Endereço */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-[#0EA5A4]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h2 className="text-base font-semibold text-[#0F172A]">Endereço</h2>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  id="zipCode"
                  type="text"
                  placeholder=" "
                  {...register('address.zipCode')}
                  className={getInputClass(!!errors.address?.zipCode)}
                />
                <label
                  htmlFor="zipCode"
                  className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
                >
                  CEP *
                </label>
                {errors.address?.zipCode && (
                  <p className="mt-1 text-xs text-red-600">{errors.address.zipCode.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  id="street"
                  type="text"
                  placeholder=" "
                  {...register('address.street')}
                  className={getInputClass(!!errors.address?.street)}
                />
                <label
                  htmlFor="street"
                  className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
                >
                  Rua *
                </label>
                {errors.address?.street && (
                  <p className="mt-1 text-xs text-red-600">{errors.address.street.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  id="number"
                  type="text"
                  placeholder=" "
                  {...register('address.number')}
                  className={getInputClass(!!errors.address?.number)}
                />
                <label
                  htmlFor="number"
                  className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
                >
                  Número
                </label>
                {errors.address?.number && (
                  <p className="mt-1 text-xs text-red-600">{errors.address.number.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  id="neighborhood"
                  type="text"
                  placeholder=" "
                  {...register('address.neighborhood')}
                  className={getInputClass(!!errors.address?.neighborhood)}
                />
                <label
                  htmlFor="neighborhood"
                  className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
                >
                  Bairro
                </label>
                {errors.address?.neighborhood && (
                  <p className="mt-1 text-xs text-red-600">{errors.address.neighborhood.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  id="complement"
                  type="text"
                  placeholder=" "
                  {...register('address.complement')}
                  className={getInputClass()}
                />
                <label
                  htmlFor="complement"
                  className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
                >
                  Complemento
                </label>
              </div>

              <div className="relative">
                <input
                  id="city"
                  type="text"
                  placeholder=" "
                  {...register('address.city')}
                  className={getInputClass(!!errors.address?.city)}
                />
                <label
                  htmlFor="city"
                  className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
                >
                  Cidade
                </label>
                {errors.address?.city && (
                  <p className="mt-1 text-xs text-red-600">{errors.address.city.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  id="state"
                  type="text"
                  maxLength={2}
                  placeholder=" "
                  {...register('address.state')}
                  className={`${getInputClass(!!errors.address?.state)} uppercase`}
                />
                <label
                  htmlFor="state"
                  className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
                >
                  Estado
                </label>
                {errors.address?.state && (
                  <p className="mt-1 text-xs text-red-600">{errors.address.state.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-start gap-3 border-t border-slate-200 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-[#0EA5A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading && (
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
            {isLoading ? 'Salvando...' : submitLabel}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  // Step mode or default layout
  return (
    <form onSubmit={handleStepSubmit} className="space-y-6">
      {(!isStepMode || currentStep === 1) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0EA5A4]/10 text-xs font-semibold text-[#0EA5A4]">
              1
            </span>
            <h3 className="text-base font-semibold text-[#0F172A]">Empresa</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <input
                id="name"
                type="text"
                placeholder=" "
                {...register('name')}
                className={getInputClass(!!errors.name)}
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
              >
                Nome/Razão social *
              </label>
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div className="relative">
              <input
                id="cnpj"
                type="text"
                placeholder=" "
                {...register('cnpj')}
                className={getInputClass(!!errors.cnpj)}
              />
              <label
                htmlFor="cnpj"
                className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
              >
                CNPJ *
              </label>
              <p className="mt-1 text-xs text-slate-400">00.000.000/0000-00</p>
              {errors.cnpj && <p className="mt-1 text-xs text-red-600">{errors.cnpj.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-[#0F172A]">Status da Empresa</p>
              <p className="text-xs text-slate-500">
                Essa unidade estará disponível para monitoramento.
              </p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input id="active" type="checkbox" {...register('active')} className="sr-only peer" />
              <span className="text-sm text-slate-600">Empresa ativa</span>
              <span className="relative h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-[#0EA5A4]">
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
          </div>
        </div>
      )}

      {(!isStepMode || currentStep === 2) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
              2
            </span>
            <h3 className="text-base font-semibold text-[#0F172A]">Contato</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder=" "
                {...register('email')}
                className={getInputClass(!!errors.email)}
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
              >
                E-mail *
              </label>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <input
                id="phone"
                type="text"
                placeholder=" "
                {...register('phone')}
                className={getInputClass(!!errors.phone)}
              />
              <label
                htmlFor="phone"
                className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
              >
                Telefone *
              </label>
              <p className="mt-1 text-xs text-slate-400">(00) 00000-0000</p>
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>
          </div>
        </div>
      )}

      {(!isStepMode || currentStep === 3) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
              3
            </span>
            <h3 className="text-base font-semibold text-[#0F172A]">Localização</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative md:col-span-2">
              <input
                id="street"
                type="text"
                placeholder=" "
                {...register('address.street')}
                className={getInputClass(!!errors.address?.street)}
              />
              <label
                htmlFor="street"
                className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
              >
                Rua *
              </label>
              {errors.address?.street && (
                <p className="mt-1 text-xs text-red-600">{errors.address.street.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                id="number"
                type="text"
                placeholder=" "
                {...register('address.number')}
                className={getInputClass(!!errors.address?.number)}
              />
              <label
                htmlFor="number"
                className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
              >
                Número *
              </label>
              {errors.address?.number && (
                <p className="mt-1 text-xs text-red-600">{errors.address.number.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                id="complement"
                type="text"
                placeholder=" "
                {...register('address.complement')}
                className={getInputClass()}
              />
              <label
                htmlFor="complement"
                className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
              >
                Complemento
              </label>
            </div>

            <div className="relative">
              <input
                id="neighborhood"
                type="text"
                placeholder=" "
                {...register('address.neighborhood')}
                className={getInputClass(!!errors.address?.neighborhood)}
              />
              <label
                htmlFor="neighborhood"
                className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
              >
                Bairro *
              </label>
              {errors.address?.neighborhood && (
                <p className="mt-1 text-xs text-red-600">{errors.address.neighborhood.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                id="city"
                type="text"
                placeholder=" "
                {...register('address.city')}
                className={getInputClass(!!errors.address?.city)}
              />
              <label
                htmlFor="city"
                className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
              >
                Cidade *
              </label>
              {errors.address?.city && (
                <p className="mt-1 text-xs text-red-600">{errors.address.city.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                id="state"
                type="text"
                maxLength={2}
                placeholder=" "
                {...register('address.state')}
                className={`${getInputClass(!!errors.address?.state)} uppercase`}
              />
              <label
                htmlFor="state"
                className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
              >
                Estado (UF) *
              </label>
              <p className="mt-1 text-xs text-slate-400">SP</p>
              {errors.address?.state && (
                <p className="mt-1 text-xs text-red-600">{errors.address.state.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                id="zipCode"
                type="text"
                placeholder=" "
                {...register('address.zipCode')}
                className={getInputClass(!!errors.address?.zipCode)}
              />
              <label
                htmlFor="zipCode"
                className="absolute left-4 top-2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0EA5A4]"
              >
                CEP *
              </label>
              <p className="mt-1 text-xs text-slate-400">00000-000</p>
              {errors.address?.zipCode && (
                <p className="mt-1 text-xs text-red-600">{errors.address.zipCode.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-[#0EA5A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && (
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          )}
          {isLoading
            ? 'Salvando...'
            : isStepMode && !isLastStep
              ? 'Salvar e continuar →'
              : submitLabel}
        </button>
      </div>
    </form>
  );
}
