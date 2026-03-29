'use client';

import type { SensorReading } from '../types';
import { getSensorTypeLabel } from '@/features/sensor/utils/sensorDisplayLabels';
import {
  DetailInfoField,
  DetailInfoSection,
  DetailPageHero,
  DetailSummaryCard,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { formatNullableDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';
import { formatSensorReadingValue } from '../utils/formatSensorReadingDisplay';

const chartIcon = (
  <svg
    className="h-8 w-8 text-[#0EA5A4]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

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
  const typeLabel = getSensorTypeLabel(reading.sensorType);
  const titleLabel = `${formatSensorReadingValue(reading.value, reading.unit)} — ${reading.tankName || 'Tanque'}`;
  const measuredAt = formatNullableDatePtBR(reading.measuredAt, true);
  const metricCards = [
    { label: 'Valor', value: formatSensorReadingValue(reading.value, reading.unit) },
    { label: 'Tanque', value: reading.tankName || '—' },
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
        icon={chartIcon}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
        {metricCards.map((card) => (
          <DetailSummaryCard key={card.label} label={card.label} value={card.value} />
        ))}
      </div>

      <DetailInfoSection title="Detalhes">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoItems.map((item) => (
            <DetailInfoField key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </DetailInfoSection>
    </EntityDetailShell>
  );
}
