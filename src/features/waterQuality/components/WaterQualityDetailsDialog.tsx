'use client';

import {
  Droplets,
  FileText,
  FlaskConical,
  Gauge,
  RadioTower,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react';
import type { Quality, WaterQuality } from '../types';
import { formatDateTimeShortPtBR } from '@/shared/utils/dateFormat';
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

type WaterQualityDetailsDialogProps = {
  readonly record: WaterQuality | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const QUALITY: Record<Quality, { label: string; tone: DetailTone }> = {
  excellent: { label: 'Excelente', tone: 'success' },
  good: { label: 'Bom', tone: 'info' },
  warning: { label: 'Atenção', tone: 'warning' },
  critical: { label: 'Crítico', tone: 'danger' },
  unknown: { label: 'Sem dados', tone: 'neutral' },
};

/** A API envia os parâmetros ora como string, ora como número (apesar do tipo declarar string). */
type RawReading = string | number | null | undefined;

function readingText(value: RawReading): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  return text === '' ? null : text;
}

function Reading({
  value,
  unit,
  size = 'lg',
}: Readonly<{ value: RawReading; unit?: string; size?: 'lg' | 'md' }>) {
  const text = readingText(value);
  if (text === null) return null;
  return (
    <span className={size === 'lg' ? 'text-xl tabular-nums' : 'tabular-nums'}>
      {text}
      {unit && <span className="text-sm font-normal text-muted-foreground"> {unit}</span>}
    </span>
  );
}

function WaterQualityDetailsBody({ record }: Readonly<{ record: WaterQuality }>) {
  const quality = QUALITY[record.quality] ?? QUALITY.unknown;

  return (
    <DetailsDialogBody>
      <DetailsHero icon={FlaskConical} title={record.tank?.name || 'Tanque'} tone={quality.tone}>
        <DetailsStatusBadge tone={quality.tone} label={quality.label} />
        <DetailsCopyId id={record.id} label="ID da medição" />
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatDateTimeShortPtBR(record.measuredAt)}
        </span>
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Gauge} label="pH">
          <Reading value={record.ph} />
        </DetailsTile>
        <DetailsTile icon={Wind} label="O₂ dissolvido">
          <Reading value={record.dissolvedOxygen} unit="mg/L" />
        </DetailsTile>
        <DetailsTile icon={Thermometer} label="Temperatura">
          <Reading value={record.temperature} unit="°C" />
        </DetailsTile>
        <DetailsTile icon={FlaskConical} label="Amônia">
          <Reading value={record.ammonia} unit="mg/L" />
        </DetailsTile>
        <DetailsTile icon={Waves} label="Salinidade" emptyLabel="Não medida">
          {readingText(record.salinity) && <Reading value={record.salinity} size="md" />}
        </DetailsTile>
        <DetailsTile icon={Droplets} label="Turbidez" emptyLabel="Não medida">
          {readingText(record.turbidity) && <Reading value={record.turbidity} size="md" />}
        </DetailsTile>
        <DetailsTile icon={RadioTower} label="Sensor" span={2} emptyLabel="Medição manual">
          {record.tank?.sensor?.name}
        </DetailsTile>
        <DetailsTile icon={FileText} label="Observações" span={2} emptyLabel="Sem observações">
          {readingText(record.notes) && <span className="font-normal">{record.notes}</span>}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={record.createdAt} updatedAt={record.updatedAt} />
    </DetailsDialogBody>
  );
}

export function WaterQualityDetailsDialog({
  record,
  open,
  onOpenChange,
  onEdit,
}: WaterQualityDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes da medição"
      description="Parâmetros de qualidade da água registrados."
    >
      {record ? <WaterQualityDetailsBody record={record} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={record ? onEdit : undefined}
        editLabel="Editar medição"
      />
    </DetailsDialog>
  );
}
