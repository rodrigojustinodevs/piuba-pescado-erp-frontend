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

export function StockingTable({
  stockings,
  batchMap = {},
  onDelete,
  isDeleting = false,
}: Readonly<StockingTableProps>) {
  const getBatchLabel = (row: Stocking) =>
    row.batchName ?? batchMap[row.batchId] ?? (row.batchId ? `${row.batchId.slice(0, 8)}…` : '—');

  const getRowLabel = (row: Stocking) =>
    `${getBatchLabel(row)} - ${formatDatePtBR(row.stockingDate)}`;

  const columns: Array<DataTableColumn<Stocking>> = [
    {
      id: 'stockingDate',
      header: 'Data do povoamento',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A]">{formatDatePtBR(row.stockingDate)}</div>
      ),
    },
    {
      id: 'batchId',
      header: 'Lote',
      cell: (row) => <div className={CELL_TEXT_CLASS}>{getBatchLabel(row)}</div>,
    },
    {
      id: 'quantity',
      header: 'Quantidade',
      cell: (row) => <div className={CELL_TEXT_CLASS}>{row.quantity}</div>,
    },
    {
      id: 'averageWeight',
      header: 'Peso médio (kg)',
      cell: (row) => <div className={CELL_TEXT_CLASS}>{row.averageWeight}</div>,
    },
    {
      id: 'createdAt',
      header: 'Criado em',
      cell: (row) => <div className={CELL_TEXT_CLASS}>{formatDatePtBR(row.createdAt)}</div>,
    },
  ];

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
        onClick: () => onDelete(row.id, getRowLabel(row)),
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
