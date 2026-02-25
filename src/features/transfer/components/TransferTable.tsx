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

function createBatchCellRenderer(batchMap: Record<string, string>) {
  return function renderBatchCell(row: Transfer) {
    const label = batchMap[row.batcheId] ?? `${row.batcheId.slice(0, 8)}…`;
    return <BatchCell label={label} />;
  };
}

function createOriginTankCellRenderer(tankMap: Record<string, string>) {
  return function renderOriginTankCell(row: Transfer) {
    const label = tankMap[row.originTankId] ?? `${row.originTankId.slice(0, 8)}…`;
    return <TextCell text={label} />;
  };
}

function createDestinationTankCellRenderer(tankMap: Record<string, string>) {
  return function renderDestinationTankCell(row: Transfer) {
    const label = tankMap[row.destinationTankId] ?? `${row.destinationTankId.slice(0, 8)}…`;
    return <TextCell text={label} />;
  };
}

function renderQuantityCell(row: Transfer) {
  return <TextCell text={String(row.quantity)} />;
}

function renderDescriptionCell(row: Transfer) {
  return <TextCell text={row.description || '—'} />;
}

function renderCreatedAtCell(row: Transfer) {
  return <TextCell text={row.createdAt ? formatDatePtBR(row.createdAt) : '—'} />;
}

export function TransferTable({
  transfers,
  batchMap = {},
  tankMap = {},
  onDelete,
  isDeleting = false,
}: Readonly<TransferTableProps>) {
  const renderBatchCell = createBatchCellRenderer(batchMap);
  const renderOriginTankCell = createOriginTankCellRenderer(tankMap);
  const renderDestinationTankCell = createDestinationTankCellRenderer(tankMap);

  const columns: Array<DataTableColumn<Transfer>> = [
    {
      id: 'batcheId',
      header: 'Lote',
      cell: renderBatchCell,
    },
    {
      id: 'originTankId',
      header: 'Origem',
      cell: renderOriginTankCell,
    },
    {
      id: 'destinationTankId',
      header: 'Destino',
      cell: renderDestinationTankCell,
    },
    {
      id: 'quantity',
      header: 'Quantidade',
      cell: renderQuantityCell,
    },
    {
      id: 'description',
      header: 'Descrição',
      cell: renderDescriptionCell,
    },
    {
      id: 'createdAt',
      header: 'Criado em',
      cell: renderCreatedAtCell,
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
