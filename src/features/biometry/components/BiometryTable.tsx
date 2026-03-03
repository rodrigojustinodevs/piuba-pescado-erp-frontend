'use client';

import type { Biometry } from '../types';
import { DataTable, EditIcon, EyeIcon, type DataTableColumn } from '@/shared/components/Table';

function formatDate(value: string): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return value;
  }
}

function formatNumber(value: number): string {
  return Number.isFinite(value) ? String(value) : '—';
}

interface BiometryTableProps {
  biometries: Biometry[];
}

export function BiometryTable({ biometries }: BiometryTableProps) {
  const columns: Array<DataTableColumn<Biometry>> = [
    {
      id: 'batchName',
      header: 'Lote',
      cell: (row) => <div className="text-sm font-medium text-[#0F172A]">{row.batchName}</div>,
    },
    {
      id: 'biometryDate',
      header: 'Data da biometria',
      cell: (row) => <div className="text-sm text-slate-600">{formatDate(row.biometryDate)}</div>,
    },
    {
      id: 'averageWeight',
      header: 'Peso médio',
      cell: (row) => (
        <div className="text-sm text-slate-600">{formatNumber(row.averageWeight)}</div>
      ),
    },
    {
      id: 'fcr',
      header: 'FCR',
      cell: (row) => <div className="text-sm text-slate-600">{formatNumber(row.fcr)}</div>,
    },
    {
      id: 'createdAt',
      header: 'Criado em',
      cell: (row) => <div className="text-sm text-slate-500">{formatDate(row.createdAt)}</div>,
    },
  ];

  return (
    <DataTable
      data={biometries}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={(row) => [
        {
          label: 'Ver detalhes',
          href: `/company/biometries/${row.id}`,
          icon: <EyeIcon className="h-4 w-4" />,
        },
        {
          label: 'Editar',
          href: `/company/biometries/${row.id}/edit`,
          icon: <EditIcon className="h-4 w-4" />,
        },
      ]}
      emptyState={
        <div className="p-8 text-center text-slate-500">Nenhuma biometria encontrada.</div>
      }
    />
  );
}
