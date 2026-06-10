'use client';

import type { Quality, WaterQuality } from '../types';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { SensorType, sensorTypeLabels } from '../../sensor/types';
import { Minus, Radio, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';

interface WaterQualityTableProps {
  waterQualities: WaterQuality[];
  rowActions: (waterQuality: WaterQuality) => DataTableAction[];
  typeIcon: Record<SensorType, LucideIcon>;
  idealRanges: Record<
    SensorType,
    { min: number; max: number; critical: { min: number; max: number } }
  >;
  qualityConfig: Record<
    Quality,
    {
      label: string;
      variant: 'default' | 'secondary' | 'destructive';
      className: string;
      icon: LucideIcon;
    }
  >;
  getTrend: () => 'up' | 'down' | 'stable';
}

export function WaterQualityTable({
  waterQualities,
  rowActions,
  typeIcon,
  idealRanges,
  qualityConfig,
  getTrend,
}: Readonly<WaterQualityTableProps>) {
  const columns: Array<DataTableColumn<WaterQuality>> = [
    {
      id: 'sensor',
      header: 'Parâmetro',
      cellClassName: 'text-sm',
      cell: (row) => {
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
              {(() => {
                const Icon = typeIcon[row.tank?.sensor?.sensorType as SensorType] ?? Radio;
                return <Icon className="h-3.5 w-3.5" />;
              })()}
            </div>
            <div>
              <div className="font-medium">
                {sensorTypeLabels[row.tank?.sensor?.sensorType as SensorType]}
              </div>
              <div className="text-xs text-muted-foreground">{row.company?.name}</div>
            </div>
          </div>
        );
      },
    },
    {
      id: 'tankName',
      header: 'Viveiro',
      cellClassName: 'font-medium',
      cell: (row) => {
        return row.tank?.name || '—';
      },
    },
    {
      id: 'lastReading',
      header: 'Leitura',
      cell: (row) => {
        return row.tank?.sensor?.lastReading !== null ? (
          <span className="font-mono font-semibold">
            {row.tank?.sensor?.lastReading} {row.tank?.sensor?.unit}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      id: 'idealRange',
      header: 'Faixa Ideal',
      cellClassName: 'font-mono text-sm text-muted-foreground',
      cell: (row) => {
        const sensorType = row.tank?.sensor?.sensorType as SensorType;
        const range = idealRanges[sensorType];
        if (!range) {
          return <span className="text-muted-foreground">—</span>;
        }
        return (
          <>
            <span className="font-mono text-sm text-muted-foreground">
              {range.min} – {range.max} {row.tank?.sensor?.unit}
            </span>
            <span className="text-xs text-muted-foreground">
              {range.critical.min} – {range.critical.max} {row.tank?.sensor?.unit}
            </span>
          </>
        );
      },
    },
    {
      id: 'trend',
      header: 'Tendência',
      cellClassName: 'max-w-[220px]',
      cell: () => {
        const trend = getTrend();
        const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
        return (
          <TrendIcon
            className={
              'h-4 w-4 ' +
              (trend === 'up'
                ? 'text-emerald-500'
                : trend === 'down'
                  ? 'text-red-500'
                  : 'text-muted-foreground')
            }
          />
        );
      },
    },
    {
      id: 'quality',
      header: 'Qualidade',
      cellClassName: 'max-w-[220px]',
      cell: (row) => {
        const cfg = qualityConfig[row.quality as Quality];
        const QIcon = cfg.icon;
        return (
          <Badge variant="outline" className={cfg.className}>
            <QIcon className="mr-1 h-3 w-3" />
            {cfg.label}
          </Badge>
        );
      },
    },
  ];

  return (
    <DataTable
      data={waterQualities}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={rowActions}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhuma medição encontrada.</div>}
      showPagination={false}
    />
  );
}
