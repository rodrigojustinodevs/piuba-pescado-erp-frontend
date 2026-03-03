'use client';

import type { Stocking } from '../types';
import { formatDatePtBR } from '@/shared/utils/dateFormat';
import {
  DataTable,
  EditIcon,
  EyeIcon,
  SpinnerIcon,
  TrashIcon,
  type DataTableAction,
  type DataTableColumn,
} from '@/shared/components/Table';

const CELL_TEXT_CLASS = 'text-sm text-slate-600';

interface StockingTableProps {
  stockings: Stocking[];
  batchMap?: Record<string, string>;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
}

type StockingRowProps = { row: Stocking; batchMap?: Record<string, string> };

function getBatchLabel(row: Stocking, batchMap: Record<string, string> = {}): string {
  if (row.batchName) return row.batchName;
  if (row.batchId && batchMap[row.batchId]) return batchMap[row.batchId];
  if (row.batchId) return `${row.batchId.slice(0, 8)}…`;
  return '—';
}

function getRowLabel(row: Stocking, batchMap: Record<string, string> = {}): string {
  return `${getBatchLabel(row, batchMap)} - ${formatDatePtBR(row.stockingDate)}`;
}

function StockingDateCell({ row }: Readonly<StockingRowProps>) {
  return (
    <div className="text-sm font-medium text-[#0F172A]">{formatDatePtBR(row.stockingDate)}</div>
  );
}

function BatchCell({ row, batchMap }: Readonly<StockingRowProps>) {
  return <div className={CELL_TEXT_CLASS}>{getBatchLabel(row, batchMap)}</div>;
}

function QuantityCell({ row }: Readonly<StockingRowProps>) {
  return <div className={CELL_TEXT_CLASS}>{row.quantity}</div>;
}

function AverageWeightCell({ row }: Readonly<StockingRowProps>) {
  return <div className={CELL_TEXT_CLASS}>{row.averageWeight}</div>;
}

function CreatedAtCell({ row }: Readonly<StockingRowProps>) {
  return <div className={CELL_TEXT_CLASS}>{formatDatePtBR(row.createdAt)}</div>;
}

function buildColumns(batchMap: Record<string, string>): Array<DataTableColumn<Stocking>> {
  return [
    {
      id: 'stockingDate',
      header: 'Data do povoamento',
      cell: (row) => <StockingDateCell row={row} batchMap={batchMap} />,
    },
    {
      id: 'batchId',
      header: 'Lote',
      cell: (row) => <BatchCell row={row} batchMap={batchMap} />,
    },
    {
      id: 'quantity',
      header: 'Quantidade',
      cell: (row) => <QuantityCell row={row} batchMap={batchMap} />,
    },
    {
      id: 'averageWeight',
      header: 'Peso médio (kg)',
      cell: (row) => <AverageWeightCell row={row} batchMap={batchMap} />,
    },
    {
      id: 'createdAt',
      header: 'Criado em',
      cell: (row) => <CreatedAtCell row={row} batchMap={batchMap} />,
    },
  ];
}

export function StockingTable({
  stockings,
  batchMap = {},
  onDelete,
  isDeleting = false,
}: Readonly<StockingTableProps>) {
  const columns = buildColumns(batchMap);

  if (stockings.length === 0) {
    return <div className="p-8 text-center text-slate-500">Nenhum povoamento encontrado.</div>;
  }

  const rowActions = (row: Stocking): DataTableAction[] => {
    const baseActions: DataTableAction[] = [
      {
        label: 'Ver detalhes',
        href: `/company/stockings/${row.id}`,
        icon: <EyeIcon className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        href: `/company/stockings/${row.id}/edit`,
        icon: <EditIcon className="h-4 w-4" />,
      },
    ];

    if (onDelete) {
      baseActions.push({
        label: 'Excluir',
        onClick: () => onDelete(row.id, getRowLabel(row, batchMap)),
        variant: 'danger',
        disabled: isDeleting,
        icon: isDeleting ? (
          <SpinnerIcon className="h-4 w-4 animate-spin" />
        ) : (
          <TrashIcon className="h-4 w-4" />
        ),
      });
    }

    return baseActions;
  };

  return (
    <DataTable
      data={stockings}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={rowActions}
    />
  );
}
