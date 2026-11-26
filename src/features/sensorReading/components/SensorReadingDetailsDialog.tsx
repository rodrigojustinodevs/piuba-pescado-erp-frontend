'use client';

import { Activity, CalendarClock, Droplets, Gauge, MessageSquare, RadioTower } from 'lucide-react';
import type { SensorReading } from '../types';
import { formatSensorReadingValue } from '../utils/formatSensorReadingDisplay';
import { getSensorTypeLabel } from '@/features/sensor/utils/sensorDisplayLabels';
import { formatDateTimeShortPtBR } from '@/shared/utils/dateFormat';
import {
  DetailsCopyId,
  DetailsDialog,
  DetailsDialogBody,
  DetailsDialogFooter,
  DetailsDialogSkeleton,
  DetailsGrid,
  DetailsHero,
  DetailsTile,
  DetailsTimestamps,
} from '@/shared/components/detailsDialog';

type SensorReadingDetailsDialogProps = {
  readonly sensorReading: SensorReading | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

function SensorReadingDetailsBody({ reading }: Readonly<{ reading: SensorReading }>) {
  const value = formatSensorReadingValue(reading.value, reading.unit);
  const sensorType = reading.sensor?.sensorType
    ? getSensorTypeLabel(reading.sensor.sensorType)
    : null;

  return (
    <DetailsDialogBody>
      <DetailsHero icon={Activity} title={value} tone="info">
        {sensorType && <span className="text-xs text-muted-foreground">{sensorType}</span>}
        <DetailsCopyId id={reading.id} label="ID da leitura" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Gauge} label="Valor">
          <span className="text-xl tabular-nums">{value}</span>
        </DetailsTile>
        <DetailsTile icon={CalendarClock} label="Data da medição" emptyLabel="Não informada">
          {reading.measuredAt ? (
            <span className="tabular-nums">{formatDateTimeShortPtBR(reading.measuredAt)}</span>
          ) : null}
        </DetailsTile>
        <DetailsTile icon={RadioTower} label="Sensor">
          {reading.sensor?.name}
        </DetailsTile>
        <DetailsTile icon={Droplets} label="Viveiro">
          {reading.sensor?.tank?.name}
        </DetailsTile>
        <DetailsTile icon={MessageSquare} label="Observações" span={2} emptyLabel="Sem observações">
          {reading.notes?.trim() && <span className="font-normal">{reading.notes}</span>}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={reading.createdAt} updatedAt={reading.updatedAt} />
    </DetailsDialogBody>
  );
}

export function SensorReadingDetailsDialog({
  sensorReading,
  open,
  onOpenChange,
  onEdit,
}: SensorReadingDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes da leitura"
      description="Leitura registrada pelo sensor."
    >
      {sensorReading ? (
        <SensorReadingDetailsBody reading={sensorReading} />
      ) : (
        <DetailsDialogSkeleton />
      )}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={sensorReading ? onEdit : undefined}
        editLabel="Editar leitura"
      />
    </DetailsDialog>
  );
}
