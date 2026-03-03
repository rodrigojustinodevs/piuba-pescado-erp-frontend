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

function getBatchLabel(row: Transfer): string {
  if (row.batchName) return row.batchName;
  if (row.batchId) return `${row.batchId.slice(0, 8)}…`;
  return '—';
}

function getTankLabel(id: string, name?: string): string {
  if (name) return name;
  if (id) return `${id.slice(0, 8)}…`;
  return '—';
}

function renderBatchCell(row: Transfer) {
  return <BatchCell label={getBatchLabel(row)} />;
}

function renderOriginTankCell(row: Transfer) {
  return <TextCell text={getTankLabel(row.originTankId, row.originTankName)} />;
}

function renderDestinationTankCell(row: Transfer) {
  return <TextCell text={getTankLabel(row.destinationTankId, row.destinationTankName)} />;
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
  onDelete,
  isDeleting = false,
}: Readonly<TransferTableProps>) {
  const columns: Array<DataTableColumn<Transfer>> = [
    {
      id: 'batchId',
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
