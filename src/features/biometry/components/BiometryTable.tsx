'use client';

import type { Biometry } from '../types';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';

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

function formatSampleCount(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '—';
  return String(Math.trunc(value));
}

const COLUMNS: Array<DataTableColumn<Biometry>> = [
  {
    id: 'batchName',
    header: 'Lote',
    cellClassName: 'font-medium',
    cell: (row) => {
      return row.batchName;
    },
  },
  {
    id: 'biometryDate',
    header: 'Data',
    cell: (row) => {
      return formatDate(row.biometryDate);
    },
  },
  {
    id: 'sampleQuantity',
    header: 'Qtd. Amostra',
    headerClassName: 'text-right',
    cellClassName: 'text-right',
    cell: (row) => {
      return formatSampleCount(row.sampleQuantity);
    },
  },
  {
    id: 'sampleWeight',
    header: 'Peso Amostra (g)',
    headerClassName: 'text-right',
    cellClassName: 'text-right',
    cell: (row) => {
      if (!Number.isFinite(row.sampleWeight) || row.sampleWeight <= 0) return '—';
      return formatNumber(row.sampleWeight);
    },
  },
  {
    id: 'averageWeight',
    header: 'Peso Médio (g)',
    headerClassName: 'text-right',
    cellClassName: 'text-right font-medium',
    cell: (row) => {
      return formatNumber(row.averageWeight);
    },
  },
  {
    id: 'fcr',
    header: 'FCR',
    headerClassName: 'text-right',
    cellClassName: 'text-right',
    cell: (row) => {
      return formatNumber(row.fcr);
    },
  },
];

export interface BiometryTableProps {
  biometries: Biometry[];
  getRowActions: (row: Biometry) => DataTableAction[];
}

export function BiometryTable({ biometries, getRowActions }: Readonly<BiometryTableProps>) {
  return (
    <DataTable
      data={biometries}
      columns={COLUMNS}
      getRowId={(row) => row.id}
      rowActions={getRowActions}
      emptyState={
        <div className="p-8 text-center text-slate-500">Nenhuma biometria encontrada.</div>
      }
      showPagination={false}
    />
  );
}
