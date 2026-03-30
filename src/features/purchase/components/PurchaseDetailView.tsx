'use client';

import type { Purchase } from '../types';
import { formatPurchaseMoney } from '../utils/formatPurchaseMoney';
import { getPurchaseStatusLabel } from '../utils/purchaseStatusLabels';
import {
  DetailPageHero,
  DetailInfoSection,
  EntityDetailMetricsBody,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { DataTable, type DataTableColumn } from '@/shared/components/Table';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';
import { formatNullableDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';

type PurchaseDetailViewProps = {
  purchase: Purchase;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
  onReceive?: (id: string) => void;
  isReceiving?: boolean;
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
};

function formatPurchaseDate(value: string): string {
  const text = formatNullableDatePtBR(value);
  return text === '—' ? value : text;
}

function summarizeItems(purchase: Purchase): string {
  if (!purchase.items.length) return '—';
  return purchase.items
    .map((item) => `${item.supplyName} (${item.quantity} ${item.unit})`)
    .slice(0, 3)
    .join(' | ');
}

export function PurchaseDetailView({
  purchase,
  onDelete,
  isDeleting = false,
  onReceive,
  isReceiving = false,
  onCancel,
  isCancelling = false,
}: Readonly<PurchaseDetailViewProps>) {
  const titleLabel = `${purchase.supplierName || 'Fornecedor'} — ${formatPurchaseMoney(purchase.totalPrice)}`;
  const itemColumns: Array<DataTableColumn<Purchase['items'][number]>> = [
    {
      id: 'supplyName',
      header: 'Insumo',
      cell: (item) => <div className="text-sm text-slate-700">{item.supplyName || '—'}</div>,
    },
    {
      id: 'quantity',
      header: 'Quantidade',
      align: 'right',
      cell: (item) => <div className="text-sm text-slate-700 tabular-nums">{item.quantity}</div>,
    },
    {
      id: 'unit',
      header: 'Unidade',
      align: 'center',
      cell: (item) => <div className="text-sm text-slate-700">{item.unit || '—'}</div>,
    },
    {
      id: 'unitPrice',
      header: 'Valor unitario',
      align: 'right',
      cell: (item) => (
        <div className="text-sm text-slate-700 tabular-nums">{formatPurchaseMoney(item.unitPrice)}</div>
      ),
    },
    {
      id: 'totalPrice',
      header: 'Subtotal',
      align: 'right',
      cell: (item) => (
        <div className="text-sm font-medium text-[#0F172A] tabular-nums">
          {formatPurchaseMoney(item.totalPrice)}
        </div>
      ),
    },
  ];
  const metricCards = [
    { label: 'Fornecedor', value: purchase.supplierName || '—' },
    { label: 'Data da compra', value: formatPurchaseDate(purchase.purchaseDate) },
    { label: 'Status', value: getPurchaseStatusLabel(purchase.status) },
    { label: 'Total', value: formatPurchaseMoney(purchase.totalPrice) },
  ];
  const infoItems = [
    { label: 'NF / DOCUMENTO', value: purchase.invoiceNumber || '—' },
    { label: 'ITENS', value: String(purchase.items.length) },
    { label: 'RESUMO DOS ITENS', value: summarizeItems(purchase) },
    { label: 'RECEBIDO EM', value: formatNullableDatePtBR(purchase.receivedAt, true) },
    { label: 'CRIADO EM', value: formatNullableDatePtBR(purchase.createdAt, true) },
    { label: 'ÚLTIMA ATUALIZAÇÃO', value: formatRelativeDateTimePtBR(purchase.updatedAt) },
  ];
  const canReceivePurchase = purchase.status?.toLowerCase?.() === 'confirmed';
  const canCancelPurchase = purchase.status?.toLowerCase?.() !== 'received';

  return (
    <EntityDetailShell breadcrumb={<>Dashboard / Compras / {titleLabel}</>}>
      <DetailPageHero
        icon={<OrdersIcon />}
        title={titleLabel}
        subtitle={
          <>
            Fornecedor: {purchase.supplierName || '—'} · Data: {formatPurchaseDate(purchase.purchaseDate)}
          </>
        }
        editHref={`/company/purchases/${purchase.id}/edit`}
        onDeleteClick={onDelete ? () => onDelete(purchase.id, titleLabel) : undefined}
        isDeleting={isDeleting}
        extraActions={
          <>
            {canReceivePurchase ? (
              <button
                type="button"
                disabled={!onReceive || isReceiving}
                onClick={() => onReceive?.(purchase.id)}
                className="rounded-lg bg-[#0EA5A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isReceiving ? 'Recebendo...' : 'Receber compra'}
              </button>
            ) : null}
            {canCancelPurchase ? (
              <button
                type="button"
                disabled={!onCancel || isCancelling}
                onClick={() => onCancel?.(purchase.id)}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? 'Cancelando...' : 'Cancelar compra'}
              </button>
            ) : null}
          </>
        }
      />

      <EntityDetailMetricsBody
        metricCards={metricCards}
        infoSectionTitle="Detalhes"
        infoItems={infoItems}
      />
      <DetailInfoSection title="Itens da compra">
        <DataTable
          data={purchase.items}
          columns={itemColumns}
          getRowId={(item) => item.id || `${item.supplyId}-${item.unit}`}
          emptyState={<div className="p-8 text-center text-slate-500">Nenhum item nesta compra.</div>}
        />
      </DetailInfoSection>
    </EntityDetailShell>
  );
}
