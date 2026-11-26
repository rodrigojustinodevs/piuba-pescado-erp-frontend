'use client';

import {
  Battery,
  BatteryLow,
  Building2,
  CalendarDays,
  CircleHelp,
  Droplets,
  FileText,
  FlaskConical,
  Gauge,
  Hash,
  Ruler,
  Thermometer,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import type { Sensor, SensorStatus, SensorType } from '../types';
import { getSensorStatusLabel, getSensorTypeLabel } from '../utils/sensorDisplayLabels';
import { formatSensorReadingValue } from '../../sensorReading/utils/formatSensorReadingDisplay';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Progress } from '@/shared/components/ui/Progress';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { cn } from '@/shared/lib/utils';
import {
  DetailsCopyId,
  DetailsDialog,
  DetailsDialogBody,
  DetailsDialogFooter,
  DetailsDialogSkeleton,
  DetailsGrid,
  DetailsHero,
  DetailsStatusBadge,
  DetailsTile,
  DetailsTimestamps,
  type DetailTone,
} from '@/shared/components/detailsDialog';

type SensorDetailsDialogProps = {
  readonly sensor: Sensor | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const SENSOR_STATUS_TONE: Record<SensorStatus, DetailTone> = {
  online: 'success',
  offline: 'danger',
  maintenance: 'warning',
};

const SENSOR_TYPE_ICON: Record<SensorType, LucideIcon> = {
  temperature: Thermometer,
  ph: FlaskConical,
  oxygen: Wind,
  dissolved_oxygen: Wind,
  ammonia: Gauge,
  etc: Ruler,
};

const LOW_BATTERY_THRESHOLD = 20;

function BatteryTile({ value }: Readonly<{ value: number | null }>) {
  const low = value !== null && value < LOW_BATTERY_THRESHOLD;
  return (
    <DetailsTile icon={low ? BatteryLow : Battery} label="Bateria">
      {value === null ? null : (
        <div className="space-y-1.5">
          <span className={cn('text-xl tabular-nums', low && 'text-rose-700 dark:text-rose-400')}>
            {value}%
          </span>
          <Progress value={value} className="h-1.5" aria-label={`Bateria em ${value}%`} />
        </div>
      )}
    </DetailsTile>
  );
}

function SensorDetailsBody({ sensor }: Readonly<{ sensor: Sensor }>) {
  const { isMaster } = useAuthContext();
  const tone = SENSOR_STATUS_TONE[sensor.status as SensorStatus] ?? 'neutral';
  const TypeIcon = SENSOR_TYPE_ICON[sensor.sensorType] ?? CircleHelp;

  return (
    <DetailsDialogBody>
      <DetailsHero icon={TypeIcon} title={sensor.name} tone={tone}>
        <DetailsStatusBadge tone={tone} label={getSensorStatusLabel(sensor.status)} />
        <DetailsCopyId id={sensor.id} label="ID do sensor" />
        <span className="text-xs text-muted-foreground">
          {getSensorTypeLabel(sensor.sensorType)}
        </span>
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Gauge} label="Última leitura" emptyLabel="Sem leituras">
          {sensor.lastReading === null ? null : (
            <span className="text-xl tabular-nums">
              {formatSensorReadingValue(sensor.lastReading, sensor.unit)}
            </span>
          )}
        </DetailsTile>
        <BatteryTile value={sensor.battery} />
        <DetailsTile icon={Droplets} label="Viveiro">
          {sensor.tank?.name}
        </DetailsTile>
        <DetailsTile icon={Hash} label="Número de série">
          <span className="font-mono">{sensor.serialNumber}</span>
        </DetailsTile>
        <DetailsTile icon={CalendarDays} label="Instalação" emptyLabel="Não informada">
          {sensor.installationDate ? formatNullableDatePtBR(sensor.installationDate) : null}
        </DetailsTile>
        {isMaster() ? (
          <DetailsTile icon={Building2} label="Empresa" emptyLabel="Não informada">
            {sensor.company?.name}
          </DetailsTile>
        ) : (
          <DetailsTile icon={Ruler} label="Unidade" emptyLabel="Não informada">
            {sensor.unit}
          </DetailsTile>
        )}
        <DetailsTile icon={FileText} label="Observações" span={2} emptyLabel="Sem observações">
          {sensor.notes?.trim() && <span className="font-normal">{sensor.notes}</span>}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={sensor.createdAt} updatedAt={sensor.updatedAt} />
    </DetailsDialogBody>
  );
}

export function SensorDetailsDialog({
  sensor,
  open,
  onOpenChange,
  onEdit,
}: SensorDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={sensor ? `Detalhes do sensor ${sensor.name}` : 'Detalhes do sensor'}
      description="Informações operacionais do sensor."
    >
      {sensor ? <SensorDetailsBody sensor={sensor} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={sensor ? onEdit : undefined}
        editLabel="Editar sensor"
      />
    </DetailsDialog>
  );
}
