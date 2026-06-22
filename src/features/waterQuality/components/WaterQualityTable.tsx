'use client';

import type { Quality, WaterQuality } from '../types';
import { DataTable, type DataTableAction, type DataTableColumn } from '@/shared/components/Table';
import { SensorType, sensorTypeLabels } from '../../sensor/types';
import { Minus, Radio, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';

type Trend = 'up' | 'down' | 'stable';
type IdealRanges = Record<SensorType, { min: number; max: number; critical: { min: number; max: number } }>;
type QualityConfig = Record<Quality, { label: string; variant: 'default' | 'secondary' | 'destructive'; className: string; icon: LucideIcon }>;

function WaterQualitySensorCell({ row, typeIcon }: Readonly<{ row: WaterQuality; typeIcon: Record<SensorType, LucideIcon> }>) {
  const Icon = typeIcon[row.tank?.sensor?.sensorType as SensorType] ?? Radio;
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="font-medium">
          {sensorTypeLabels[row.tank?.sensor?.sensorType as SensorType]}
        </div>
        <div className="text-xs text-muted-foreground">{row.company?.name}</div>
      </div>
    </div>
  );
}

function WaterQualityLastReadingCell({ row }: Readonly<{ row: WaterQuality }>) {
  if (row.tank?.sensor?.lastReading === null) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span className="font-mono font-semibold">
      {row.tank?.sensor?.lastReading} {row.tank?.sensor?.unit}
    </span>
  );
}

function WaterQualityRangeCell({ row, idealRanges }: Readonly<{ row: WaterQuality; idealRanges: IdealRanges }>) {
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
}

function getTrendIcon(trend: Trend): LucideIcon {
  if (trend === 'up') return TrendingUp;
  if (trend === 'down') return TrendingDown;
  return Minus;
}

function getTrendClass(trend: Trend): string {
  if (trend === 'up') return 'text-emerald-500';
  if (trend === 'down') return 'text-red-500';
  return 'text-muted-foreground';
}

function WaterQualityTrendCell({ getTrend }: Readonly<{ getTrend: () => Trend }>) {
  const trend = getTrend();
  const TrendIcon = getTrendIcon(trend);
  return <TrendIcon className={`h-4 w-4 ${getTrendClass(trend)}`} />;
}

function WaterQualityBadgeCell({ row, qualityConfig }: Readonly<{ row: WaterQuality; qualityConfig: QualityConfig }>) {
  const cfg = qualityConfig[row.quality as Quality];
  const QIcon = cfg.icon;
  return (
    <Badge variant="outline" className={cfg.className}>
      <QIcon className="mr-1 h-3 w-3" />
      {cfg.label}
    </Badge>
  );
}

function buildColumns(
  typeIcon: Record<SensorType, LucideIcon>,
  idealRanges: IdealRanges,
  qualityConfig: QualityConfig,
  getTrend: () => Trend,
): Array<DataTableColumn<WaterQuality>> {
  return [
    {
      id: 'sensor',
      header: 'Parâmetro',
      cellClassName: 'text-sm',
      cell: (row) => <WaterQualitySensorCell row={row} typeIcon={typeIcon} />,
    },
    {
      id: 'tankName',
      header: 'Viveiro',
      cellClassName: 'font-medium',
      cell: (row) => row.tank?.name || '—',
    },
    {
      id: 'lastReading',
      header: 'Leitura',
      cell: (row) => <WaterQualityLastReadingCell row={row} />,
    },
    {
      id: 'idealRange',
      header: 'Faixa Ideal',
      cellClassName: 'font-mono text-sm text-muted-foreground',
      cell: (row) => <WaterQualityRangeCell row={row} idealRanges={idealRanges} />,
    },
    {
      id: 'trend',
      header: 'Tendência',
      cellClassName: 'max-w-[220px]',
      cell: () => <WaterQualityTrendCell getTrend={getTrend} />,
    },
    {
      id: 'quality',
      header: 'Qualidade',
      cellClassName: 'max-w-[220px]',
      cell: (row) => <WaterQualityBadgeCell row={row} qualityConfig={qualityConfig} />,
    },
  ];
}

interface WaterQualityTableProps {
  waterQualities: WaterQuality[];
  rowActions: (waterQuality: WaterQuality) => DataTableAction[];
  typeIcon: Record<SensorType, LucideIcon>;
  idealRanges: IdealRanges;
  qualityConfig: QualityConfig;
  getTrend: () => Trend;
}

export function WaterQualityTable({
  waterQualities,
  rowActions,
  typeIcon,
  idealRanges,
  qualityConfig,
  getTrend,
}: Readonly<WaterQualityTableProps>) {
  const columns = buildColumns(typeIcon, idealRanges, qualityConfig, getTrend);
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
