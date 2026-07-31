'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTanks } from '@/features/tank/hooks/useTanks';
import { FormActions } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';
import { Select } from '@/shared/components/form';
import type { CreateSensorData, SensorStatus, SensorType } from '../types';
import { createSensorSchema, type CreateSensorFormData } from '../schemas';
import { SENSOR_STATUS_OPTIONS, SENSOR_TYPE_OPTIONS } from '../utils/sensorDisplayLabels';

type SensorFormProps = {
  initialValues?: CreateSensorFormData;
  onSubmit: (data: CreateSensorData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
};

export function toDateInputValue(value: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function SensorForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
}: Readonly<SensorFormProps>) {
  const { data: tanksData, isLoading: isLoadingTanks } = useTanks({ page: 1, limit: 1000 });
  const tanks = tanksData?.tanks ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSensorFormData>({
    resolver: zodResolver(createSensorSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      sensorType: '',
      installationDate: '',
      status: '',
      tankId: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        installationDate: toDateInputValue(initialValues.installationDate),
      });
    }
  }, [initialValues, reset]);

  const submitForm = (data: CreateSensorFormData) =>
    onSubmit({
      ...data,
      sensorType: data.sensorType as SensorType,
      status: data.status as SensorStatus,
    });

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Informações do Sensor</h2>
          <p className="mt-1 text-sm text-slate-600">
            Registre o tipo, status e tanque onde o sensor está instalado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Tipo do sensor"
            required
            disabled={isSubmitting}
            options={SENSOR_TYPE_OPTIONS}
            placeholder="Selecione o tipo"
            {...register('sensorType')}
            error={errors.sensorType?.message}
          />

          <Input
            label="Data de instalação"
            requiredIndicator
            type="date"
            disabled={isSubmitting}
            {...register('installationDate')}
            error={errors.installationDate?.message}
          />

          <Select
            label="Status"
            required
            disabled={isSubmitting}
            options={SENSOR_STATUS_OPTIONS}
            placeholder="Selecione o status"
            {...register('status')}
            error={errors.status?.message}
          />

          <Select
            label="Tanque"
            required
            disabled={isSubmitting || isLoadingTanks}
            options={tanks.map((tank) => ({ value: tank.id, label: tank.name }))}
            placeholder={isLoadingTanks ? 'Carregando tanques...' : 'Selecione o tanque'}
            {...register('tankId')}
            error={errors.tankId?.message}
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
