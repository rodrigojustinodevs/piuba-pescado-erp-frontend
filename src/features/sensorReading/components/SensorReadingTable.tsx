'use client';

import type { SensorReading } from '../types';
import { formatSensorReadingValue } from '../utils/formatSensorReadingDisplay';
import { getSensorTypeLabel } from '@/features/sensor/utils/sensorDisplayLabels';
import { DataTable, createCrudListRowActions, type DataTableColumn } from '@/shared/components/Table';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';

function getRowLabel(row: SensorReading): string {
  const v = formatSensorReadingValue(row.value, row.unit);
  return `${v} — ${row.tankName || 'Tanque'}`;
}

interface SensorReadingTableProps {
  sensorReadings: SensorReading[];
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
}

export function SensorReadingTable({
  sensorReadings,
  onDelete,
  isDeleting = false,
}: Readonly<SensorReadingTableProps>) {
  const columns: Array<DataTableColumn<SensorReading>> = [
    {
      id: 'measuredAt',
      header: 'Medição',
      cell: (row) => (
        <div className="text-sm font-medium text-[#0F172A]">
          {formatNullableDatePtBR(row.measuredAt, true)}
        </div>
      ),
    },
    {
      id: 'tankName',
      header: 'Tanque',
      cell: (row) => <div className="text-sm text-slate-600">{row.tankName || '—'}</div>,
    },
    {
      id: 'sensorType',
      header: 'Sensor',
      cell: (row) => (
        <div className="text-sm text-slate-600">{getSensorTypeLabel(row.sensorType)}</div>
      ),
    },
    {
      id: 'value',
      header: 'Valor',
      cell: (row) => (
        <div className="text-sm text-slate-600">{formatSensorReadingValue(row.value, row.unit)}</div>
      ),
    },
    {
      id: 'notes',
      header: 'Observações',
      cell: (row) => (
        <div className="text-sm text-slate-500 max-w-[200px] truncate" title={row.notes ?? ''}>
          {row.notes || '—'}
        </div>
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
      data={sensorReadings}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={createCrudListRowActions({
        basePath: '/company/sensor-readings',
        onDelete,
        getRowLabel,
        isDeleting,
      })}
      emptyState={
        <div className="p-8 text-center text-slate-500">Nenhuma leitura encontrada.</div>
      }
    />
  );
}
