'use client';

import {
  Building2,
  Calendar,
  Droplets,
  Eye,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { Tank, TankDialogMode } from '../types';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/DropdownMenu/dropdown-menu';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { formatCapacityLiters } from '../utils/format';
import { getTankStatusConfig } from '../utils/tankDisplayLabels';

interface TankCardsProps {
  tanks: Tank[];
  isMaster: boolean;
  isDeleting?: boolean;
  openTankDialog: (mode: TankDialogMode, tank: Tank | null) => void;
  onDelete: (id: string, name: string) => void;
}

export function TankCards({
  tanks,
  isMaster,
  isDeleting = false,
  openTankDialog,
  onDelete,
}: Readonly<TankCardsProps>) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tanks.map((tank) => {
        const status = getTankStatusConfig(tank.status);
        const StatusIcon = status.icon;

        return (
          <Card key={tank.id} className="flex flex-col transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Droplets className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <CardTitle className="truncate text-base leading-tight">{tank.name}</CardTitle>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{tank.location || 'Sem localização'}</span>
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-mr-2 -mt-1 h-8 w-8"
                    aria-label={`Ações do tanque ${tank.name}`}
                  >
                    <MoreHorizontal aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openTankDialog('view', tank)}>
                    <Eye /> Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openTankDialog('edit', tank)}>
                    <Pencil /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    disabled={isDeleting}
                    onClick={() => onDelete(tank.id, tank.name)}
                  >
                    <Trash2 /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="max-w-[60%] truncate">
                  {tank.tankType?.name ?? '—'}
                </Badge>
                <Badge variant={status.variant} className="gap-1">
                  <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {status.label}
                </Badge>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="text-xs text-muted-foreground">Capacidade</div>
                <div className="mt-0.5 text-2xl font-semibold tabular-nums">
                  {formatCapacityLiters(tank.capacityLiters)}
                </div>
              </div>

              <div className="mt-auto space-y-1.5 border-t pt-3 text-xs text-muted-foreground">
                {isMaster && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{tank.company?.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Criado em {formatNullableDatePtBR(tank.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
