'use client';

import { useMemo, type ReactNode } from 'react';
import type { CreateWaterQualityData, WaterQuality, WaterQualityDialogMode } from '../types';
import { waterQualityToFormValues } from '../utils/waterQualityFormMapper';
import { useCreateWaterQuality } from '../hooks/useCreateWaterQuality';
import { useUpdateWaterQuality } from '../hooks/useUpdateWaterQuality';
import { WaterQualityForm } from './WaterQualityForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Calendar, Droplets, FlaskConical, Gauge, Thermometer, Wind } from 'lucide-react';

export interface WaterQualityDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly mode: WaterQualityDialogMode;
  readonly record: WaterQuality | null;
}

export function WaterQualityDialog({
  open,
  onOpenChange,
  mode,
  record,
}: Readonly<WaterQualityDialogProps>) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const createMutation = useCreateWaterQuality({ skipNavigateToList: true });
  const updateMutation = useUpdateWaterQuality();
  const isSubmitting = isEdit ? updateMutation.isPending : createMutation.isPending;

  const initialValues = useMemo(
    () => (record ? waterQualityToFormValues(record) : undefined),
    [record],
  );

  let title = 'Nova medição';
  let description = 'Informe tanque, data e parâmetros da qualidade da água.';

  if (isView) {
    title = 'Detalhes da medição';
    description = 'Visualização dos parâmetros registrados.';
  } else if (isEdit) {
    title = 'Editar medição';
    description = 'Atualize os valores e salve.';
  }

  if (isView && record) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FlaskConical className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold">{record.tank?.name || 'Tanque'}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatNullableDatePtBR(record.measuredAt, true)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow icon={<Gauge className="h-4 w-4" />} label="pH" value={String(record.ph)} />
              <InfoRow
                icon={<Wind className="h-4 w-4" />}
                label="O₂ dissolvido"
                value={String(record.dissolvedOxygen)}
              />
              <InfoRow
                icon={<Thermometer className="h-4 w-4" />}
                label="Temperatura (°C)"
                value={String(record.temperature)}
              />
              <InfoRow
                icon={<Gauge className="h-4 w-4" />}
                label="Amônia"
                value={String(record.ammonia)}
              />
              <InfoRow
                icon={<Droplets className="h-4 w-4" />}
                label="Salinidade"
                value={record.salinity || '—'}
              />
              <InfoRow
                icon={<Droplets className="h-4 w-4" />}
                label="Turbidez"
                value={record.turbidity || '—'}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Criado em"
                value={formatNullableDatePtBR(record.createdAt, true)}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Atualizado em"
                value={formatNullableDatePtBR(record.updatedAt, true)}
              />
              <InfoRow
                icon={<FlaskConical className="h-4 w-4" />}
                label="Observações"
                value={record.notes || '—'}
                className="sm:col-span-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <WaterQualityForm
          key={isEdit && record ? record.id : 'create'}
          initialValues={isEdit ? initialValues : undefined}
          onCancel={() => onOpenChange(false)}
          onSubmit={(data: CreateWaterQualityData) => {
            if (isEdit && record) {
              updateMutation.mutate(
                { ...data, id: record.id },
                {
                  onSuccess: () => {
                    onOpenChange(false);
                  },
                },
              );
              return;
            }
            createMutation.mutate(data, {
              onSuccess: () => {
                onOpenChange(false);
              },
            });
          }}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? 'Salvar alterações' : 'Registrar medição'}
          submittingLabel={isEdit ? 'Salvando...' : 'Registrando...'}
        />
      </DialogContent>
    </Dialog>
  );
}

interface InfoRowProps {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: string;
  readonly className?: string;
}

function InfoRow({ icon, label, value, className }: Readonly<InfoRowProps>) {
  return (
    <div className={`space-y-1 ${className ?? ''}`}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="break-words text-sm tabular-nums">{value}</p>
    </div>
  );
}
