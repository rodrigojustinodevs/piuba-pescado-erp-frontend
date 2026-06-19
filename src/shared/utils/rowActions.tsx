import { Eye, Pencil, Trash } from 'lucide-react';
import type { DataTableAction } from '@/shared/components/Table';

export function createStandardRowActions(
  onView: () => void,
  onEdit: () => void,
  onDelete: () => void,
  deleteDisabled?: boolean,
): DataTableAction[] {
  return [
    { label: 'Ver detalhes', onClick: onView, icon: <Eye className="h-4 w-4" /> },
    { label: 'Editar', onClick: onEdit, icon: <Pencil className="h-4 w-4" /> },
    {
      label: 'Excluir',
      onClick: onDelete,
      variant: 'danger',
      disabled: deleteDisabled,
      icon: <Trash className="h-4 w-4" />,
    },
  ];
}
