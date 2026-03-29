'use client';

import type { Sensor } from '../types';
import { getSensorStatusLabel, getSensorTypeLabel } from '../utils/sensorDisplayLabels';
import {
  DetailInfoField,
  DetailInfoSection,
  DetailPageHero,
  DetailSummaryCard,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { formatNullableDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';

const sensorIcon = (
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
      d="M8 14s1.5 2 4 2 4-2 4-2m-8 4s1.5 2 4 2 4-2 4-2M6 6h12M6 10h12"
    />
  </svg>
);

export type SensorDetailViewProps = {
  sensor: Sensor;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
};

export function SensorDetailView({
  sensor,
  onDelete,
  isDeleting = false,
}: Readonly<SensorDetailViewProps>) {
  const typeLabel = getSensorTypeLabel(sensor.sensorType);
  const titleLabel = `${typeLabel === '—' ? 'Sensor' : typeLabel} — ${sensor.tankName || 'Tanque'}`;
  const metricCards = [
    { label: 'Tipo', value: typeLabel },
    { label: 'Tanque', value: sensor.tankName || '—' },
    { label: 'Instalação', value: formatNullableDatePtBR(sensor.installationDate) },
    { label: 'Atualizado em', value: formatNullableDatePtBR(sensor.updatedAt, true) },
  ];
  const infoItems = [
    { label: 'STATUS', value: getSensorStatusLabel(sensor.status) },
    { label: 'CRIADO EM', value: formatNullableDatePtBR(sensor.createdAt, true) },
    { label: 'ÚLTIMA ATUALIZAÇÃO', value: formatRelativeDateTimePtBR(sensor.updatedAt) },
  ];

  return (
    <EntityDetailShell breadcrumb={<>Dashboard / Sensores / {titleLabel}</>}>
      <DetailPageHero
        icon={sensorIcon}
        title={titleLabel}
        subtitle={<>Status: {getSensorStatusLabel(sensor.status)}</>}
        editHref={`/company/sensors/${sensor.id}/edit`}
        onDeleteClick={onDelete ? () => onDelete(sensor.id, titleLabel) : undefined}
        isDeleting={isDeleting}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
        {metricCards.map((card) => (
          <DetailSummaryCard key={card.label} label={card.label} value={card.value} />
        ))}
      </div>

      <DetailInfoSection title="Informações do Sensor">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoItems.map((item) => (
            <DetailInfoField key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </DetailInfoSection>
    </EntityDetailShell>
  );
}
