'use client';

import type { Transfer } from '../types';
import { formatDatePtBR } from '@/shared/utils/dateFormat';
import {
  DataTable,
  EditIcon,
  EyeIcon,
  SpinnerIcon,
  TrashIcon,
  type DataTableColumn,
} from '@/shared/components/Table';

const CELL_TEXT_CLASS = 'text-sm text-slate-600';

interface TransferTableProps {
  transfers: Transfer[];
  batchMap?: Record<string, string>;
  tankMap?: Record<string, string>;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function TransferTable({
  transfers,
  batchMap = {},
  tankMap = {},
  onDelete,
  isDeleting = false,
}: TransferTableProps) {
  const getBatchLabel = (batcheId: string) => batchMap[batcheId] ?? `${batcheId.slice(0, 8)}…`;
  const getTankLabel = (tankId: string) => tankMap[tankId] ?? `${tankId.slice(0, 8)}…`;

  const columns: Array<DataTableColumn<Transfer>> = [
    {
      id: 'batcheId',
      header: 'Lote',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A]">{getBatchLabel(row.batcheId)}</div>
      ),
    },
    {
      id: 'originTankId',
      header: 'Origem',
      cell: (row) => <div className={CELL_TEXT_CLASS}>{getTankLabel(row.originTankId)}</div>,
    },
    {
      id: 'destinationTankId',
      header: 'Destino',
      cell: (row) => <div className={CELL_TEXT_CLASS}>{getTankLabel(row.destinationTankId)}</div>,
    },
    {
      id: 'quantity',
      header: 'Quantidade',
      cell: (row) => <div className={CELL_TEXT_CLASS}>{row.quantity}</div>,
    },
    {
      id: 'description',
      header: 'Descrição',
      cell: (row) => <div className={CELL_TEXT_CLASS}>{row.description || '—'}</div>,
    },
    {
      id: 'createdAt',
      header: 'Criado em',
      cell: (row) => (
        <div className={CELL_TEXT_CLASS}>{row.createdAt ? formatDatePtBR(row.createdAt) : '—'}</div>
      ),
    },
  ];

  if (transfers.length === 0) {
    return <div className="p-8 text-center text-slate-500">Nenhuma transferência encontrada.</div>;
  }

  return (
    <DataTable
      data={transfers}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={(row) => [
        {
          label: 'Ver detalhes',
          href: `/company/transfers/${row.id}`,
          icon: <EyeIcon className="h-4 w-4" />,
        },
        {
          label: 'Editar',
          href: `/company/transfers/${row.id}/edit`,
          icon: <EditIcon className="h-4 w-4" />,
        },
        {
          label: 'Excluir',
          onClick: () => onDelete(row.id),
          variant: 'danger',
          disabled: isDeleting,
          icon: isDeleting ? (
            <SpinnerIcon className="h-4 w-4 animate-spin" />
          ) : (
            <TrashIcon className="h-4 w-4" />
          ),
        },
      ]}
    />
  );
}
