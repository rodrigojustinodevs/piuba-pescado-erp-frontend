'use client';

import type { Tank, TankTableProps } from '../types';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { formatCapacityLiters } from '../utils/format';
import { DataTable, type DataTableColumn } from '@/shared/components/Table';
import { Badge } from '@/src/shared/components/ui/Badge';
import { Building2, MapPin } from 'lucide-react';
import { formatDate } from '../../batch/utils/format';

const statusConfig: Record<
  Tank['status'],
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  active: { label: 'Ativo', variant: 'default' },
  inactive: { label: 'Inativo', variant: 'secondary' },
  maintenance: { label: 'Manutenção', variant: 'destructive' },
};

function TankTypeBadge({ name }: Readonly<{ name: string | undefined }>) {
  return <Badge variant="outline">{name}</Badge>;
}

function buildColumns(showCompanyColumn: boolean): Array<DataTableColumn<Tank>> {
  return [
    {
      id: 'name',
      header: 'Nome',
      cellClassName: 'font-medium',
      cell: (tank) => {
        return tank.name;
      },
    },
    {
      id: 'type',
      header: 'Tipo',
      cell: (tank) => <Badge variant="outline">{tank.tankType?.name}</Badge>,
    },
    {
      id: 'capacity',
      header: 'Capacidade',
      cell: (tank) => formatCapacityLiters(tank.capacityLiters),
    },
    {
      id: 'location',
      header: 'Localização',
      cell: (tank) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {tank.location}
        </div>
      ),
    },
    ...(showCompanyColumn
      ? ([
          {
            id: 'company',
            header: 'Empresa',
            cell: (tank) => (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                {tank.company?.name}
              </div>
            ),
          },
        ] as Array<DataTableColumn<Tank>>)
      : []),
    {
      id: 'status',
      header: 'Status',
      cell: (tank) => (
        <Badge variant={statusConfig[tank.status].variant}>{statusConfig[tank.status].label}</Badge>
      ),
    },
    {
      id: 'createdAt',
      header: 'Criado em',
      cellClassName: 'text-sm text-muted-foreground',
      cell: (tank) => formatDate(tank.createdAt),
    },
  ];
}

export function TankTable({ tanks, rowActions }: Readonly<TankTableProps>) {
  const { isMaster } = useAuthContext();
  const columns = buildColumns(isMaster());

  if (tanks.length === 0) {
    return <div className="p-8 text-center text-slate-500">Nenhum tanque encontrado.</div>;
  }

  return (
    <DataTable
      data={tanks}
      columns={columns}
      getRowId={(tank) => tank.id}
      rowActions={rowActions}
      showPagination={false}
    />
  );
}
