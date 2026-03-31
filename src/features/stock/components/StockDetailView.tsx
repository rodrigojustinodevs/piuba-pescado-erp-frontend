'use client';

import type { Stock } from '../types';
import {
  DetailPageHero,
  EntityDetailMetricsBody,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { ProductsIcon } from '@/shared/components/Sidebar/menuIcons';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

type StockDetailViewProps = {
  stock: Stock;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
};

export function StockDetailView({
  stock,
  onDelete,
  isDeleting = false,
}: Readonly<StockDetailViewProps>) {
  const titleLabel = stock.supplyName || 'Estoque';
  const metricCards = [
    { label: 'Insumo', value: stock.supplyName || '—' },
    { label: 'Fornecedor', value: stock.supplierName || '—' },
    { label: 'Quantidade atual', value: `${stock.currentQuantity} ${stock.unit}` },
    { label: 'Preço unitário', value: formatMoney(stock.unitPrice) },
  ];
  const infoItems = [
    { label: 'ESTOQUE MÍNIMO', value: `${stock.minimumStock} ${stock.unit}` },
    { label: 'RETIRADAS', value: `${stock.withdrawalQuantity} ${stock.unit}` },
    {
      label: 'STATUS',
      value: stock.isBelowMinimum ? 'Abaixo do mínimo' : 'Adequado',
    },
    { label: 'CRIADO EM', value: formatNullableDatePtBR(stock.createdAt, true) },
    { label: 'ATUALIZADO EM', value: formatNullableDatePtBR(stock.updatedAt, true) },
  ];

  return (
    <EntityDetailShell breadcrumb={<>Dashboard / Estoques / {titleLabel}</>}>
      <DetailPageHero
        icon={<ProductsIcon />}
        title={titleLabel}
        subtitle={
          <>
            {stock.currentQuantity} {stock.unit} · {formatMoney(stock.unitPrice)} / {stock.unit}
          </>
        }
        editHref={`/company/stocks/${stock.id}/edit`}
        onDeleteClick={onDelete ? () => onDelete(stock.id, titleLabel) : undefined}
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
