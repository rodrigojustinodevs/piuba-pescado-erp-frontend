'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { SensorReading, SensorReadingListResponse, SensorReadingType } from '../types';
import { SensorReadingTable } from './SensorReadingTable';
import { SensorReadingDialog } from './SensorReadingDialog';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import { SensorReadingBarChartIcon } from '@/shared/components/icons/FeatureEntityIcons';
import {
  AirVent,
  AlertTriangle,
  ClipboardList,
  Clock,
  Cpu,
  Eye,
  FlaskConical,
  Gauge,
  Hand,
  Loader2,
  Pencil,
  Ruler,
  Thermometer,
  Trash,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { SensorType } from '../../sensor/types';

type SensorReadingDialogMode = 'create' | 'edit' | 'view';

export type SensorReadingsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  data: SensorReadingListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  sensorReadings: SensorReading[];
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

function KpiCard({
  title,
  value,
  icon,
  accent,
  description,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  accent?: string;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${accent ?? ''}`}>{value}</div>
        {description && <CardDescription className="mt-1 text-xs">{description}</CardDescription>}
      </CardContent>
    </Card>
  );
}

const typeIcon: Record<SensorType, typeof Thermometer> = {
  temperature: Thermometer,
  ph: FlaskConical,
  oxygen: AirVent,
  ammonia: Gauge,
  etc: Ruler,
};

const idealRanges: Record<SensorType, { min: number; max: number }> = {
  temperature: { min: 24, max: 30 },
  ph: { min: 6.5, max: 8.5 },
  oxygen: { min: 5, max: 12 },
  ammonia: { min: 0, max: 35 },
  etc: { min: 0, max: 25 },
};

const sourceConfig: Record<
  SensorReadingType,
  { label: string; icon: typeof Hand; variant: 'secondary' | 'default' }
> = {
  manual: { label: 'Manual', icon: Hand, variant: 'secondary' },
  automatic: { label: 'Automática', icon: Cpu, variant: 'default' },
};

function isOutOfRange(type: SensorReadingType, value: number): boolean {
  const range = idealRanges[type as SensorType];
  if (!range) return false;
  return value < range.min || value > range.max;
}

export function SensorReadingsListView({
  page,
  setPage,
  search,
  setSearch,
  data,
  isLoading,
  error,
  sensorReadings,
  handleDelete,
  isDeleting,
}: Readonly<SensorReadingsListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<SensorReadingDialogMode>('create');
  const [selectedSensorReading, setSelectedSensorReading] = useState<SensorReading | null>(null);
  const [sensorFilter, setSensorFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const sensors = useMemo(() => {
    const sensorMap = new Map<string, NonNullable<SensorReading['sensor']>>();
    for (const reading of data?.sensorReadings ?? []) {
      if (reading.sensor?.id) {
        sensorMap.set(reading.sensor.id, reading.sensor);
      }
    }
    return Array.from(sensorMap.values());
  }, [data?.sensorReadings]);
  console.log(sensors);

  const filteredReadings = useMemo(
    () =>
      sensorReadings.filter((reading) => {
        const bySensor = sensorFilter === 'all' || reading.sensor?.id === sensorFilter;
        const byType = typeFilter === 'all' || reading.type === typeFilter;
        return bySensor && byType;
      }),
    [sensorFilter, sensorReadings, typeFilter],
  );

  const stats = useMemo(() => {
    const total = filteredReadings.length;
    const manual = filteredReadings.filter((m) => m.type === 'manual').length;
    const automatic = filteredReadings.filter((m) => m.type === 'automatic').length;
    const outOfRange = filteredReadings.filter((m) => isOutOfRange(m.type, m.value)).length;
    const last24h = filteredReadings.filter(
      (m) => new Date().getTime() - new Date(m.measuredAt).getTime() < 24 * 60 * 60 * 1000,
    ).length;
    return { total, manual, automatic, outOfRange, last24h };
  }, [filteredReadings]);
  const openSensorReadingDialog = useCallback(
    (mode: SensorReadingDialogMode, sensorReading: SensorReading | null = null) => {
      setDialogMode(mode);
      setSelectedSensorReading(sensorReading);
      setDialogOpen(true);
    },
    [],
  );

  const getRowActions = useCallback(
    (sensorReading: SensorReading) => [
      {
        label: 'Ver detalhes',
        onClick: () => openSensorReadingDialog('view', sensorReading),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openSensorReadingDialog('edit', sensorReading),
        icon: <Pencil className="h-4 w-4" />,
      },
      {
        label: 'Excluir',
        onClick: () =>
          handleDelete(
            sensorReading.id,
            `${sensorReading.sensor?.name || 'Sensor'} — ${sensorReading.value} ${sensorReading.unit}`,
          ),
        disabled: isDeleting,
        variant: 'danger' as const,
        icon: <Trash className="h-4 w-4" />,
      },
    ],
    [handleDelete, isDeleting, openSensorReadingDialog],
  );

  const renderContent = () => {
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

    if (!filteredReadings.length) {
      return <div className="p-8 text-center text-slate-500">Nenhuma leitura encontrada.</div>;
    }

    return (
      <>
        <SensorReadingTable
          sensorReadings={filteredReadings}
          rowActions={getRowActions}
          typeIcon={typeIcon}
          sourceConfig={sourceConfig}
          isOutOfRange={isOutOfRange}
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
        icon={<SensorReadingBarChartIcon />}
        title="Monitoramento"
        subtitle="Histórico de medições registradas pelos sensores."
        dialogOpen
        dialogLabel="Nova leitura"
        setDialogOpen={() => openSensorReadingDialog('create')}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          title="Total de Leituras"
          value={stats.total}
          icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        />
        <KpiCard
          title="Últimas 24h"
          value={stats.last24h}
          icon={<Clock className="h-4 w-4 text-emerald-600" />}
          accent="text-emerald-600"
        />
        <KpiCard
          title="Automáticas"
          value={stats.automatic}
          icon={<Cpu className="h-4 w-4 text-destructive" />}
          accent="text-destructive"
        />
        <KpiCard
          title="Manuais"
          value={stats.manual}
          icon={<Hand className="h-4 w-4 text-amber-600" />}
          accent="text-amber-600"
        />
        <KpiCard
          title="Fora da faixa"
          value={stats.outOfRange}
          icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
          accent="text-amber-600"
          description="Sensores com bateria abaixo de 20%"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de Leituras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchField
                search={search}
                setSearch={setSearch}
                setCurrentPage={setPage}
                placeholder="Buscar por sensor, tanque ou observações..."
              />
            </div>
            <Select
              value={sensorFilter}
              onValueChange={(v) => {
                setSensorFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Sensor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os sensores</SelectItem>
                {sensors.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as origens</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="automatic">Automática</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderContent()}
        </CardContent>
      </Card>

      <SensorReadingDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedSensorReading(null);
          setDialogOpen(open);
        }}
        onSuccess={() => {
          setDialogOpen(false);
        }}
        mode={dialogMode}
        sensorReading={selectedSensorReading}
      />
    </div>
  );
}
