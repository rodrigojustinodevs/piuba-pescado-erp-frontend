'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTanks } from '@/features/tank';
import { FormActions, FormCardSection } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';
import { Label } from '@/shared/components/ui/Label';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { toMeasuredAtBackendString } from '@/shared/utils/datetimeForm';
import type { CreateWaterQualityData } from '../types';
import { createWaterQualitySchema, type CreateWaterQualityFormData } from '../schemas';

type WaterQualityFormProps = {
  initialValues?: CreateWaterQualityFormData;
  onSubmit: (data: CreateWaterQualityData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  /** Quando definido, o botão Cancelar chama esta função em vez de `history.back()`. */
  onCancel?: () => void;
};

export { toDateTimeLocalInputValue as toDateTimeLocalValue } from '@/shared/utils/datetimeForm';

export function WaterQualityForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
  onCancel,
}: Readonly<WaterQualityFormProps>) {
  const { data: tanksData, isLoading: isLoadingTanks } = useTanks({ page: 1, limit: 1000 });
  const tanks = tanksData?.tanks ?? [];

  const {
    register,
    control,
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
          measuredAt: toMeasuredAtBackendString(data.measuredAt),
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
      <FormCardSection
        title="Parâmetros da água"
        description="Informe o tanque, data da medição e os valores analisados."
        footer={
          <FormActions
            submitLabel={submitLabel}
            loadingLabel={submittingLabel}
            isLoading={isSubmitting}
            {...(onCancel ? { onCancel } : {})}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tankId">Viveiro *</Label>
            <Controller
              name="tankId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting || isLoadingTanks}
                >
                  <SelectTrigger id="tankId">
                    <SelectValue
                      placeholder={isLoadingTanks ? 'Carregando tanques...' : 'Selecione o tanque'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {tanks.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tankId?.message ? (
              <p className="text-xs text-destructive">{errors.tankId.message}</p>
            ) : null}
          </div>

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
      </FormCardSection>
    </form>
  );
}
