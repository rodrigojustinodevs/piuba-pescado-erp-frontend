'use client';

import type { SensorReading, SensorReadingType } from '../types';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { SensorType, sensorTypeLabels } from '../../sensor/types';
import { AlertTriangle, Radio, type LucideIcon } from 'lucide-react';

interface SensorTypeIconProps {
  typeIcon: Record<SensorType, LucideIcon>;
  sensorType: string | undefined | null;
}

function SensorTypeIcon({ typeIcon, sensorType }: Readonly<SensorTypeIconProps>) {
  const TypeIcon = typeIcon[sensorType as SensorType] ?? Radio;
  return <TypeIcon className="h-3.5 w-3.5" />;
}
import { Badge } from '@/shared/components/ui/Badge';
import { formatDateTime, formatRelative } from '../../batch/utils/format';

type SourceConfig = Record<SensorReadingType, { label: string; icon: LucideIcon; variant: 'secondary' | 'default' }>;

interface ReadingValueCellProps {
  row: SensorReading;
  isOutOfRange: (type: SensorReadingType, value: number) => boolean;
}

function ReadingValueCell({ row, isOutOfRange }: Readonly<ReadingValueCellProps>) {
  const readingType: SensorReadingType =
    row.type === 'manual' || row.type === 'automatic' ? row.type : 'automatic';
  const out = isOutOfRange(readingType, row.value);
  return (
    <div className="flex items-center justify-end gap-1">
      <span className={`font-semibold tabular-nums ${out ? 'text-destructive' : ''}`}>
        {row.value}
      </span>
      <span className="text-xs text-muted-foreground">{row.unit}</span>
      {out && <AlertTriangle className="ml-1 h-3.5 w-3.5 text-destructive" />}
    </div>
  );
}

interface ReadingSourceCellProps {
  row: SensorReading;
  sourceConfig: SourceConfig;
  fallbackSource: SourceConfig[SensorReadingType];
}

function ReadingSourceCell({ row, sourceConfig, fallbackSource }: Readonly<ReadingSourceCellProps>) {
  const source = sourceConfig[row.type as SensorReadingType] ?? fallbackSource;
  const SourceIcon = source.icon;
  return (
    <Badge variant={source.variant} className="gap-1">
      <SourceIcon className="h-3 w-3" />
      {source.label}
    </Badge>
  );
}

interface SensorReadingTableProps {
  sensorReadings: SensorReading[];
  rowActions: (reading: SensorReading) => DataTableAction[];
  typeIcon: Record<SensorType, LucideIcon>;
  sourceConfig: SourceConfig;
  isOutOfRange: (type: SensorReadingType, value: number) => boolean;
}

export function SensorReadingTable({
  sensorReadings,
  rowActions,
  typeIcon,
  sourceConfig,
  isOutOfRange,
}: Readonly<SensorReadingTableProps>) {
  const fallbackSource = sourceConfig.automatic;

  const columns: Array<DataTableColumn<SensorReading>> = [
    {
      id: 'sensor',
      header: 'Sensor',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-1.5 text-primary">
            <SensorTypeIcon typeIcon={typeIcon} sensorType={row.sensor?.sensorType} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{row.sensor?.name}</div>
            <div className="truncate text-xs text-muted-foreground">
              {sensorTypeLabels[row.sensor?.sensorType as SensorType] ?? row.sensor?.sensorType}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tankName',
      header: 'Tanque',
      cellClassName: 'text-sm',
      cell: (row) => {
        return row.sensor?.tank?.name || '—';
      },
    },
    {
      id: 'value',
      header: 'Valor',
      cellClassName: 'text-right',
      headerClassName: 'text-right',
      cell: (row) => <ReadingValueCell row={row} isOutOfRange={isOutOfRange} />,
    },
    {
      id: 'type',
      header: 'Origem',
      cell: (row) => <ReadingSourceCell row={row} sourceConfig={sourceConfig} fallbackSource={fallbackSource} />,
    },
    {
      id: 'measuredAt',
      header: 'Medição',
      cell: (row) => (
        <>
          <div className="text-sm">{formatDateTime(row.measuredAt)}</div>
          <div className="text-xs text-muted-foreground">{formatRelative(row.measuredAt)}</div>
        </>
      ),
    },
    {
      id: 'notes',
      header: 'Observações',
      cellClassName: 'max-w-[220px]',
      cell: (row) => (
        <span className="line-clamp-1 text-xs text-muted-foreground">{row.notes ?? '—'}</span>
      ),
    },
  ];

  return (
    <DataTable
      data={sensorReadings}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={rowActions}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhuma leitura encontrada.</div>}
      showPagination={false}
    />
  );
}
