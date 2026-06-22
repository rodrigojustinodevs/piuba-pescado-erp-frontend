'use client';

import { Badge } from '@/src/shared/components/ui/Badge';
import type { Sensor, SensorDialogMode, SensorType } from '../types';
import { type DataTableAction } from '@/shared/components/Table';
import {
  Activity,
  Battery,
  BatteryLow,
  Building2,
  CircleHelp,
  Droplets,
  LucideIcon,
  Wrench,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/shared/components/DropdownMenu/dropdown-menu';
import { Button } from '@/src/shared/components/ui/Button';
import { Progress } from '@/src/shared/components/ui/Progress';
import { formatNullableDatePtBR } from '@/src/shared/utils/dateFormat';
import { getSensorTypeLabel } from '../utils/sensorDisplayLabels';
interface SensorCardsProps {
  sensors: Sensor[];
  rowActions: (sensor: Sensor) => DataTableAction[];
  isMaster: boolean;
  statusConfig: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive'; icon: typeof Activity }
  >;
  typeIcon: Record<SensorType, LucideIcon>;
  openSensorDialog: (mode: SensorDialogMode, sensor: Sensor | null) => void;
}

export function SensorCards({
  sensors,
  isMaster,
  statusConfig,
  typeIcon,
  openSensorDialog,
}: Readonly<SensorCardsProps>) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sensors.map((s) => {
          const status = statusConfig[s.status] ?? {
            label: 'Desconhecido',
            variant: 'secondary' as const,
            icon: Wrench,
          };
          const StatusIcon = status.icon;
          const TypeIcon = typeIcon[s.sensorType as SensorType] ?? CircleHelp;
          const batteryLow = s.battery && s.battery > 0 && s.battery < 20;
          const batteryEmpty = s.battery && s.battery === 0;
          return (
            <Card key={s.id} className="flex flex-col transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <TypeIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-0.5">
                    <CardTitle className="text-base leading-tight">{s.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{s.serialNumber}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mr-2 -mt-1 h-8 w-8">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openSensorDialog('view', s)}>
                      <Eye /> Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="gap-1">
                    {getSensorTypeLabel(s.sensorType)}
                  </Badge>
                  <Badge variant={status.variant} className="gap-1">
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                  </Badge>
                </div>

                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Última leitura</div>
                  {s.lastReading === null ? (
                    <div className="mt-0.5 text-sm text-muted-foreground">Sem leituras</div>
                  ) : (
                    <>
                      <div className="mt-0.5 text-2xl font-semibold tabular-nums">
                        {s.lastReading}{' '}
                        <span className="text-sm font-normal text-muted-foreground">{s.unit}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {formatNullableDatePtBR(s.createdAt)}
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      {batteryLow || batteryEmpty ? (
                        <BatteryLow
                          className={`h-3.5 w-3.5 ${batteryLow ? 'text-destructive' : ''}`}
                        />
                      ) : (
                        <Battery className="h-3.5 w-3.5" />
                      )}
                      Bateria
                    </span>
                    <span
                      className={`font-medium tabular-nums ${batteryLow ? 'text-destructive' : ''}`}
                    >
                      {s.battery}%
                    </span>
                  </div>
                  <Progress value={s.battery} className="h-1.5" />
                </div>

                <div className="mt-auto space-y-1.5 border-t pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{s.tank?.name}</span>
                  </div>
                  {isMaster && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{s.company?.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
