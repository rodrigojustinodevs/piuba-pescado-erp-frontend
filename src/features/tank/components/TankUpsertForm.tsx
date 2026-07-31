'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateTankFormData } from '@/features/tank';
import { createTankSchema } from '@/features/tank/schemas';
import { useCompanies } from '@/features/company';
import { useTankTypes } from '@/features/tank/hooks/useTankTypes';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { Input } from '@/shared/components/ui';
import { Select } from '@/shared/components/form';
import { PhotoPlaceholderIcon } from '@/shared/components/icons/AppIcons';

type TankUpsertFormProps = {
  initialValues?: CreateTankFormData;
  onSubmit: (data: CreateTankFormData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
};

const PHOTO_SLOTS = ['photo-1', 'photo-2', 'photo-3', 'photo-4'] as const;

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

export function TankUpsertForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
}: Readonly<TankUpsertFormProps>) {
  const { isMaster, user } = useAuthContext();
  const { data: companiesData } = useCompanies({ limit: 1000 });
  const companies = companiesData?.companies || [];
  const { data: tankTypesData, isLoading: isLoadingTypes } = useTankTypes();
  const tankTypes = tankTypesData?.tankTypes ?? [];

  const [photos, setPhotos] = useState<Array<File | null>>([null, null, null, null]);
  const previews = useMemo(() => photos.map((f) => (f ? URL.createObjectURL(f) : null)), [photos]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm<CreateTankFormData>({
    resolver: zodResolver(createTankSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      companyId: '',
      tankTypeId: '',
      name: '',
      capacityLiters: 0,
      location: '',
      status: 'active' as const,
    },
  });

  useEffect(() => {
    if (!initialValues) return;
    reset(initialValues);
  }, [initialValues, reset]);

  useEffect(() => {
    if (!isMaster() && user?.companyId) {
      setValue('companyId', user.companyId, { shouldValidate: false });
    }
  }, [isMaster, setValue, user?.companyId]);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#0F172A]">Informações do Tanque</h2>
            <p className="mt-1 text-sm text-slate-600">
              Informe os dados estruturais do tanque para monitoramento IoT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isMaster() ? (
              <Controller
                name="companyId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Empresa"
                    required
                    placeholder="Selecione a empresa"
                    options={companies.map((company) => ({
                      value: String(company.id),
                      label: company.name,
                    }))}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={isSubmitting}
                    error={errors.companyId?.message}
                  />
                )}
              />
            ) : (
              <input type="hidden" {...register('companyId')} />
            )}

            <Input
              label="Nome do tanque"
              requiredIndicator
              placeholder="Nome do Tanque"
              disabled={isSubmitting}
              {...register('name')}
              error={errors.name?.message}
            />

            <Controller
              name="tankTypeId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Tipo de tanque"
                  required
                  placeholder={isLoadingTypes ? 'Carregando tipos...' : 'Selecione um tipo'}
                  options={tankTypes.map((type) => ({
                    value: String(type.id),
                    label: type.name,
                  }))}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isSubmitting || isLoadingTypes}
                  error={errors.tankTypeId?.message}
                />
              )}
            />

            <Input
              label="Capacidade (litros)"
              requiredIndicator
              type="number"
              step={0.01}
              min={0.01}
              disabled={isSubmitting}
              {...register('capacityLiters', { valueAsNumber: true })}
              error={errors.capacityLiters?.message}
            />

            <div className="md:col-span-2">
              <Input
                label="Localização"
                placeholder="Ex: Setor A - Bloco 3"
                disabled={isSubmitting}
                {...register('location')}
                error={errors.location?.message}
              />
            </div>

            <div className="md:col-span-2">
              <Select
                label="Status"
                required
                placeholder="Selecione um status"
                disabled={isSubmitting}
                options={[
                  { value: 'active', label: 'Ativo' },
                  { value: 'inactive', label: 'Inativo' },
                ]}
                {...register('status')}
                error={errors.status?.message}
              />
            </div>
          </div>
        </div>

        {/* Imagens + CTA */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-semibold text-[#0F172A]">Imagens Tanque</h3>
            <p className="mt-1 text-xs text-slate-500">
              <span className="text-[#0EA5A4]">Note:</span> upload photos using JPEG, PNG, or JPG
              (Max size 2mb)
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {PHOTO_SLOTS.map((slotId, i) => {
                const file = photos[i];
                const preview = previews[i];

                return (
                  <label
                    key={slotId}
                    className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#0EA5A4]/40 bg-[#F8FAFC] px-3 py-4 cursor-pointer hover:bg-white transition"
                  >
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      onChange={(e) => {
                        const next = e.target.files?.[0] ?? null;
                        setPhotos((prev) => {
                          const copy = [...prev];
                          copy[i] = next;
                          return copy;
                        });
                      }}
                      disabled={isSubmitting}
                    />

                    {preview ? (
                      <div className="h-16 w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt={`Foto ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0EA5A4]/10 text-[#0EA5A4]">
                        <PhotoPlaceholderIcon className="h-5 w-5" />
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500 truncate w-full text-center">
                      {file ? file.name : `Photo ${i + 1}`}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-[#0EA5A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? submittingLabel : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
