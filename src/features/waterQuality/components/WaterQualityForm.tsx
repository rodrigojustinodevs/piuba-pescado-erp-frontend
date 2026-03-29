'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTanks } from '@/features/tank';
import { FormActions } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';
import type { CreateWaterQualityData } from '../types';
import { createWaterQualitySchema, type CreateWaterQualityFormData } from '../schemas';

type WaterQualityFormProps = {
  initialValues?: CreateWaterQualityFormData;
  onSubmit: (data: CreateWaterQualityData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
};

/** Formato esperado pelo backend: `YYYY-MM-DD HH:mm:ss` */
function toMeasuredAtString(value: string): string {
  if (!value) return '';
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function toDateTimeLocalValue(value: string | null): string {
  if (!value) return '';
  const d = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function WaterQualityForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
}: Readonly<WaterQualityFormProps>) {
  const { data: tanksData, isLoading: isLoadingTanks } = useTanks({ page: 1, limit: 1000 });
  const tanks = tanksData?.tanks ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateWaterQualityFormData>({
    resolver: zodResolver(createWaterQualitySchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      tankId: '',
      measuredAt: '',
      ph: 0,
      dissolvedOxygen: 0,
      temperature: 0,
      ammonia: 0,
      salinity: 0,
      turbidity: 0,
      notes: '',
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const notesTrimmed = data.notes?.trim();
        onSubmit({
          tankId: data.tankId,
          measuredAt: toMeasuredAtString(data.measuredAt),
          ph: data.ph,
          dissolvedOxygen: data.dissolvedOxygen,
          temperature: data.temperature,
          ammonia: data.ammonia,
          salinity: data.salinity,
          turbidity: data.turbidity,
          notes: notesTrimmed ? notesTrimmed : null,
        });
      })}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Parâmetros da água</h2>
          <p className="mt-1 text-sm text-slate-600">
            Informe o tanque, data da medição e os valores analisados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Tanque"
            requiredIndicator
            disabled={isSubmitting || isLoadingTanks}
            options={tanks.map((t) => ({ value: t.id, label: t.name }))}
            placeholder={isLoadingTanks ? 'Carregando tanques...' : 'Selecione o tanque'}
            {...register('tankId')}
            error={errors.tankId?.message}
          />

          <Input
            label="Data e hora da medição"
            requiredIndicator
            type="datetime-local"
            disabled={isSubmitting}
            {...register('measuredAt')}
            error={errors.measuredAt?.message}
          />

          <Input
            label="pH"
            requiredIndicator
            type="number"
            step="any"
            disabled={isSubmitting}
            {...register('ph', { valueAsNumber: true })}
            error={errors.ph?.message}
          />

          <Input
            label="Oxigênio dissolvido (mg/L)"
            requiredIndicator
            type="number"
            step="any"
            disabled={isSubmitting}
            {...register('dissolvedOxygen', { valueAsNumber: true })}
            error={errors.dissolvedOxygen?.message}
          />

          <Input
            label="Temperatura (°C)"
            requiredIndicator
            type="number"
            step="any"
            disabled={isSubmitting}
            {...register('temperature', { valueAsNumber: true })}
            error={errors.temperature?.message}
          />

          <Input
            label="Amônia (mg/L)"
            requiredIndicator
            type="number"
            step="any"
            disabled={isSubmitting}
            {...register('ammonia', { valueAsNumber: true })}
            error={errors.ammonia?.message}
          />

          <Input
            label="Salinidade (ppt)"
            requiredIndicator
            type="number"
            step="any"
            disabled={isSubmitting}
            {...register('salinity', { valueAsNumber: true })}
            error={errors.salinity?.message}
          />

          <Input
            label="Turbidez (NTU)"
            requiredIndicator
            type="number"
            step="any"
            disabled={isSubmitting}
            {...register('turbidity', { valueAsNumber: true })}
            error={errors.turbidity?.message}
          />

          <div className="md:col-span-2">
            <Input
              label="Observações"
              type="text"
              disabled={isSubmitting}
              placeholder="Opcional"
              {...register('notes')}
              error={errors.notes?.message}
            />
          </div>
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
