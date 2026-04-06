'use client';

import type { Sale } from '../types';
import {
  DetailPageHero,
  EntityDetailMetricsBody,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';
import { formatCalendarDatePtBR, formatNullableDatePtBR } from '@/shared/utils/dateFormat';

type SaleDetailViewProps = {
  sale: Sale;
  onCancel?: (id: string, label: string) => void;
  isCancelling?: boolean;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
};

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function SaleDetailView({
  sale,
  onCancel,
  isCancelling = false,
  onDelete,
  isDeleting = false,
}: Readonly<SaleDetailViewProps>) {
  const titleLabel = sale.clientName ? `Venda — ${sale.clientName}` : `Venda ${sale.id.slice(0, 8)}…`;
  const showCancel = Boolean(onCancel && sale.status?.toLowerCase() !== 'cancelled');
  const metricCards = [
    { label: 'Cliente', value: sale.clientName || '—' },
    { label: 'Lote', value: sale.batchName || '—' },
    { label: 'Data da venda', value: formatCalendarDatePtBR(sale.saleDate) },
    { label: 'Status', value: sale.statusLabel || sale.status },
  ];
  const infoItems = [
    { label: 'PESO TOTAL (KG)', value: String(sale.totalWeight) },
    { label: 'PREÇO / KG', value: formatMoney(sale.pricePerKg) },
    { label: 'RECEITA TOTAL', value: formatMoney(sale.totalRevenue) },
    { label: 'DESPESCA TOTAL', value: sale.isTotalHarvest ? 'Sim' : 'Não' },
    { label: 'CATEGORIA FINANCEIRA (ID)', value: sale.financialCategoryId || '—' },
    { label: 'OBSERVAÇÕES', value: sale.notes || '—' },
    { label: 'EMPRESA', value: sale.companyName || '—' },
    { label: 'CRIADO EM', value: formatNullableDatePtBR(sale.createdAt, true) },
    { label: 'ATUALIZADO EM', value: formatNullableDatePtBR(sale.updatedAt, true) },
  ];

  return (
    <EntityDetailShell breadcrumb={<>Dashboard / Vendas / {titleLabel}</>}>
      <DetailPageHero
        icon={<OrdersIcon />}
        title={titleLabel}
        subtitle={
          <>
            {formatCalendarDatePtBR(sale.saleDate)} · {sale.batchName || 'Sem lote'} ·{' '}
            {formatMoney(sale.totalRevenue)}
          </>
        }
        editHref={`/company/sales/${sale.id}/edit`}
        onCancelClick={showCancel ? () => onCancel?.(sale.id, titleLabel) : undefined}
        isCancelling={isCancelling}
        onDeleteClick={onDelete ? () => onDelete(sale.id, titleLabel) : undefined}
        isDeleting={isDeleting}
      />
      <EntityDetailMetricsBody metricCards={metricCards} infoSectionTitle="Detalhes" infoItems={infoItems} />
    </EntityDetailShell>
  );
}
