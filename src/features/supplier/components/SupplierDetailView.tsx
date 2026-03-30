'use client';

import type { Supplier } from '../types';
import {
  DetailPageHero,
  EntityDetailMetricsBody,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { BuildingIcon } from '@/shared/components/Sidebar/menuIcons';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';

type SupplierDetailViewProps = {
  supplier: Supplier;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
};

export function SupplierDetailView({
  supplier,
  onDelete,
  isDeleting = false,
}: Readonly<SupplierDetailViewProps>) {
  const titleLabel = supplier.name || 'Fornecedor';
  const metricCards = [
    { label: 'Fornecedor', value: supplier.name || '—' },
    { label: 'Contato', value: supplier.contact || '—' },
    { label: 'Telefone', value: supplier.phone || '—' },
    { label: 'Empresa', value: supplier.companyName || '—' },
  ];
  const infoItems = [
    { label: 'E-MAIL', value: supplier.email || '—' },
    { label: 'CRIADO EM', value: formatNullableDatePtBR(supplier.createdAt, true) },
    { label: 'ATUALIZADO EM', value: formatNullableDatePtBR(supplier.updatedAt, true) },
  ];

  return (
    <EntityDetailShell breadcrumb={<>Dashboard / Fornecedores / {titleLabel}</>}>
      <DetailPageHero
        icon={<BuildingIcon />}
        title={titleLabel}
        subtitle={
          <>
            Contato: {supplier.contact || '—'} · Telefone: {supplier.phone || '—'}
          </>
        }
        editHref={`/company/suppliers/${supplier.id}/edit`}
        onDeleteClick={onDelete ? () => onDelete(supplier.id, titleLabel) : undefined}
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
