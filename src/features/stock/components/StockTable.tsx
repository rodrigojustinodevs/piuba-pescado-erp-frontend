'use client';

import type { Stock } from '../types';
import {
  AdjustIcon,
  DataTable,
  EyeIcon,
  EditIcon,
  SpinnerIcon,
  TrashIcon,
  type DataTableAction,
  type DataTableColumn,
} from '@/shared/components/Table';

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

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

interface StockTableProps {
  stocks: Stock[];
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
  onAdjust?: (id: string, label: string) => void;
  isAdjusting?: boolean;
}

function getRowLabel(row: Stock): string {
  return row.supplyName || 'Estoque';
}

export function StockTable({
  stocks,
  onDelete,
  isDeleting = false,
  onAdjust,
  isAdjusting = false,
}: Readonly<StockTableProps>) {
  const columns: Array<DataTableColumn<Stock>> = [
    {
      id: 'supplyName',
      header: 'Insumo',
      cell: (row) => <div className="text-sm font-medium text-[#0F172A]">{row.supplyName || '—'}</div>,
    },
    {
      id: 'supplierName',
      header: 'Fornecedor',
      cell: (row) => <div className="text-sm text-slate-600">{row.supplierName || '—'}</div>,
    },
    {
      id: 'currentQuantity',
      header: 'Qtd. atual',
      cell: (row) => (
        <div className="text-sm text-slate-600 tabular-nums">
          {row.currentQuantity} {row.unit}
        </div>
      ),
    },
    {
      id: 'minimumStock',
      header: 'Estoque mínimo',
      cell: (row) => (
        <div className="text-sm text-slate-600 tabular-nums">
          {row.minimumStock} {row.unit}
        </div>
      ),
    },
    {
      id: 'unitPrice',
      header: 'Preço unitário',
      cell: (row) => <div className="text-sm text-slate-600 tabular-nums">{formatMoney(row.unitPrice)}</div>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            row.isBelowMinimum ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {row.isBelowMinimum ? 'Abaixo do mínimo' : 'Adequado'}
        </span>
      ),
    },
    {
      id: 'updatedAt',
      header: 'Atualizado em',
      cell: (row) => <div className="text-sm text-slate-500">{formatDateTime(row.updatedAt)}</div>,
    },
  ];

  return (
    <DataTable
      data={stocks}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={(row): DataTableAction[] => {
        const actions: DataTableAction[] = [
          {
            label: 'Ver detalhes',
            href: `/company/stocks/${row.id}`,
            icon: <EyeIcon className="h-4 w-4" />,
          },
          {
            label: 'Editar',
            href: `/company/stocks/${row.id}/edit`,
            icon: <EditIcon className="h-4 w-4" />,
          },
        ];

        if (onAdjust) {
          actions.push({
            label: 'Ajustar',
            onClick: () => onAdjust(row.id, getRowLabel(row)),
            disabled: isAdjusting,
            icon: isAdjusting ? (
              <SpinnerIcon className="h-4 w-4 animate-spin" />
            ) : (
              <AdjustIcon className="h-4 w-4" />
            ),
          });
        }

        if (!onDelete) return actions;

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

        return actions;
      }}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum estoque encontrado.</div>}
    />
  );
}
