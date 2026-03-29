'use client';

import type { SensorReading } from '../types';
import { getSensorTypeLabel } from '@/features/sensor/utils/sensorDisplayLabels';
import { DataTable, createCrudListRowActions, type DataTableColumn } from '@/shared/components/Table';

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
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

function formatValue(value: number, unit: string): string {
  if (!Number.isFinite(value)) return '—';
  const u = unit?.trim() ? ` ${unit}` : '';
  return `${value}${u}`;
}

function getRowLabel(row: SensorReading): string {
  const v = formatValue(row.value, row.unit);
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
        <div className="text-sm font-medium text-[#0F172A]">{formatDateTime(row.measuredAt)}</div>
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
        <div className="text-sm text-slate-600">{formatValue(row.value, row.unit)}</div>
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
      cell: (row) => <div className="text-sm text-slate-500">{formatDateTime(row.updatedAt)}</div>,
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
