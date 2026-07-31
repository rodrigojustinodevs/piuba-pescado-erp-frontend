'use client';

import type { SensorReading } from '../types';
import { getSensorTypeLabel } from '@/features/sensor/utils/sensorDisplayLabels';
import {
  DetailPageHero,
  EntityDetailMetricsBody,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { SensorReadingBarChartIcon } from '@/shared/components/icons/FeatureEntityIcons';
import { formatNullableDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';
import { formatSensorReadingValue } from '../utils/formatSensorReadingDisplay';

export type SensorReadingDetailViewProps = {
  reading: SensorReading;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
};

export function SensorReadingDetailView({
  reading,
  onDelete,
  isDeleting = false,
}: Readonly<SensorReadingDetailViewProps>) {
  const typeLabel = getSensorTypeLabel(reading.sensor?.sensorType);
  const titleLabel = `${formatSensorReadingValue(reading.value, reading.unit)} — ${reading.sensor?.tank?.name || 'Tanque'}`;
  const measuredAt = formatNullableDatePtBR(reading.measuredAt, true);
  const metricCards = [
    { label: 'Valor', value: formatSensorReadingValue(reading.value, reading.unit) },
    { label: 'Tanque', value: reading.sensor?.tank?.name || '—' },
    { label: 'Data da medição', value: measuredAt },
    { label: 'Atualizado em', value: formatNullableDatePtBR(reading.updatedAt, true) },
  ];
  const infoItems = [
    { label: 'OBSERVAÇÕES', value: reading.notes || '—' },
    { label: 'CRIADO EM', value: formatNullableDatePtBR(reading.createdAt, true) },
    { label: 'ÚLTIMA ATUALIZAÇÃO', value: formatRelativeDateTimePtBR(reading.updatedAt) },
  ];

  return (
    <EntityDetailShell breadcrumb={<>Dashboard / Leituras / {titleLabel}</>}>
      <DetailPageHero
        icon={<SensorReadingBarChartIcon />}
        title={titleLabel}
        subtitle={
          <>
            Sensor: {typeLabel} · Medição: {measuredAt}
          </>
        }
        editHref={`/company/sensor-readings/${reading.id}/edit`}
        onDeleteClick={onDelete ? () => onDelete(reading.id, titleLabel) : undefined}
        isDeleting={isDeleting}
      />

      <EntityDetailMetricsBody
        metricCards={metricCards}
        infoSectionTitle="Detalhes"
        infoItems={infoItems}
      />
    </EntityDetailShell>
  );
}
