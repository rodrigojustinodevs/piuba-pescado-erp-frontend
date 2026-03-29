'use client';

import type { Sensor } from '../types';
import { getSensorStatusLabel, getSensorTypeLabel } from '../utils/sensorDisplayLabels';
import { DataTable, createCrudListRowActions, type DataTableColumn } from '@/shared/components/Table';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';

interface SensorTableProps {
  sensors: Sensor[];
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
}

function getRowLabel(row: Sensor): string {
  const type = getSensorTypeLabel(row.sensorType);
  return `${type === '—' ? row.sensorType || 'Sensor' : type} — ${row.tankName || 'Tanque'}`;
}

export function SensorTable({
  sensors,
  onDelete,
  isDeleting = false,
}: Readonly<SensorTableProps>) {
  const columns: Array<DataTableColumn<Sensor>> = [
    {
      id: 'sensorType',
      header: 'Tipo',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A]">{getSensorTypeLabel(row.sensorType)}</div>
      ),
    },
    {
      id: 'tankName',
      header: 'Tanque',
      cell: (row) => <div className="text-sm text-slate-600">{row.tankName || '—'}</div>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => <div className="text-sm text-slate-600">{getSensorStatusLabel(row.status)}</div>,
    },
    {
      id: 'installationDate',
      header: 'Instalação',
      cell: (row) => (
        <div className="text-sm text-slate-600">{formatNullableDatePtBR(row.installationDate)}</div>
      ),
    },
    {
      id: 'updatedAt',
      header: 'Atualizado em',
      cell: (row) => (
        <div className="text-sm text-slate-500">{formatNullableDatePtBR(row.updatedAt, true)}</div>
      ),
    },
  ];

  return (
    <DataTable
      data={sensors}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={createCrudListRowActions({
        basePath: '/company/sensors',
        onDelete,
        getRowLabel,
        isDeleting,
      })}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum sensor encontrado.</div>}
    />
  );
}
