'use client';

import type { Tank } from '../types';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { formatCapacityLiters } from '../utils/format';
import { getStatusBadgeClassNames } from '@/shared/utils/statusBadgeClassNames';
import { getCompanyName, getTankTypeLabel } from '../utils/lookups';
import {
  DataTable,
  EditIcon,
  EyeIcon,
  SpinnerIcon,
  TrashIcon,
  type DataTableColumn,
} from '@/shared/components/Table';

const CELL_TEXT_CLASS = 'text-sm text-slate-600';

interface TankTableProps {
  tanks: Tank[];
  onDelete: (id: string, name: string) => void;
  isDeleting?: boolean;
  tankTypeMap?: Record<string, string>;
  companyMap?: Record<string, string>;
}

export function TankTable({
  tanks,
  onDelete,
  isDeleting = false,
  tankTypeMap = {},
  companyMap = {},
}: TankTableProps) {
  const { isMaster } = useAuthContext();

  if (tanks.length === 0) {
    return <div className="p-8 text-center text-slate-500">Nenhum tanque encontrado.</div>;
  }

  const columns: Array<DataTableColumn<Tank>> = [
    {
      id: 'name',
      header: 'Nome',
      cell: (tank) => <div className="text-sm font-medium text-[#0F172A]">{tank.name}</div>,
    },
    ...(isMaster()
      ? ([
          {
            id: 'company',
            header: 'Empresa',
            cell: (tank) => (
              <div className={CELL_TEXT_CLASS}>{getCompanyName(companyMap, tank.companyId)}</div>
            ),
          },
        ] as Array<DataTableColumn<Tank>>)
      : []),
    {
      id: 'capacity',
      header: 'Capacidade',
      cell: (tank) => (
        <div className={CELL_TEXT_CLASS}>{formatCapacityLiters(tank.capacityLiters)}</div>
      ),
    },
    {
      id: 'type',
      header: 'Tipo',
      cell: (tank) => (
        <div className={CELL_TEXT_CLASS}>{getTankTypeLabel(tankTypeMap, tank.tankTypeId)}</div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (tank) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClassNames(tank.status)}`}
        >
          {tank.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={tanks}
      columns={columns}
      getRowId={(tank) => tank.id}
      rowActions={(tank) => [
        {
          label: 'Ver detalhes',
          href: `/company/tanks/${tank.id}`,
          icon: <EyeIcon className="h-4 w-4" />,
        },
        {
          label: 'Editar',
          href: `/company/tanks/${tank.id}/edit`,
          icon: <EditIcon className="h-4 w-4" />,
        },
        {
          label: 'Excluir',
          onClick: () => onDelete(tank.id, tank.name),
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
