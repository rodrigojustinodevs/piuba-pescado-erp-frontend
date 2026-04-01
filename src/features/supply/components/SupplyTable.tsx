'use client';

import type { Supply } from '../types';
import { getSupplyDefaultUnitLabel } from '../utils/defaultUnitLabel';
import { DataTable, createCrudListRowActions, type DataTableColumn } from '@/shared/components/Table';

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

export function SupplyTable({ supplies }: { supplies: Supply[] }) {
  const columns: Array<DataTableColumn<Supply>> = [
    {
      id: 'name',
      header: 'Produto',
      cell: (row) => <div className="text-sm font-medium text-[#0F172A]">{row.name}</div>,
    },
    {
      id: 'category',
      header: 'Categoria',
      cell: (row) => <div className="text-sm text-slate-600">{row.category || '—'}</div>,
    },
    {
      id: 'defaultUnit',
      header: 'Unidade padrão',
      cell: (row) => (
        <div className="text-sm text-slate-600">{getSupplyDefaultUnitLabel(row.defaultUnit)}</div>
      ),
    },
    {
      id: 'companyName',
      header: 'Empresa',
      cell: (row) => <div className="text-sm text-slate-600">{row.companyName || '—'}</div>,
    },
    {
      id: 'updatedAt',
      header: 'Atualizado em',
      cell: (row) => <div className="text-sm text-slate-500">{formatDateTime(row.updatedAt)}</div>,
    },
  ];

  return (
    <DataTable
      data={supplies}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={createCrudListRowActions({
        basePath: '/company/supplies',
        getRowLabel: (row) => row.name || 'Produto',
      })}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum produto encontrado.</div>}
    />
  );
}

