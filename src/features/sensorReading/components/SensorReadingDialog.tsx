'use client';

import { useEffect, type ReactNode } from 'react';
import { Controller, useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSensors } from '@/features/sensor/hooks/useSensors';
import { getSensorTypeLabel } from '@/features/sensor/utils/sensorDisplayLabels';
import { useCreateSensorReading } from '../hooks/useCreateSensorReading';
import { useUpdateSensorReading } from '../hooks/useUpdateSensorReading';
import type { CreateSensorReadingData, SensorReading, UpdateSensorReadingData } from '../types';
import { createSensorReadingSchema, type CreateSensorReadingFormData } from '../schemas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { toDateTimeLocalInputValue, toMeasuredAtBackendString } from '@/shared/utils/datetimeForm';
import { Activity, Calendar, Gauge, Loader2, MessageSquare, Waves } from 'lucide-react';
import { InfoRow } from '@/shared/components/entityDetail';
import { formatSensorReadingValue } from '../utils/formatSensorReadingDisplay';
import { useToast } from '@/shared/contexts/ToastContext';

type SensorReadingDialogMode = 'create' | 'edit' | 'view';

interface SensorReadingDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSuccess: () => void;
  readonly mode?: SensorReadingDialogMode;
  readonly sensorReading?: SensorReading | null;
}

const createDefaults: CreateSensorReadingFormData = {
  sensorId: '',
  value: 0,
  unit: '',
  measuredAt: '',
  notes: '',
};

function toUpdateDefaults(reading: SensorReading): CreateSensorReadingFormData {
  return {
    sensorId: reading.sensor?.id ?? '',
    value: reading.value,
    unit: reading.unit,
    measuredAt: toDateTimeLocalInputValue(reading.measuredAt),
    notes: reading.notes ?? '',
  };
}

function FormField({
  id,
  label,
  required,
  error,
  className,
  children,
}: Readonly<{
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}>) {
  return (
    <div className={`space-y-2 ${className ?? ''}`}>
      <Label htmlFor={id}>
        {label} {required && '*'}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function SensorReadingDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  sensorReading = null,
}: Readonly<SensorReadingDialogProps>) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const createReading = useCreateSensorReading();
  const updateReading = useUpdateSensorReading();
  const { showError } = useToast();
  const isSubmitting = isEdit ? updateReading.isPending : createReading.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSensorReadingFormData>({
    resolver: zodResolver(createSensorReadingSchema),
    defaultValues: createDefaults,
  });

  const { data: sensorsData, isLoading: isLoadingSensors } = useSensors({
    page: 1,
    limit: 1000,
    enabled: open && !isView,
  });

  const sensors = sensorsData?.sensors ?? [];

  useEffect(() => {
    if (!open) return;
    if ((isEdit || isView) && sensorReading) {
      reset(toUpdateDefaults(sensorReading));
      return;
    }
    reset(createDefaults);
  }, [open, isEdit, isView, sensorReading, reset]);

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      reset(isEdit && sensorReading ? toUpdateDefaults(sensorReading) : createDefaults);
    }
    onOpenChange(nextOpen);
  }

  function onInvalid(validationErrors: FieldErrors<CreateSensorReadingFormData>) {
    const fieldLabels: Record<keyof CreateSensorReadingFormData, string> = {
      sensorId: 'Sensor',
      value: 'Valor medido',
      unit: 'Unidade',
      measuredAt: 'Data e hora da medição',
      notes: 'Observações',
    };

    const invalidFields = Object.keys(validationErrors)
      .map((key) => fieldLabels[key as keyof CreateSensorReadingFormData] ?? key)
      .slice(0, 4);

    if (invalidFields.length === 0) {
      showError('Verifique os campos obrigatórios antes de salvar.');
      return;
    }

    showError(`Campos inválidos: ${invalidFields.join(', ')}.`);
  }

  function onSubmit(formData: CreateSensorReadingFormData) {
    if (isView) return;
    const payloadBase: CreateSensorReadingData = {
      sensorId: formData.sensorId,
      value: Number(formData.value),
      unit: formData.unit.trim(),
      measuredAt: toMeasuredAtBackendString(formData.measuredAt),
      notes: formData.notes?.trim() ? formData.notes.trim() : null,
    };

    if (isEdit) {
      if (!sensorReading?.id) {
        showError('Não foi possível salvar: leitura sem identificador.');
        return;
      }
      const updatePayload: UpdateSensorReadingData = { id: sensorReading.id, ...payloadBase };
      updateReading.mutate(updatePayload, {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess();
        },
      });
      return;
    }

    createReading.mutate(payloadBase, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess();
      },
    });
  }

  let title = 'Nova Leitura';
  let description = 'Preencha os dados para registrar uma nova leitura de sensor.';
  if (isView) {
    title = 'Detalhes da Leitura';
    description = 'Visualização das informações da leitura.';
  } else if (isEdit) {
    title = 'Editar Leitura';
    description = 'Atualize os dados da medição.';
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isView && sensorReading ? (
          <>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Activity className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold">
                    {formatSensorReadingValue(sensorReading.value, sensorReading.unit)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getSensorTypeLabel(sensorReading.sensor?.sensorType ?? '')}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow
                  icon={<Waves className="h-4 w-4" />}
                  label="Viveiro"
                  value={sensorReading.sensor?.tank?.name || '—'}
                />
                <InfoRow
                  icon={<Gauge className="h-4 w-4" />}
                  label="Valor"
                  value={formatSensorReadingValue(sensorReading.value, sensorReading.unit)}
                />
                <InfoRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Data da medição"
                  value={formatNullableDatePtBR(sensorReading.measuredAt, true)}
                />
                <InfoRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Atualizado em"
                  value={formatNullableDatePtBR(sensorReading.updatedAt, true)}
                />
                <InfoRow
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="Observações"
                  value={sensorReading.notes || '—'}
                  className="sm:col-span-2"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="sensorId"
                label="Sensor"
                required
                error={errors.sensorId?.message}
                className="sm:col-span-2"
              >
                <Controller
                  name="sensorId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting || isLoadingSensors}
                    >
                      <SelectTrigger id="sensorId">
                        <SelectValue
                          placeholder={
                            isLoadingSensors ? 'Carregando sensores...' : 'Selecione o sensor'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {sensors.map((sensor) => (
                          <SelectItem key={sensor.id} value={sensor.id}>
                            {getSensorTypeLabel(sensor.sensorType)} -{' '}
                            {sensor.tank?.name || 'Sem tanque'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField id="value" label="Valor medido" required error={errors.value?.message}>
                <Input
                  id="value"
                  type="number"
                  step="any"
                  disabled={isSubmitting}
                  {...register('value', { valueAsNumber: true })}
                />
              </FormField>

              <FormField id="unit" label="Unidade" required error={errors.unit?.message}>
                <Input
                  id="unit"
                  placeholder="Ex.: pH, C, mg/L"
                  disabled={isSubmitting}
                  {...register('unit')}
                />
              </FormField>

              <FormField
                id="measuredAt"
                label="Data e hora da medição"
                required
                error={errors.measuredAt?.message}
                className="sm:col-span-2"
              >
                <Input
                  id="measuredAt"
                  type="datetime-local"
                  disabled={isSubmitting}
                  {...register('measuredAt')}
                />
              </FormField>

              <FormField
                id="notes"
                label="Observações"
                error={errors.notes?.message}
                className="sm:col-span-2"
              >
                <textarea
                  id="notes"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Observações opcionais"
                  disabled={isSubmitting}
                  {...register('notes')}
                />
              </FormField>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Salvar alterações' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
