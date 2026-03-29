'use client';

import type { WaterQuality } from '../types';
import {
  DetailPageHero,
  EntityDetailMetricsBody,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { WaterQualityDropletIcon } from '@/shared/components/icons/FeatureEntityIcons';
import { formatNullableDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';

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
        icon={<WaterQualityDropletIcon />}
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

      <EntityDetailMetricsBody
        metricCards={metricCards}
        infoSectionTitle="Detalhes"
        infoItems={infoItems}
      />
    </EntityDetailShell>
  );
}
