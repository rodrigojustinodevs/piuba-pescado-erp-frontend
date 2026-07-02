'use client';

import type { Sale } from '../types';
import {
  BanIcon,
  DataTable,
  SpinnerIcon,
  type DataTableAction,
  type DataTableColumn,
} from '@/shared/components/Table';
import { Eye, Pencil, Trash, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatCalendarDatePtBR } from '@/shared/utils/dateFormat';
import { getStatusBadgeClassNames } from '@/shared/utils/statusBadgeClassNames';

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pix: 'PIX',
  bank_slip: 'Boleto bancário',
  bank_transfer: 'Transferência bancária',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  cash: 'Dinheiro',
  check: 'Cheque',
};

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr.replace(' ', 'T'));
  return d < today;
}

function StatusBadge({ sale }: { sale: Sale }) {
  const key = sale.status?.toLowerCase() ?? '';
  const label = sale.statusLabel || sale.status;
  const baseClass = `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClassNames(sale.status)}`;

  if (key === 'paid' || key === 'paga') {
    return (
      <span className={baseClass}>
        <CheckCircle className="h-3 w-3" />
        {label}
      </span>
    );
  }
  if (key === 'overdue' || key === 'atrasada') {
    return (
      <span className={baseClass}>
        <AlertTriangle className="h-3 w-3" />
        {label}
      </span>
    );
  }
  return <span className={baseClass}>{label}</span>;
}

export type SaleTableProps = {
  sales: Sale[];
  onView?: (sale: Sale) => void;
  onEdit?: (sale: Sale) => void;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
  onCancel?: (id: string, label: string) => void;
  isCancelling?: boolean;
};

function canCancelSale(row: Sale): boolean {
  const s = row.status?.toLowerCase();
  return s !== 'cancelled' && s !== 'cancelada' && s !== 'paid' && s !== 'paga';
}

const SALE_COLUMNS: Array<DataTableColumn<Sale>> = [
  {
    id: 'code',
    header: 'Código',
    cell: (row) => (
      <div className="text-xs font-mono text-slate-500 whitespace-nowrap">{row.code || '—'}</div>
    ),
  },
  {
    id: 'numberNf',
    header: 'Nota Fiscal',
    cell: (row) => (
      <div className="text-xs text-slate-500">{row.numberNf || '—'}</div>
    ),
  },
  {
    id: 'clientName',
    header: 'Cliente',
    cell: (row) => (
      <div className="text-sm font-semibold text-[#0F172A]">{row.clientName || '—'}</div>
    ),
  },
  {
    id: 'saleDate',
    header: 'Data',
    cell: (row) => (
      <div className="text-sm text-slate-600 whitespace-nowrap">
        {formatCalendarDatePtBR(row.saleDate)}
      </div>
    ),
  },
  {
    id: 'dueDate',
    header: 'Vencimento',
    cell: (row) => {
      const overdue = isOverdue(row.dueDate);
      return (
        <div className={`text-sm whitespace-nowrap font-medium ${overdue ? 'text-red-500' : 'text-slate-600'}`}>
          {row.dueDate ? formatCalendarDatePtBR(row.dueDate) : '—'}
        </div>
      );
    },
  },
  {
    id: 'paymentMethod',
    header: 'Pagamento',
    cell: (row) => (
      <div className="text-sm text-slate-600">{PAYMENT_METHOD_LABELS[row.paymentMethod ?? ''] ?? row.paymentMethod ?? '—'}</div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => <StatusBadge sale={row} />,
  },
  {
    id: 'totalRevenue',
    header: 'Total',
    headerClassName: 'text-right',
    cell: (row) => (
      <div className="text-sm font-medium text-[#0F172A] tabular-nums text-right">
        {formatMoney(row.totalRevenue)}
      </div>
    ),
  },
];

export function SaleTable({
  sales,
  onView,
  onEdit,
  onDelete,
  isDeleting = false,
  onCancel,
  isCancelling = false,
}: Readonly<SaleTableProps>) {
  const rowActions = (row: Sale): DataTableAction[] => {
    const label = row.clientName || row.batchName || row.id;
    const actions: DataTableAction[] = [];

    if (onView) {
      actions.push({
        label: 'Ver detalhes',
        onClick: () => onView(row),
        icon: <Eye className="h-4 w-4" />,
      });
    }

    if (onEdit) {
      actions.push({
        label: 'Editar',
        onClick: () => onEdit(row),
        icon: <Pencil className="h-4 w-4" />,
      });
    }

    if (onDelete) {
      actions.push({
        label: 'Excluir',
        onClick: () => onDelete(row.id, label),
        variant: 'danger' as const,
        disabled: isDeleting,
        icon: isDeleting ? (
          <SpinnerIcon className="h-4 w-4 animate-spin" />
        ) : (
          <Trash className="h-4 w-4" />
        ),
      });
    }

    if (onCancel && canCancelSale(row)) {
      actions.push({
        label: 'Cancelar venda',
        onClick: () => onCancel(row.id, label),
        variant: 'danger' as const,
        disabled: isCancelling,
        icon: isCancelling ? (
          <SpinnerIcon className="h-4 w-4 animate-spin" />
        ) : (
          <BanIcon className="h-4 w-4" />
        ),
      });
    }

    return actions;
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
