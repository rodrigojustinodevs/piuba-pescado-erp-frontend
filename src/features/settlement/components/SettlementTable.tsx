'use client';

import type { Settlement } from '../types';
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

interface SettlementTableProps {
  settlements: Settlement[];
  batchMap?: Record<string, string>;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
}

export function SettlementTable({
  settlements,
  batchMap = {},
  onDelete,
  isDeleting = false,
}: SettlementTableProps) {
  const getBatchLabel = (batcheId: string) => batchMap[batcheId] ?? `${batcheId.slice(0, 8)}…`;

  const getRowLabel = (row: Settlement) =>
    `${getBatchLabel(row.batcheId)} - ${formatDatePtBR(row.settlementDate)}`;

  const columns: Array<DataTableColumn<Settlement>> = [
    {
      id: 'settlementDate',
      header: 'Data do povoamento',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A]">
          {formatDatePtBR(row.settlementDate)}
        </div>
      ),
    },
    {
      id: 'batcheId',
      header: 'Lote',
      cell: (row) => <div className={CELL_TEXT_CLASS}>{getBatchLabel(row.batcheId)}</div>,
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

  if (settlements.length === 0) {
    return <div className="p-8 text-center text-slate-500">Nenhum povoamento encontrado.</div>;
  }

  const rowActions = (row: Settlement) => {
    const baseActions = [
      {
        label: 'Ver detalhes',
        href: `/company/settlements/${row.id}`,
        icon: <EyeIcon className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        href: `/company/settlements/${row.id}/edit`,
        icon: <EditIcon className="h-4 w-4" />,
      },
    ];

    if (onDelete) {
      baseActions.push({
        label: 'Excluir',
        onClick: () => onDelete(row.id, getRowLabel(row)),
        variant: 'danger' as const,
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
      data={settlements}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={rowActions}
    />
  );
}
