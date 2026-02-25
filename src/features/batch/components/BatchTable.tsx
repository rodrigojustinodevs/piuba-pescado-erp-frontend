'use client';

import type { Batch } from '../types';
import {
  DataTable,
  EditIcon,
  EyeIcon,
  SpinnerIcon,
  TrashIcon,
  type DataTableColumn,
} from '@/shared/components/Table';
import { BatchStatusBadge } from './BatchStatusBadge';
import { formatDate, formatQuantity, getCultivationLabel } from '../utils/format';

const CELL_TEXT_CLASS = 'text-sm text-slate-600';

type BatchDescriptionCellProps = {
  description: Batch['description'];
};

function BatchDescriptionCell({ description }: Readonly<BatchDescriptionCellProps>) {
  return <div className={CELL_TEXT_CLASS}>{description ?? '—'}</div>;
}

function renderBatchDescriptionCell(batch: Batch) {
  return <BatchDescriptionCell description={batch.description} />;
}

export interface BatchTableProps {
  batches: Batch[];
  onDelete: (id: string, species: string) => void;
  isDeleting?: boolean;
}

export function BatchTable({ batches, onDelete, isDeleting = false }: BatchTableProps) {
  const columns: Array<DataTableColumn<Batch>> = [
    {
      id: 'name',
      header: 'Nome',
      cell: (batch) => (
        <div className="text-sm font-medium text-[#0F172A]">{batch.name ?? '—'}</div>
      ),
    },
    {
      id: 'description',
      header: 'Descrição',
      cell: renderBatchDescriptionCell,
    },
    {
      id: 'species',
      header: 'Espécie',
      cell: (batch) => <div className={CELL_TEXT_CLASS}>{batch.species}</div>,
    },
    {
      id: 'tank',
      header: 'Tanque',
      cell: (batch) => <div className={CELL_TEXT_CLASS}>{batch.tank?.name ?? '—'}</div>,
    },
    {
      id: 'initialQuantity',
      header: 'Quantidade Inicial',
      cell: (batch) => (
        <div className={CELL_TEXT_CLASS}>{formatQuantity(batch.initialQuantity)}</div>
      ),
    },
    {
      id: 'cultivation',
      header: 'Cultivo',
      cell: (batch) => (
        <div className={CELL_TEXT_CLASS}>{getCultivationLabel(batch.cultivation)}</div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (batch) => <BatchStatusBadge status={batch.status} />,
    },
    {
      id: 'entryDate',
      header: 'Entrada',
      cell: (batch) => <div className={CELL_TEXT_CLASS}>{formatDate(batch.entryDate)}</div>,
    },
  ];

  if (batches.length === 0) {
    return <div className="p-8 text-center text-slate-500">Nenhum lote encontrado.</div>;
  }

  return (
    <DataTable
      data={batches}
      columns={columns}
      getRowId={(batch) => batch.id}
      rowActions={(batch) => [
        {
          label: 'Ver detalhes',
          href: `/company/batches/${batch.id}`,
          icon: <EyeIcon className="h-4 w-4" />,
        },
        {
          label: 'Editar',
          href: `/company/batches/${batch.id}/edit`,
          icon: <EditIcon className="h-4 w-4" />,
        },
        {
          label: 'Excluir',
          onClick: () => onDelete(batch.id, batch.species),
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
