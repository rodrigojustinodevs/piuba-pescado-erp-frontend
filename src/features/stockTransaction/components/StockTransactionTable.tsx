'use client';

import type { StockTransaction } from '../types';
import { DataTable, type DataTableColumn } from '@/shared/components/Table';

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDateTime(value: string): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
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

function getDirectionLabel(dir: StockTransaction['direction']): string {
  return dir === 'in' ? 'Entrada' : 'Saída';
}

function getReferenceTypeLabel(type: StockTransaction['referenceType']): string {
  switch (type) {
    case 'purchase_item':
      return 'Item de compra';
    case 'feeding':
      return 'Alimentação';
    case 'adjustment':
      return 'Ajuste';
    case 'transfer':
      return 'Transferência';
    case 'stocking':
      return 'Povoamento';
    case 'sale':
      return 'Venda';
    default:
      return type;
  }
}

export function StockTransactionTable({ transactions }: { transactions: StockTransaction[] }) {
  const columns: Array<DataTableColumn<StockTransaction>> = [
    {
      id: 'createdAt',
      header: 'Data',
      cell: (row) => <div className="text-sm text-slate-600">{formatDateTime(row.createdAt)}</div>,
    },
    {
      id: 'direction',
      header: 'Direção',
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            row.direction === 'in'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {getDirectionLabel(row.direction)}
        </span>
      ),
    },
    {
      id: 'quantity',
      header: 'Quantidade',
      cell: (row) => (
        <div className="text-sm text-slate-600 tabular-nums">
          {row.quantity} {row.unit}
        </div>
      ),
    },
    {
      id: 'unitPrice',
      header: 'Preço unit.',
      cell: (row) => <div className="text-sm text-slate-600 tabular-nums">{formatMoney(row.unitPrice)}</div>,
    },
    {
      id: 'totalCost',
      header: 'Custo total',
      cell: (row) => <div className="text-sm text-slate-600 tabular-nums">{formatMoney(row.totalCost)}</div>,
    },
    {
      id: 'referenceType',
      header: 'Referência',
      cell: (row) => <div className="text-sm text-slate-600">{getReferenceTypeLabel(row.referenceType)}</div>,
    },
    {
      id: 'referenceId',
      header: 'ID Referência',
      cell: (row) => <div className="text-sm text-slate-500 font-mono">{row.referenceId}</div>,
    },
  ];

  return (
    <DataTable
      data={transactions}
      columns={columns}
      getRowId={(row) => row.id}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhuma transação encontrada.</div>}
    />
  );
}

