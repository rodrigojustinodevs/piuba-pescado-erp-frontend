'use client';

import type { ReactNode } from 'react';
import type { Transfer, TransferStatus } from '../types';
import { REASON_LABELS, STATUS_LABELS } from '../types';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { ArrowRight, Calendar, Clock, FileText, Fish, Scale, Tag, User, Users } from 'lucide-react';
import { InfoRow } from '@/shared/components/entityDetail';

type TransferViewDialogContentProps = {
  transfer: Transfer | null;
};

const STATUS_BADGE_CLASS: Record<TransferStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const formatNumber = (value: number, decimals = 2) =>
  new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);

export function TransferViewDialogContent({
  transfer,
}: Readonly<TransferViewDialogContentProps>) {
  if (!transfer) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Transferência não encontrada para visualização.
      </div>
    );
  }

  const shortId = transfer.id.slice(0, 8);
  const totalBiomass = (transfer.quantity * (transfer.averageWeight ?? 0)) / 1000;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Transferência #{shortId}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Registrada em {formatNullableDatePtBR(transfer.createdAt, true)}
          </p>
        </div>
        {transfer.status && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASS[transfer.status]}`}
          >
            {STATUS_LABELS[transfer.status]}
          </span>
        )}
      </div>

      {/* Origin → Destination */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border p-4">
        <TankPanel label="ORIGEM" name={transfer.originTankName ?? '—'} />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ArrowRight className="h-4 w-4" />
        </div>
        <TankPanel label="DESTINO" name={transfer.destinationTankName ?? '—'} align="right" />
      </div>

      {/* Batch + Transfer date */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoRow
          icon={<Fish className="h-4 w-4" />}
          label="LOTE"
          value={transfer.batchName ?? `Lote ${transfer.batchId.slice(0, 8)}…`}
        />
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="DATA DA TRANSFERÊNCIA"
          value={transfer.transferDate ? formatNullableDatePtBR(transfer.transferDate, false) : '—'}
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          icon={<Users className="h-4 w-4" />}
          label="Quantidade"
          value={String(transfer.quantity)}
          unit="indivíduos"
        />
        <MetricCard
          icon={<Scale className="h-4 w-4" />}
          label="Peso médio"
          value={formatNumber(transfer.averageWeight ?? 0)}
          unit="g"
        />
        <MetricCard
          icon={<Scale className="h-4 w-4" />}
          label="Biomassa total"
          value={formatNumber(totalBiomass)}
          unit="kg"
          highlight
        />
      </div>

      {/* Motivo + Responsável */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoRow
          icon={<Tag className="h-4 w-4" />}
          label="MOTIVO"
          value={transfer.reason ? REASON_LABELS[transfer.reason] : '—'}
        />
        <InfoRow
          icon={<User className="h-4 w-4" />}
          label="RESPONSÁVEL"
          value={transfer.responsible ?? '—'}
        />
      </div>

      {/* Observações */}
      {transfer.description && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Observações
          </div>
          <div className="rounded-lg border bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground">
            {transfer.description}
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        Última atualização em {formatNullableDatePtBR(transfer.updatedAt, true)}
      </p>
    </div>
  );
}

interface TankPanelProps {
  readonly label: string;
  readonly name: string;
  readonly align?: 'left' | 'right';
}

function TankPanel({ label, name, align = 'left' }: TankPanelProps) {
  const alignClass = align === 'right' ? 'text-right' : 'text-left';
  return (
    <div className={alignClass}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-semibold">{name}</p>
    </div>
  );
}

interface MetricCardProps {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: string;
  readonly unit: string;
  readonly highlight?: boolean;
}

function MetricCard({ icon, label, value, unit, highlight }: MetricCardProps) {
  return (
    <div
      className={`rounded-lg border p-3 ${highlight ? 'border-primary/20 bg-primary/5' : 'bg-muted/30'}`}
    >
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-lg font-semibold leading-none">
        {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}

