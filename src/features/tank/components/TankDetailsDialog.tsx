'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  CalendarClock,
  CalendarPlus,
  Check,
  Copy,
  Droplets,
  Layers,
  MapPin,
  Pencil,
  type LucideIcon,
} from 'lucide-react';
import type { Tank, TankStatus } from '../types';
import { TANK_STATUS_CONFIG } from '../utils/tankDisplayLabels';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Separator } from '@/shared/components/ui/Separator';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/Tooltip';
import { cn } from '@/shared/lib/utils';

interface TankDetailsDialogProps {
  readonly tank: Tank | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly isLoading?: boolean;
  readonly onEdit?: (tank: Tank) => void;
}

type StatusStyle = { label: string; dot: string; badge: string; iconBg: string };

const STATUS: Record<TankStatus, StatusStyle> = {
  active: {
    label: TANK_STATUS_CONFIG.active.label,
    dot: 'bg-emerald-500',
    badge:
      'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20',
    iconBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
  inactive: {
    label: TANK_STATUS_CONFIG.inactive.label,
    dot: 'bg-zinc-400',
    badge:
      'bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-400/20',
    iconBg: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-500/10 dark:text-zinc-400',
  },
  maintenance: {
    label: TANK_STATUS_CONFIG.maintenance.label,
    dot: 'bg-amber-500',
    badge:
      'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20',
    iconBg: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  },
};

const numberFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const dateFmt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
];

function formatCapacity(liters: number) {
  return {
    primary: `${numberFmt.format(liters)} L`,
    secondary: liters >= 1000 ? `${numberFmt.format(liters / 1000)} m³` : null,
  };
}

function formatRelative(iso: string) {
  const diffSec = (new Date(iso).getTime() - Date.now()) / 1000;
  for (const [unit, sec] of RELATIVE_UNITS) {
    if (Math.abs(diffSec) >= sec) return rtf.format(Math.round(diffSec / sec), unit);
  }
  return 'agora mesmo';
}

function isValidDate(iso: string | undefined): iso is string {
  return !!iso && !Number.isNaN(new Date(iso).getTime());
}

function EmptyValue({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="font-normal text-muted-foreground">{children}</span>;
}

function InfoTile({
  icon: Icon,
  label,
  hint,
  className,
  children,
}: Readonly<{
  icon: LucideIcon;
  label: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}>) {
  return (
    <div className={cn('min-w-0 rounded-lg border bg-muted/30 p-3', className)}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-semibold text-foreground">{children}</div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">{hint}</div>}
    </div>
  );
}

function DateRow({
  icon: Icon,
  label,
  iso,
}: Readonly<{ icon: LucideIcon; label: string; iso: string }>) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
        {label}
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <time
            dateTime={iso}
            tabIndex={0}
            className="cursor-default rounded font-medium tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {formatRelative(iso)}
          </time>
        </TooltipTrigger>
        <TooltipContent>{dateFmt.format(new Date(iso))}</TooltipContent>
      </Tooltip>
    </div>
  );
}

function CopyId({ id }: Readonly<{ id: string }>) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      return;
    }
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={id}
      aria-label={copied ? 'ID copiado' : `Copiar ID do tanque (${id})`}
      className="inline-flex items-center gap-1 rounded font-mono text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      #{id.slice(0, 8)}
      {copied ? (
        <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
      ) : (
        <Copy className="size-3" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? 'ID copiado' : ''}
      </span>
    </button>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Carregando detalhes do tanque…">
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-[74px]" />
        <Skeleton className="h-[74px]" />
        <Skeleton className="col-span-2 h-[62px]" />
      </div>
      <Skeleton className="h-px" />
      <div className="space-y-2">
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
      </div>
    </div>
  );
}

function TankDetailsBody({ tank }: Readonly<{ tank: Tank }>) {
  const status = STATUS[tank.status] ?? STATUS.inactive;
  const capacity = formatCapacity(tank.capacityLiters);
  const location = tank.location?.trim();
  const hasCreated = isValidDate(tank.createdAt);
  const wasUpdated =
    hasCreated &&
    isValidDate(tank.updatedAt) &&
    Math.abs(new Date(tank.updatedAt).getTime() - new Date(tank.createdAt).getTime()) >= 1000;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4 pr-6">
        <div
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-xl',
            status.iconBg,
          )}
        >
          <Droplets className="size-7" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="truncate text-lg font-semibold leading-tight" title={tank.name}>
            {tank.name}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn('gap-1.5 border-0 ring-1 ring-inset', status.badge)}
            >
              <span className={cn('size-1.5 rounded-full', status.dot)} aria-hidden="true" />
              {status.label}
            </Badge>
            <CopyId id={tank.id} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InfoTile icon={Droplets} label="Capacidade" hint={capacity.secondary}>
          <span className="text-xl tabular-nums">{capacity.primary}</span>
        </InfoTile>
        <InfoTile icon={Layers} label="Tipo">
          {tank.tankType?.name?.trim() || <EmptyValue>Não informado</EmptyValue>}
        </InfoTile>
        <InfoTile icon={MapPin} label="Localização" className="col-span-2">
          {location || <EmptyValue>Não informada</EmptyValue>}
        </InfoTile>
      </div>

      <Separator />

      <div className="space-y-2">
        {hasCreated ? (
          <DateRow icon={CalendarPlus} label="Criado" iso={tank.createdAt} />
        ) : (
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <CalendarPlus className="size-4" aria-hidden="true" />
              Criado
            </span>
            <EmptyValue>Não informado</EmptyValue>
          </div>
        )}
        {wasUpdated && (
          <DateRow icon={CalendarClock} label="Última atualização" iso={tank.updatedAt} />
        )}
      </div>
    </div>
  );
}

export function TankDetailsDialog({
  tank,
  open,
  onOpenChange,
  isLoading = false,
  onEdit,
}: TankDetailsDialogProps) {
  const showSkeleton = isLoading || !tank;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {tank ? `Detalhes do tanque ${tank.name}` : 'Detalhes do tanque'}
          </DialogTitle>
          <DialogDescription>Informações cadastrais do tanque.</DialogDescription>
        </DialogHeader>

        <TooltipProvider delayDuration={150}>
          <div className="p-6">
            {showSkeleton ? <DetailsSkeleton /> : <TankDetailsBody tank={tank} />}
          </div>
        </TooltipProvider>

        <DialogFooter className="gap-2 border-t bg-muted/30 px-6 py-4 sm:justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {onEdit && tank && (
            <Button onClick={() => onEdit(tank)} disabled={isLoading}>
              <Pencil className="size-4" aria-hidden="true" />
              Editar tanque
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
