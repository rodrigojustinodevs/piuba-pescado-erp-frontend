'use client';

import type { Purchase } from '../types';
import { getPurchaseStatusLabel } from '../utils/purchaseStatusLabels';
import { formatPurchaseMoney } from '../utils/formatPurchaseMoney';
import {
  DataTable,
  EditIcon,
  EyeIcon,
  SpinnerIcon,
  TrashIcon,
  type DataTableAction,
  type DataTableColumn,
} from '@/shared/components/Table';
import { getStatusBadgeClassNames } from '@/shared/utils/statusBadgeClassNames';

function formatDate(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return value;
  }
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

interface PurchaseTableProps {
  purchases: Purchase[];
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
  onReceive?: (id: string, label: string) => void;
  isReceiving?: boolean;
  onCancel?: (id: string, label: string) => void;
  isCancelling?: boolean;
}

function getRowLabel(row: Purchase): string {
  return `${row.supplierName || 'Fornecedor'} · ${formatPurchaseMoney(row.totalPrice)}`;
}

export function PurchaseTable({
  purchases,
  onDelete,
  isDeleting = false,
  onReceive,
  isReceiving = false,
  onCancel,
  isCancelling = false,
}: Readonly<PurchaseTableProps>) {
  const columns: Array<DataTableColumn<Purchase>> = [
    {
      id: 'purchaseDate',
      header: 'Data',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A]">{formatDate(row.purchaseDate)}</div>
      ),
    },
    {
      id: 'supplierName',
      header: 'Fornecedor',
      cell: (row) => (
        <div className="text-sm text-slate-600">{row.supplierName || '—'}</div>
      ),
    },
    {
      id: 'invoiceNumber',
      header: 'NF / Documento',
      cell: (row) => (
        <div className="text-sm text-slate-600">{row.invoiceNumber ?? '—'}</div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadgeClassNames(row.status, { variant: 'ring' })}`}
        >
          {getPurchaseStatusLabel(row.status)}
        </span>
      ),
    },
    {
      id: 'items',
      header: 'Itens',
      cell: (row) => (
        <div className="text-sm text-slate-600 tabular-nums">{row.items.length}</div>
      ),
    },
    {
      id: 'totalPrice',
      header: 'Total',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A] tabular-nums">
          {formatPurchaseMoney(row.totalPrice)}
        </div>
      ),
    },
    {
      id: 'updatedAt',
      header: 'Atualizado em',
      cell: (row) => (
        <div className="text-sm text-slate-500">{formatDateTime(row.updatedAt)}</div>
      ),
    },
  ];

  return (
    <DataTable
      data={purchases}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={(row) => {
        const actions: DataTableAction[] = [
          {
            label: 'Ver detalhes',
            href: `/company/purchases/${row.id}`,
            icon: <EyeIcon className="h-4 w-4" />,
          },
          {
            label: 'Editar',
            href: `/company/purchases/${row.id}/edit`,
            icon: <EditIcon className="h-4 w-4" />,
          },
        ];

        const canReceivePurchase = row.status?.toLowerCase?.() === 'confirmed';
        if (onReceive && canReceivePurchase) {
          actions.push({
            label: isReceiving ? 'Recebendo...' : 'Receber compra',
            onClick: () => onReceive(row.id, getRowLabel(row)),
            disabled: isReceiving,
            icon: isReceiving ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : undefined,
          });
        }

        const canCancelPurchase = row.status?.toLowerCase?.() !== 'received';
        if (onCancel && canCancelPurchase) {
          actions.push({
            label: isCancelling ? 'Cancelando...' : 'Cancelar compra',
            onClick: () => onCancel(row.id, getRowLabel(row)),
            disabled: isCancelling,
            variant: 'danger',
            icon: isCancelling ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : undefined,
          });
        }

        if (onDelete) {
          actions.push({
            label: 'Excluir',
            onClick: () => onDelete(row.id, getRowLabel(row)),
            variant: 'danger',
            disabled: isDeleting,
            icon: isDeleting ? (
              <SpinnerIcon className="h-4 w-4 animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            ),
          });
        }

        return actions;
      }}
      emptyState={
        <div className="p-8 text-center text-slate-500">Nenhuma compra encontrada.</div>
      }
    />
  );
}
