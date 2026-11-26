'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CalendarClock, CalendarPlus, Check, Copy, Pencil, type LucideIcon } from 'lucide-react';
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
import {
  formatDateTimeShortPtBR,
  formatRelativeTimePtBR,
  normalizeServerTimestamp,
} from '@/shared/utils/dateFormat';
import { DETAIL_TONES, type DetailTone } from './tones';
import { wasUpdatedAfterCreation } from './utils';

/* ------------------------------------------------------------------ Root */

export type DetailsDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  /** Título lido por leitores de tela (o visual fica no `DetailsHero`). */
  readonly title: string;
  readonly description?: string;
  /** `md` (padrão) para cadastros simples; `lg` quando há listas/tabelas de itens. */
  readonly size?: 'md' | 'lg';
  readonly children: ReactNode;
};

export function DetailsDialog({
  open,
  onOpenChange,
  title,
  description = 'Informações cadastrais do registro.',
  size = 'md',
  children,
}: DetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-h-[90vh] gap-0 overflow-y-auto p-0',
          size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-lg',
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}

export function DetailsDialogBody({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="space-y-5 p-6">{children}</div>;
}

/* ------------------------------------------------------------------ Hero */

export type DetailsHeroProps = {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly tone: DetailTone;
  /** Linha abaixo do título: badges de status, ID copiável, metadados. */
  readonly children?: ReactNode;
};

export function DetailsHero({ icon: Icon, title, tone, children }: DetailsHeroProps) {
  return (
    <div className="flex items-start gap-4 pr-6">
      <div
        className={cn(
          'flex size-14 shrink-0 items-center justify-center rounded-xl',
          DETAIL_TONES[tone].iconBg,
        )}
      >
        <Icon className="size-7" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="truncate text-lg font-semibold leading-tight" title={title}>
          {title}
        </p>
        {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}

export function DetailsStatusBadge({ tone, label }: Readonly<{ tone: DetailTone; label: string }>) {
  const classes = DETAIL_TONES[tone];
  return (
    <Badge variant="outline" className={cn('gap-1.5 border-0 ring-1 ring-inset', classes.badge)}>
      <span className={cn('size-1.5 rounded-full', classes.dot)} aria-hidden="true" />
      {label}
    </Badge>
  );
}

export function DetailsCopyId({ id, label = 'ID' }: Readonly<{ id: string; label?: string }>) {
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
      aria-label={copied ? `${label} copiado` : `Copiar ${label} (${id})`}
      className="inline-flex items-center gap-1 rounded font-mono text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      #{id.slice(0, 8)}
      {copied ? (
        <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
      ) : (
        <Copy className="size-3" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} copiado` : ''}
      </span>
    </button>
  );
}

/* ----------------------------------------------------------- Grid / Tile */

export function DetailsGrid({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function isEmptyValue(value: ReactNode): boolean {
  return (
    value === null ||
    value === undefined ||
    value === false ||
    (typeof value === 'string' && value.trim() === '')
  );
}

export type DetailsTileProps = {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly children?: ReactNode;
  readonly hint?: ReactNode;
  readonly span?: 1 | 2;
  /** Texto exibido quando o valor é vazio. */
  readonly emptyLabel?: string;
  readonly className?: string;
};

export function DetailsTile({
  icon: Icon,
  label,
  children,
  hint,
  span = 1,
  emptyLabel = 'Não informado',
  className,
}: DetailsTileProps) {
  const empty = isEmptyValue(children);
  return (
    <div
      className={cn(
        'min-w-0 rounded-lg border bg-muted/30 p-3',
        span === 2 && 'col-span-2',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </div>
      <div className="mt-1 wrap-break-word text-sm font-semibold text-foreground">
        {empty ? <span className="font-normal text-muted-foreground">{emptyLabel}</span> : children}
      </div>
      {!empty && hint && (
        <div className="mt-0.5 text-xs tabular-nums text-muted-foreground">{hint}</div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- Section */

/** Bloco com título para conteúdo que não cabe em tiles (listas de itens, tabelas). */
export function DetailsSection({
  title,
  icon: Icon,
  action,
  children,
}: Readonly<{ title: string; icon?: LucideIcon; action?: ReactNode; children: ReactNode }>) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {Icon && <Icon className="size-3.5" aria-hidden="true" />}
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------ Timestamps */

function DateRow({
  icon: Icon,
  label,
  iso,
}: Readonly<{ icon: LucideIcon; label: string; iso: string | null | undefined }>) {
  const utc = normalizeServerTimestamp(iso);
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
        {label}
      </span>
      {utc ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <time
              dateTime={utc}
              tabIndex={0}
              className="cursor-default rounded font-medium tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {formatRelativeTimePtBR(utc)}
            </time>
          </TooltipTrigger>
          <TooltipContent>{formatDateTimeShortPtBR(utc)}</TooltipContent>
        </Tooltip>
      ) : (
        <span className="text-muted-foreground">Não informado</span>
      )}
    </div>
  );
}

export function DetailsTimestamps({
  createdAt,
  updatedAt,
}: Readonly<{ createdAt: string | null | undefined; updatedAt?: string | null }>) {
  return (
    <>
      <Separator />
      <div className="space-y-2">
        <DateRow icon={CalendarPlus} label="Criado" iso={createdAt} />
        {wasUpdatedAfterCreation(createdAt, updatedAt) && (
          <DateRow icon={CalendarClock} label="Última atualização" iso={updatedAt} />
        )}
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Footer */

export type DetailsDialogFooterProps = {
  readonly onClose: () => void;
  readonly onEdit?: () => void;
  readonly editLabel?: string;
  readonly isLoading?: boolean;
  /** Ações extras do domínio, exibidas à direita antes de "Editar". */
  readonly children?: ReactNode;
};

export function DetailsDialogFooter({
  onClose,
  onEdit,
  editLabel = 'Editar',
  isLoading = false,
  children,
}: DetailsDialogFooterProps) {
  return (
    <DialogFooter className="gap-2 border-t bg-muted/30 px-6 py-4 sm:justify-between sm:space-x-0">
      <Button type="button" variant="ghost" onClick={onClose}>
        Fechar
      </Button>
      {(children || onEdit) && (
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          {children}
          {onEdit && (
            <Button type="button" onClick={onEdit} disabled={isLoading}>
              <Pencil className="size-4" aria-hidden="true" />
              {editLabel}
            </Button>
          )}
        </div>
      )}
    </DialogFooter>
  );
}

/* -------------------------------------------------------------- Skeleton */

export function DetailsDialogSkeleton() {
  return (
    <div className="space-y-5 p-6" aria-busy="true" aria-label="Carregando detalhes…">
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-18.5" />
        <Skeleton className="h-18.5" />
        <Skeleton className="col-span-2 h-15.5" />
      </div>
      <Skeleton className="h-px" />
      <div className="space-y-2">
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
      </div>
    </div>
  );
}
