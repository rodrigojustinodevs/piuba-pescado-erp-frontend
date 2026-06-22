'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSensors } from '@/features/sensor/hooks/useSensors';
import { getSensorTypeLabel } from '@/features/sensor/utils/sensorDisplayLabels';
import { FormActions, FormCardSection } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';
import { toMeasuredAtBackendString } from '@/shared/utils/datetimeForm';
import type { CreateSensorReadingData } from '../types';
import { createSensorReadingSchema, type CreateSensorReadingFormData } from '../schemas';

type SensorReadingFormProps = {
  initialValues?: CreateSensorReadingFormData;
  onSubmit: (data: CreateSensorReadingData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
};

export { toDateTimeLocalInputValue as toDateTimeLocalValue } from '@/shared/utils/datetimeForm';

export function SensorReadingForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
}: Readonly<SensorReadingFormProps>) {
  const { data: sensorsData, isLoading: isLoadingSensors } = useSensors({ page: 1, limit: 1000 });
  const sensors = sensorsData?.sensors ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSensorReadingFormData>({
    resolver: zodResolver(createSensorReadingSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      sensorId: '',
      value: 0,
      unit: '',
      measuredAt: '',
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
          sensorId: data.sensorId,
          value: data.value,
          unit: data.unit.trim(),
          measuredAt: toMeasuredAtBackendString(data.measuredAt),
          notes: notesTrimmed ? notesTrimmed : null,
        });
      })}
    >
      <FormCardSection
        title="Dados da leitura"
        description="Informe o sensor, valor medido, unidade e momento da medição."
        footer={
          <FormActions
            submitLabel={submitLabel}
            loadingLabel={submittingLabel}
            isLoading={isSubmitting}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Sensor *"
            requiredIndicator
            disabled={isSubmitting || isLoadingSensors}
            options={sensors.map((s) => ({
              value: s.id,
              label: `${getSensorTypeLabel(s.sensorType)} — ${s.tank?.name || '—'}`,
            }))}
            placeholder={isLoadingSensors ? 'Carregando sensores...' : 'Selecione o sensor'}
            {...register('sensorId')}
            error={errors.sensorId?.message}
          />

          <Input
            label="Valor medido"
            requiredIndicator
            type="number"
            step="any"
            disabled={isSubmitting}
            {...register('value', { valueAsNumber: true })}
            error={errors.value?.message}
          />

          <Input
            label="Unidade"
            requiredIndicator
            type="text"
            disabled={isSubmitting}
            placeholder="Ex.: pH, °C, mg/L"
            {...register('unit')}
            error={errors.unit?.message}
          />

          <Input
            label="Data e hora da medição"
            requiredIndicator
            type="datetime-local"
            disabled={isSubmitting}
            {...register('measuredAt')}
            error={errors.measuredAt?.message}
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
      </FormCardSection>
    </form>
  );
}
