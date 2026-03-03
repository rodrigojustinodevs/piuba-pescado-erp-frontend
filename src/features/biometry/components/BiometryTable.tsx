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

type CellRowProps = { row: Biometry };

function BatchNameCell({ row }: Readonly<CellRowProps>) {
  return <div className="text-sm font-medium text-[#0F172A]">{row.batchName}</div>;
}

function BiometryDateCell({ row }: Readonly<CellRowProps>) {
  return <div className="text-sm text-slate-600">{formatDate(row.biometryDate)}</div>;
}

function AverageWeightCell({ row }: Readonly<CellRowProps>) {
  return <div className="text-sm text-slate-600">{formatNumber(row.averageWeight)}</div>;
}

function FcrCell({ row }: Readonly<CellRowProps>) {
  return <div className="text-sm text-slate-600">{formatNumber(row.fcr)}</div>;
}

function CreatedAtCell({ row }: Readonly<CellRowProps>) {
  return <div className="text-sm text-slate-500">{formatDate(row.createdAt)}</div>;
}

const COLUMNS: Array<DataTableColumn<Biometry>> = [
  { id: 'batchName', header: 'Lote', cell: (row) => <BatchNameCell row={row} /> },
  {
    id: 'biometryDate',
    header: 'Data da biometria',
    cell: (row) => <BiometryDateCell row={row} />,
  },
  { id: 'averageWeight', header: 'Peso médio', cell: (row) => <AverageWeightCell row={row} /> },
  { id: 'fcr', header: 'FCR', cell: (row) => <FcrCell row={row} /> },
  { id: 'createdAt', header: 'Criado em', cell: (row) => <CreatedAtCell row={row} /> },
];

interface BiometryTableProps {
  biometries: Biometry[];
}

export function BiometryTable({ biometries }: Readonly<BiometryTableProps>) {
  return (
    <DataTable
      data={biometries}
      columns={COLUMNS}
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
