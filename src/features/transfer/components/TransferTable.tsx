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

type BatchCellProps = { label: string };
function BatchCell({ label }: Readonly<BatchCellProps>) {
  return <div className="text-sm font-medium text-[#0F172A]">{label}</div>;
}

type TextCellProps = { text: string };
function TextCell({ text }: Readonly<TextCellProps>) {
  return <div className={CELL_TEXT_CLASS}>{text}</div>;
}

export function TransferTable({
  transfers,
  batchMap = {},
  tankMap = {},
  onDelete,
  isDeleting = false,
}: Readonly<TransferTableProps>) {
  const getBatchLabel = (batcheId: string) => batchMap[batcheId] ?? `${batcheId.slice(0, 8)}…`;
  const getTankLabel = (tankId: string) => tankMap[tankId] ?? `${tankId.slice(0, 8)}…`;

  const columns: Array<DataTableColumn<Transfer>> = [
    {
      id: 'batcheId',
      header: 'Lote',
      cell: (row) => <BatchCell label={getBatchLabel(row.batcheId)} />,
    },
    {
      id: 'originTankId',
      header: 'Origem',
      cell: (row) => <TextCell text={getTankLabel(row.originTankId)} />,
    },
    {
      id: 'destinationTankId',
      header: 'Destino',
      cell: (row) => <TextCell text={getTankLabel(row.destinationTankId)} />,
    },
    {
      id: 'quantity',
      header: 'Quantidade',
      cell: (row) => <TextCell text={String(row.quantity)} />,
    },
    {
      id: 'description',
      header: 'Descrição',
      cell: (row) => <TextCell text={row.description || '—'} />,
    },
    {
      id: 'createdAt',
      header: 'Criado em',
      cell: (row) => <TextCell text={row.createdAt ? formatDatePtBR(row.createdAt) : '—'} />,
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
