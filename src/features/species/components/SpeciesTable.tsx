'use client';

import type { Species } from '../types';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { SPECIES_WRITE_ROLES } from '../utils/permissions';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { EditIcon, SpinnerIcon, TrashIcon } from '@/shared/components/Table/ActionIcons';

function formatRange(min?: number, max?: number, unit = ''): string {
  if (min === undefined && max === undefined) return '—';
  if (min !== undefined && max !== undefined) return `${min} – ${max}${unit}`;
  return `${min ?? max}${unit}`;
}

const columns: Array<DataTableColumn<Species>> = [
  {
    id: 'name',
    header: 'Nome',
    cellClassName: 'font-medium',
    cell: (species) => species.name,
  },
  {
    id: 'temperature',
    header: 'Temp. ideal',
    cell: (species) => formatRange(species.idealTemperatureMin, species.idealTemperatureMax, '°C'),
  },
  {
    id: 'salinity',
    header: 'Salinidade ideal',
    cell: (species) => formatRange(species.idealSalinityMin, species.idealSalinityMax, ' ppt'),
  },
  {
    id: 'fcr',
    header: 'FCR esperado',
    cell: (species) => (species.expectedFcr !== undefined ? String(species.expectedFcr) : '—'),
  },
];

export type SpeciesTableProps = {
  species: Species[];
  onEdit: (species: Species) => void;
  handleDelete: (id: string, name: string) => void;
  isDeleting?: boolean;
};

export function SpeciesTable({
  species,
  onEdit,
  handleDelete,
  isDeleting,
}: Readonly<SpeciesTableProps>) {
  const { canAccess } = useAuthContext();
  const canWrite = canAccess(SPECIES_WRITE_ROLES);

  const rowActions = (row: Species): DataTableAction[] => [
    {
      label: 'Editar',
      onClick: () => onEdit(row),
      icon: <EditIcon className="h-4 w-4" />,
    },
    {
      label: 'Excluir',
      onClick: () => handleDelete(row.id, row.name),
      variant: 'danger',
      disabled: isDeleting,
      icon: isDeleting ? (
        <SpinnerIcon className="h-4 w-4 animate-spin" />
      ) : (
        <TrashIcon className="h-4 w-4" />
      ),
    },
  ];

  if (species.length === 0) {
    return <div className="p-8 text-center text-slate-500">Nenhuma espécie encontrada.</div>;
  }

  return (
    <DataTable
      data={species}
      columns={columns}
      getRowId={(item) => item.id}
      rowActions={canWrite ? rowActions : undefined}
      showPagination={false}
    />
  );
}
