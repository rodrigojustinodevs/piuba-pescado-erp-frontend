'use client';

import { useCallback, useMemo, useState } from 'react';
import type {
  WaterQuality,
  WaterQualityDialogMode,
  WaterQualitiesListViewProps,
  Quality,
} from '../types';
import { WaterQualityCards } from './WaterQualityCards';
import { WaterQualityDialog } from './WaterQualityDialog';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { WaterQualityDropletIcon } from '@/shared/components/icons/FeatureEntityIcons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import {
  Droplets,
  Eye,
  FlaskConical,
  Gauge,
  Loader2,
  Minus,
  Pencil,
  Ruler,
  Thermometer,
  Trash,
  Wind,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Sensor, SensorType } from '../../sensor/types';
import { Progress } from '@/src/shared/components/ui/Progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/Tabs';
import { WaterQualityTable } from './WaterQualityTable';

const idealRanges: Record<
  SensorType,
  { min: number; max: number; critical: { min: number; max: number } }
> = {
  temperature: { min: 24, max: 30, critical: { min: 20, max: 34 } },
  ph: { min: 6.5, max: 8.5, critical: { min: 5.5, max: 9.5 } },
  oxygen: { min: 5, max: 10, critical: { min: 3, max: 12 } },
  ammonia: { min: 0, max: 35, critical: { min: 0, max: 35 } },
  etc: { min: 0, max: 25, critical: { min: 0, max: 25 } },
};

const typeIcon: Record<SensorType, typeof Thermometer> = {
  temperature: Thermometer,
  ph: FlaskConical,
  oxygen: Wind,
  ammonia: Gauge,
  etc: Ruler,
};

function evaluateQuality(sensor?: Sensor): Quality {
  if (!sensor) return 'unknown';
  if (sensor.status === 'offline' || sensor.lastReading === null) return 'unknown';
  const range = idealRanges[sensor.sensorType];
  const v = sensor.lastReading;
  if (v < range.critical.min || v > range.critical.max) return 'critical';
  if (v < range.min || v > range.max) return 'warning';
  const span = range.max - range.min;
  const center = (range.max + range.min) / 2;
  const dist = Math.abs(v - center) / (span / 2);
  return dist < 0.5 ? 'excellent' : 'good';
}

const qualityConfig: Record<
  Quality,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive';
    className: string;
    icon: typeof CheckCircle2;
  }
> = {
  excellent: {
    label: 'Excelente',
    variant: 'default',
    className: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
    icon: CheckCircle2,
  },
  good: {
    label: 'Bom',
    variant: 'secondary',
    className: 'bg-sky-500/15 text-sky-700 border-sky-500/30 dark:text-sky-400',
    icon: CheckCircle2,
  },
  warning: {
    label: 'Atenção',
    variant: 'secondary',
    className: 'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400',
    icon: AlertTriangle,
  },
  critical: { label: 'Crítico', variant: 'destructive', className: '', icon: XCircle },
  unknown: {
    label: 'Sem dados',
    variant: 'secondary',
    className: 'bg-muted text-muted-foreground',
    icon: Minus,
  },
};

function getTrend(): 'up' | 'down' | 'stable' {
  const r = Math.random();
  if (r < 0.33) return 'up';
  if (r < 0.66) return 'down';
  return 'stable';
}

