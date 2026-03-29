'use client';

import { EditIcon, EyeIcon, SpinnerIcon, TrashIcon } from './ActionIcons';
import type { DataTableAction } from './DataTable';

export type CrudListRowActionsOptions<T extends { id: string }> = {
  basePath: string;
  onDelete?: (id: string, label: string) => void;
  getRowLabel: (row: T) => string;
  isDeleting?: boolean;
};

/** Ações padrão de listagem: detalhes, editar e opcionalmente excluir (com spinner ao excluir). */
export function createCrudListRowActions<T extends { id: string }>(
  options: CrudListRowActionsOptions<T>,
): (row: T) => DataTableAction[] {
  const { basePath, onDelete, getRowLabel, isDeleting = false } = options;

  return (row) => {
    const actions: DataTableAction[] = [
      {
        label: 'Ver detalhes',
        href: `${basePath}/${row.id}`,
        icon: <EyeIcon className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        href: `${basePath}/${row.id}/edit`,
        icon: <EditIcon className="h-4 w-4" />,
      },
    ];

    if (!onDelete) return actions;

    return [
      ...actions,
      {
        label: 'Excluir',
        onClick: () => onDelete(row.id, getRowLabel(row)),
        variant: 'danger',
        disabled: isDeleting,
        icon: isDeleting ? (
          <SpinnerIcon className="h-4 w-4 animate-spin" />
        ) : (
          <TrashIcon className="h-4 w-4" />
        ),
      },
    ];
  };
}
