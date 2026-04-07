'use client';

import { EnableIcon } from '@/src/shared/components/Table/ActionIcons';
import type { FinancialCategory } from '../types';
import { displayFinancialCategoryStatus, displayFinancialCategoryType } from '../utils/labels';
import { getFinancialCategoryTypeBadgeClassNames } from '../utils/typeBadgeClassNames';
import {
  BanIcon,
  DataTable,
  EditIcon,
  EyeIcon,
  SpinnerIcon,
  TrashIcon,
  type DataTableAction,
  type DataTableColumn,
} from '@/shared/components/Table';
import { getStatusBadgeClassNames } from '@/shared/utils/statusBadgeClassNames';

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

export type FinancialCategoryTableProps = {
  financialCategories: FinancialCategory[];
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
  onActivate?: (id: string, label: string) => void;
  isActivating?: boolean;
  onDeactivate?: (id: string, label: string) => void;
  isDeactivating?: boolean;
};

const FINANCIAL_CATEGORY_COLUMNS: Array<DataTableColumn<FinancialCategory>> = [
  {
    id: 'name',
    header: 'Categoria',
    cell: (row) => <div className="text-sm font-medium text-[#0F172A]">{row.name}</div>,
  },
  {
    id: 'typeLabel',
    header: 'Tipo',
    cell: (row) => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getFinancialCategoryTypeBadgeClassNames(row.type)}`}
      >
        {displayFinancialCategoryType(row)}
      </span>
    ),
  },
  {
    id: 'statusLabel',
    header: 'Status',
    cell: (row) => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClassNames(row.status)}`}
      >
        {displayFinancialCategoryStatus(row)}
      </span>
    ),
  },
  {
    id: 'companyName',
    header: 'Empresa',
    cell: (row) => <div className="text-sm text-slate-600">{row.companyName || '—'}</div>,
  },
  {
    id: 'updatedAt',
    header: 'Atualizado em',
    cell: (row) => <div className="text-sm text-slate-500">{formatDateTime(row.updatedAt)}</div>,
  },
];

type RowActionsConfig = {
  onDelete?: (id: string, label: string) => void;
  isDeleting: boolean;
  onActivate?: (id: string, label: string) => void;
  isActivating: boolean;
  onDeactivate?: (id: string, label: string) => void;
  isDeactivating: boolean;
};

function buildRowActions(row: FinancialCategory, config: RowActionsConfig): DataTableAction[] {
  const { onDelete, isDeleting, onActivate, isActivating, onDeactivate, isDeactivating } = config;
  const actions: DataTableAction[] = [
    {
      label: 'Ver detalhes',
      href: `/company/financial-categories/${row.id}`,
      icon: <EyeIcon className="h-4 w-4" />,
    },
    {
      label: 'Editar',
      href: `/company/financial-categories/${row.id}/edit`,
      icon: <EditIcon className="h-4 w-4" />,
    },
  ];

  const isActive = row.status?.toLowerCase?.() === 'active';
  const rowLabel = row.name || row.id;

  if (onActivate && !isActive) {
    actions.push({
      label: isActivating ? 'Ativando...' : 'Ativar',
      onClick: () => onActivate(row.id, rowLabel),
      disabled: isActivating,
      icon: isActivating ? (
        <SpinnerIcon className="h-4 w-4 animate-spin" />
      ) : (
        <EnableIcon className="h-4 w-4" />
      ),
    });
  }

  if (onDeactivate && isActive) {
    actions.push({
      label: isDeactivating ? 'Inativando...' : 'Inativar',
      onClick: () => onDeactivate(row.id, rowLabel),
      disabled: isDeactivating,
      icon: isDeactivating ? (
        <SpinnerIcon className="h-4 w-4 animate-spin" />
      ) : (
        <BanIcon className="h-4 w-4" />
      ),
    });
  }

  if (onDelete) {
    actions.push({
      label: 'Excluir',
      onClick: () => onDelete(row.id, rowLabel),
      variant: 'danger',
      disabled: isDeleting,
      icon: isDeleting ? (
        <SpinnerIcon className="h-4 w-4 animate-spin" />
      ) : (
        <TrashIcon className="h-4 w-4" />
      ),
    });
  }

  return actions;
}

export function FinancialCategoryTable({
  financialCategories,
  onDelete,
  isDeleting = false,
  onActivate,
  isActivating = false,
  onDeactivate,
  isDeactivating = false,
}: Readonly<FinancialCategoryTableProps>) {
  const rowActionsConfig: RowActionsConfig = {
    onDelete,
    isDeleting,
    onActivate,
    isActivating,
    onDeactivate,
    isDeactivating,
  };

  return (
    <DataTable
      data={financialCategories}
      columns={FINANCIAL_CATEGORY_COLUMNS}
      getRowId={(row) => row.id}
      rowActions={(row) => buildRowActions(row, rowActionsConfig)}
      emptyState={
        <div className="p-8 text-center text-slate-500">
          Nenhuma categoria financeira encontrada.
        </div>
      }
    />
  );
}
