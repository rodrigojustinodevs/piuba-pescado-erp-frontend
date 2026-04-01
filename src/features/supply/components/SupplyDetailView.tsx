'use client';

import type { Supply } from '../types';
import {
  DetailPageHero,
  EntityDetailMetricsBody,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { ProductsIcon } from '@/shared/components/Sidebar/menuIcons';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { getSupplyDefaultUnitLabel } from '../utils/defaultUnitLabel';

type SupplyDetailViewProps = {
  supply: Supply;
};

export function SupplyDetailView({ supply }: Readonly<SupplyDetailViewProps>) {
  const titleLabel = supply.name || 'Produto';
  const metricCards = [
    { label: 'Produto', value: supply.name || '—' },
    { label: 'Categoria', value: supply.category || '—' },
    { label: 'Unidade padrão', value: getSupplyDefaultUnitLabel(supply.defaultUnit) },
    { label: 'Empresa', value: supply.companyName || '—' },
  ];
  const infoItems = [
    { label: 'CRIADO EM', value: formatNullableDatePtBR(supply.createdAt, true) },
    { label: 'ATUALIZADO EM', value: formatNullableDatePtBR(supply.updatedAt, true) },
  ];

  return (
    <EntityDetailShell breadcrumb={<>Dashboard / Produtos / {titleLabel}</>}>
      <DetailPageHero
        icon={<ProductsIcon />}
        title={titleLabel}
        subtitle={
          <>
            Categoria: {supply.category || '—'} · Unidade:{' '}
            {getSupplyDefaultUnitLabel(supply.defaultUnit)}
          </>
        }
        editHref={`/company/supplies/${supply.id}/edit`}
      />
      <EntityDetailMetricsBody
        metricCards={metricCards}
        infoSectionTitle="Detalhes"
        infoItems={infoItems}
      />
    </EntityDetailShell>
  );
}
