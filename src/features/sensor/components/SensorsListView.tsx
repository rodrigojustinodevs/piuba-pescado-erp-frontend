'use client';

import { useCallback, useState } from 'react';
import type {
  Sensor,
  SensorDialogMode,
  SensorsListViewProps,
  SensorStatus,
  SensorType,
  SensorTypeFilter,
} from '../types';
import { SensorCards } from './SensorCards';
import { SensorDialog } from './SensorDialog';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import {
  Activity,
  BatteryLow,
  Eye,
  Pencil,
  Radio,
  Trash,
  WifiOff,
  RadioTower,
  Loader2,
  FlaskConical,
  Gauge,
  Ruler,
  Wind,
  Wrench,
  LucideIcon,
  Thermometer,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/Select';
import { useAuthContext } from '@/src/shared/contexts/AuthContext';

export function SensorsListView({
  page,
  setPage,
  search,
  setSearch,
  filter,
  setFilter,
  sensorTypeFilter,
  setSensorTypeFilter,
  data,
  isLoading,
  error,
  filteredSensors,
  stats,
  handleDelete,
  isDeleting,
}: Readonly<SensorsListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<SensorDialogMode>('create');
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const openSensorDialog = useCallback((mode: SensorDialogMode, sensor: Sensor | null = null) => {
    setDialogMode(mode);
    setSelectedSensor(sensor);
    setDialogOpen(true);
  }, []);

  const handleSensorDelete = useCallback(
    (id: string, label: string) => {
      handleDelete(id, label);
    },
    [handleDelete],
  );

  const getRowActions = useCallback(
    (sensor: Sensor) => [
      {
        label: 'Ver detalhes',
        onClick: () => openSensorDialog('view', sensor),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openSensorDialog('edit', sensor),
        icon: <Pencil className="h-4 w-4" />,
      },
      {
        label: 'Excluir',
        onClick: () =>
          handleSensorDelete(sensor.id, `${sensor.name} — ${sensor.tank?.name || 'Tanque'}`),
        disabled: isDeleting,
        variant: 'danger' as const,
        icon: <Trash className="h-4 w-4" />,
      },
    ],
    [handleSensorDelete, isDeleting, openSensorDialog],
  );

  const statusConfig: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive'; icon: typeof Activity }
  > = {
    online: { label: 'Online', variant: 'default', icon: Activity },
    offline: { label: 'Offline', variant: 'destructive', icon: WifiOff },
    maintenance: { label: 'Manutenção', variant: 'secondary', icon: Wrench },
  };

  const typeIcon: Record<SensorType, LucideIcon> = {
    temperature: Thermometer,
    ph: FlaskConical,
    oxygen: Wind,
    dissolved_oxygen: Wind,
    ammonia: Gauge,
    etc: Ruler,
  };
  const { isMaster } = useAuthContext();

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
      return <div className="p-8 text-center text-red-600">Erro ao carregar sensores.</div>;
    }

    if (!filteredSensors.length) {
      return <div className="p-8 text-center text-slate-500">Nenhum sensor encontrado.</div>;
    }

    return (
      <>
        <SensorCards
          sensors={filteredSensors}
          rowActions={getRowActions}
          isMaster={isMaster()}
          statusConfig={statusConfig}
          typeIcon={typeIcon}
          openSensorDialog={openSensorDialog}
        />
        {data && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="sensores"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <ListHeader
        icon={<RadioTower className="h-8 w-8 text-[#0EA5A4]" />}
        title="Sensores IoT"
        subtitle="Acompanhe o status e as últimas leituras dos sensores instalados nos viveiros."
        dialogOpen
        dialogLabel="Novo Sensor"
        setDialogOpen={() => openSensorDialog('create')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Sensores
            </CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Online</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data?.sensors ?? []).filter((s) => s.status === 'online').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Offline</CardTitle>
            <WifiOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data?.sensors ?? []).filter((s) => s.status === 'offline').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bateria Baixa
            </CardTitle>
            <BatteryLow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data?.sensors ?? []).filter((s) => s.battery !== null && s.battery < 20).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de Sensores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchField
                search={search}
                setSearch={setSearch}
                setCurrentPage={setPage}
                placeholder="Buscar por tipo ou tanque..."
              />
            </div>
            <Select
              value={sensorTypeFilter}
              onValueChange={(v) => {
                setSensorTypeFilter(v as SensorTypeFilter);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo de Sensor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Tipos</SelectItem>
                <SelectItem value="ph">pH</SelectItem>
                <SelectItem value="temperature">Temperatura</SelectItem>
                <SelectItem value="dissolved_oxygen">Oxigênio Dissolvido</SelectItem>
                <SelectItem value="ammonia">Amônia</SelectItem>
                <SelectItem value="etc">Outros</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filter}
              onValueChange={(v) => {
                setFilter(v as SensorStatus);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderContent()}
        </CardContent>
      </Card>

      <SensorDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedSensor(null);
          setDialogOpen(open);
        }}
        onSuccess={() => {
          setDialogOpen(false);
        }}
        mode={dialogMode}
        sensor={selectedSensor}
      />
    </div>
  );
}
