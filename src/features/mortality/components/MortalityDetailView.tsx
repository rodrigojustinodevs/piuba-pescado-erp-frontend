'use client';

import type { Mortality } from '../types';
import {
  DetailInfoField,
  DetailInfoSection,
  DetailPageHero,
  DetailSummaryCard,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { formatNullableDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';

const trendIcon = (
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
      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
    />
  </svg>
);

export type MortalityDetailViewProps = {
  mortality: Mortality;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
};

function formatNumber(value: number): string {
  return Number.isFinite(value) ? String(value) : '—';
}

export function MortalityDetailView({
  mortality,
  onDelete,
  isDeleting = false,
}: Readonly<MortalityDetailViewProps>) {
  const mortalityDateLabel = formatNullableDatePtBR(mortality.mortalityDate);
  const titleLabel = mortality.batchName || `Mortalidade ${mortalityDateLabel}`;
  const metricCards = [
    { label: 'Lote', value: mortality.batchName || '—' },
    { label: 'Data da mortalidade', value: mortalityDateLabel },
    { label: 'Quantidade', value: formatNumber(mortality.quantity) },
    { label: 'Atualizado em', value: formatNullableDatePtBR(mortality.updatedAt, true) },
  ];
  const infoItems = [
    { label: 'LOTE', value: mortality.batchName || '—' },
    { label: 'CAUSA', value: mortality.cause || '—' },
    { label: 'CRIADO EM', value: formatNullableDatePtBR(mortality.createdAt, true) },
    { label: 'ÚLTIMA ATUALIZAÇÃO', value: formatRelativeDateTimePtBR(mortality.updatedAt) },
  ];

  return (
    <EntityDetailShell breadcrumb={<>Dashboard / Mortalidades / {titleLabel}</>}>
      <DetailPageHero
        icon={trendIcon}
        title={titleLabel}
        subtitle={<>Data: {mortalityDateLabel}</>}
        editHref={`/company/mortalities/${mortality.id}/edit`}
        onDeleteClick={onDelete ? () => onDelete(mortality.id, titleLabel) : undefined}
        isDeleting={isDeleting}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
        {metricCards.map((card) => (
          <DetailSummaryCard key={card.label} label={card.label} value={card.value} />
        ))}
      </div>

      <DetailInfoSection title="Informações da Mortalidade">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoItems.map((item) => (
            <DetailInfoField key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </DetailInfoSection>
    </EntityDetailShell>
  );
}
