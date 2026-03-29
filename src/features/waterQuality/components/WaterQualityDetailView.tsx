'use client';

import type { WaterQuality } from '../types';
import {
  DetailInfoField,
  DetailInfoSection,
  DetailPageHero,
  DetailSummaryCard,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { formatNullableDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';

const waterDropIcon = (
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
      d="M12 3c-4.5 5.5-8 9.5-8 13a8 8 0 1016 0c0-3.5-3.5-7.5-8-13z"
    />
  </svg>
);

export type WaterQualityDetailViewProps = {
  record: WaterQuality;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
};

export function WaterQualityDetailView({
  record,
  onDelete,
  isDeleting = false,
}: Readonly<WaterQualityDetailViewProps>) {
  const titleLabel = `${record.tankName || 'Tanque'} · pH ${record.ph}`;
  const measuredAt = formatNullableDatePtBR(record.measuredAt, true);

  const metricCards = [
    { label: 'pH', value: record.ph },
    { label: 'O₂ dissolvido', value: record.dissolvedOxygen },
    { label: 'Temperatura (°C)', value: record.temperature },
    { label: 'Amônia', value: record.ammonia },
  ];

  const infoItems = [
    { label: 'SALINIDADE', value: record.salinity || '—' },
    { label: 'TURBIDEZ', value: record.turbidity || '—' },
    { label: 'OBSERVAÇÕES', value: record.notes || '—' },
    { label: 'CRIADO EM', value: formatNullableDatePtBR(record.createdAt, true) },
    { label: 'ÚLTIMA ATUALIZAÇÃO', value: formatRelativeDateTimePtBR(record.updatedAt) },
  ];

  return (
    <EntityDetailShell breadcrumb={<>Dashboard / Qualidade da água / {titleLabel}</>}>
      <DetailPageHero
        icon={waterDropIcon}
        title={titleLabel}
        subtitle={
          <>
            Tanque: {record.tankName || '—'} · Medição: {measuredAt}
          </>
        }
        editHref={`/company/water-qualities/${record.id}/edit`}
        onDeleteClick={onDelete ? () => onDelete(record.id, titleLabel) : undefined}
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