export function WaterQualitiesListView({
  page,
  setPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  data,
  isLoading,
  error,
  waterQualities,
  stats,
  handleDelete,
  isDeleting,
}: Readonly<WaterQualitiesListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<WaterQualityDialogMode>('create');
  const [selectedRecord, setSelectedRecord] = useState<WaterQuality | null>(null);
  const [tankFilter, setTankFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  console.log('stats2', stats);
  const openWaterQualityDialog = useCallback(
    (mode: WaterQualityDialogMode, record: WaterQuality | null = null) => {
      setDialogMode(mode);
      setSelectedRecord(record);
      setDialogOpen(true);
    },
    [],
  );

  const tanks = useMemo(() => {
    const map = new Map<string, string>();
    waterQualities.forEach((w) => {
      const tank = w.tank;
      if (tank?.id && tank?.name) {
        map.set(tank.id, tank.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [waterQualities]);

  const enriched = useMemo(
    () =>
      waterQualities.map((w) => ({
        sensor: w.tank?.sensor,
        tank: w.tank,
        company: w.company,
        quality: evaluateQuality(w.tank?.sensor ?? undefined),
      })),
    [waterQualities],
  );

  const filtered = useMemo(() => {
    return waterQualities.filter((waterQuality) => {
      const term = search.toLowerCase();
      const tank = waterQuality.tank;
      const quality = evaluateQuality(tank?.sensor ?? undefined);
      const matchSearch =
        !term ||
        tank?.name?.toLowerCase().includes(term) ||
        tank?.sensor?.sensorType?.toString().toLowerCase().includes(term);
      const matchTank = tankFilter === 'all' || tank?.id === tankFilter;
      const matchQuality = qualityFilter === 'all' || quality === qualityFilter;
      return matchSearch && matchTank && matchQuality;
    });
  }, [waterQualities, search, tankFilter, qualityFilter]);
  const tankSummary = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; sensors: typeof enriched; worst: Quality }
    >();
    const order: Quality[] = ['unknown', 'excellent', 'good', 'warning', 'critical'];
    enriched.forEach((item) => {
      const tank = item.tank;
      if (!tank?.id) return;
      const key = tank.id;
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: tank.name ?? 'Tanque sem nome',
          sensors: [],
          worst: 'excellent',
        });
      }
      const entry = map.get(key)!;
      entry.sensors.push(item);
      if (order.indexOf(item.quality) > order.indexOf(entry.worst)) {
        entry.worst = item.quality;
      }
    });
    return Array.from(map.values());
  }, [enriched]);

  const getRowActions = useCallback(
    (w: WaterQuality) => {
      const label = `${w.tank?.name ?? 'Tanque'} · pH ${w.ph}`;
      return [
        {
          label: 'Ver detalhes',
          onClick: () => openWaterQualityDialog('view', w),
          icon: <Eye className="h-4 w-4" />,
        },
        {
          label: 'Editar',
          onClick: () => openWaterQualityDialog('edit', w),
          icon: <Pencil className="h-4 w-4" />,
        },
        {
          label: 'Excluir',
          onClick: () => handleDelete(w.id, label),
          disabled: isDeleting,
          variant: 'danger' as const,
          icon: <Trash className="h-4 w-4" />,
        },
      ];
    },
    [handleDelete, isDeleting, openWaterQualityDialog],
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 text-center text-red-600">Erro ao carregar qualidade da água.</div>
      );
    }

    if (!waterQualities.length) {
      return <div className="p-8 text-center text-slate-500">Nenhuma medição encontrada.</div>;
    }

    return (
      <>
        <WaterQualityCards
          tankSummary={tankSummary.map((t) => ({
            id: t.id,
            name: t.name,
            worst: t.worst,
            sensors: t.sensors.map((s) => ({
              sensor: s.sensor ?? undefined,
              quality: s.quality,
            })),
          }))}
          qualityConfig={qualityConfig}
          typeIcon={typeIcon}
        />
        {data ? (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="medições"
            onPageChange={setPage}
          />
        ) : null}
      </>
    );
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Carregando...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return <div className="p-8 text-center text-red-600">Erro ao carregar leituras.</div>;
    }

    if (!filtered.length) {
      return <div className="p-8 text-center text-slate-500">Nenhuma leitura encontrada.</div>;
    }

    return (
      <>
        <WaterQualityTable
          waterQualities={filtered}
          rowActions={getRowActions}
          typeIcon={typeIcon}
          idealRanges={idealRanges}
          qualityConfig={qualityConfig}
          getTrend={getTrend}
        />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="leituras"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <ListHeader
        icon={<WaterQualityDropletIcon />}
        title="Qualidade da água"
        subtitle="Monitoramento dos parâmetros físico-químicos dos viveiros"
        dialogOpen
        dialogLabel="Nova medição"
        setDialogOpen={() => openWaterQualityDialog('create')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Índice de Qualidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{stats.score}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <Progress value={stats.score} className="mt-3" />
          </CardContent>
        </Card>
        <KpiCard label="Excelente" value={stats.excellent} quality="excellent" />
        <KpiCard label="Bom" value={stats.good} quality="good" />
        <KpiCard label="Atenção" value={stats.warning} quality="warning" />
        <KpiCard label="Crítico" value={stats.critical} quality="critical" />
      </div>
      <Tabs defaultValue="parametros" className="space-y-4">
        <TabsList>
          <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
          <TabsTrigger value="viveiros">Por Viveiro</TabsTrigger>
        </TabsList>

        <TabsContent value="parametros" className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchField
              search={search}
              setSearch={setSearch}
              setCurrentPage={setPage}
              placeholder="Buscar por sensor, tanque ou observações..."
            />
            <Select value={tankFilter} onValueChange={(v) => setTankFilter(v)}>
              <SelectTrigger className="sm:w-[200px]">
                <SelectValue placeholder="Viveiro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os viveiros</SelectItem>
                {tanks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={qualityFilter} onValueChange={(v) => setQualityFilter(v)}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Qualidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="excellent">Excelente</SelectItem>
                <SelectItem value="good">Bom</SelectItem>
                <SelectItem value="warning">Atenção</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
                <SelectItem value="unknown">Sem dados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">{renderTableContent()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viveiros" className="space-y-4">
          {renderContent()}
        </TabsContent>
      </Tabs>
      <WaterQualityDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedRecord(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        record={selectedRecord}
      />
    </div>
  );
}

function KpiCard({ label, value, quality }: { label: string; value: number; quality: Quality }) {
  const cfg = qualityConfig[quality];
  const Icon = cfg.icon;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold">{value}</span>
          <div className={'flex h-9 w-9 items-center justify-center rounded-md ' + cfg.className}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
