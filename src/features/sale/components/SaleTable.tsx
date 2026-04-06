'use client';

import type { Sale } from '../types';
import {
  BanIcon,
  DataTable,
  SpinnerIcon,
  createCrudListRowActions,
  type DataTableAction,
  type DataTableColumn,
} from '@/shared/components/Table';
import { formatCalendarDatePtBR } from '@/shared/utils/dateFormat';

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

function statusBadge(status: string): string {
  const k = status?.toLowerCase?.() ?? '';
  switch (k) {
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-700';
    case 'pending':
      return 'bg-amber-100 text-amber-700';
    case 'cancelled':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export type SaleTableProps = {
  sales: Sale[];
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
  onCancel?: (id: string, label: string) => void;
  isCancelling?: boolean;
};

function canCancelSale(row: Sale): boolean {
  return row.status?.toLowerCase() !== 'cancelled';
}

const SALE_COLUMNS: Array<DataTableColumn<Sale>> = [
  {
    id: 'saleDate',
    header: 'Data',
    cell: (row) => (
      <div className="text-sm font-medium text-[#0F172A]">{formatCalendarDatePtBR(row.saleDate)}</div>
    ),
  },
  {
    id: 'clientName',
    header: 'Cliente',
    cell: (row) => <div className="text-sm text-slate-600">{row.clientName || '—'}</div>,
  },
  {
    id: 'batchName',
    header: 'Lote',
    cell: (row) => <div className="text-sm text-slate-600">{row.batchName || '—'}</div>,
  },
  {
    id: 'totalWeight',
    header: 'Peso total',
    cell: (row) => (
      <div className="text-sm text-slate-600 tabular-nums">
        {row.totalWeight} kg
      </div>
    ),
  },
  {
    id: 'pricePerKg',
    header: 'Preço/kg',
    cell: (row) => <div className="text-sm text-slate-600 tabular-nums">{formatMoney(row.pricePerKg)}</div>,
  },
  {
    id: 'totalRevenue',
    header: 'Receita total',
    cell: (row) => (
      <div className="text-sm font-medium text-[#0F172A] tabular-nums">{formatMoney(row.totalRevenue)}</div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(row.status)}`}>
        {row.statusLabel || row.status}
      </span>
    ),
  },
  {
    id: 'updatedAt',
    header: 'Atualizado em',
    cell: (row) => <div className="text-sm text-slate-500">{formatDateTime(row.updatedAt)}</div>,
  },
];

export function SaleTable({
  sales,
  onDelete,
  isDeleting = false,
  onCancel,
  isCancelling = false,
}: Readonly<SaleTableProps>) {
  const baseRowActions = createCrudListRowActions<Sale>({
    basePath: '/company/sales',
    onDelete,
    isDeleting,
    getRowLabel: (row) => row.clientName || row.batchName || row.id,
  });

  const rowActions = (row: Sale): DataTableAction[] => {
    const actions = baseRowActions(row);
    if (!onCancel || !canCancelSale(row)) return actions;
    const label = row.clientName || row.batchName || row.id;
    return [
      ...actions,
      {
        label: 'Cancelar venda',
        onClick: () => onCancel(row.id, label),
        variant: 'danger' as const,
        disabled: isCancelling,
        icon: isCancelling ? (
          <SpinnerIcon className="h-4 w-4 animate-spin" />
        ) : (
          <BanIcon className="h-4 w-4" />
        ),
      },
    ];
  };

  return (
    <DataTable
      data={sales}
      columns={SALE_COLUMNS}
      getRowId={(row) => row.id}
      rowActions={rowActions}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhuma venda encontrada.</div>}
    />
  );
}

