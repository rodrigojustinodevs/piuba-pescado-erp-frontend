'use client';

import { SEVERITY_LABELS, type Mortality } from '../types';
import {
  formatNullableDatePtBR,
  formatRelativeDateTimePtBR,
} from '@/shared/utils/dateFormat';
import { Calendar, Hash, Skull } from 'lucide-react';
import { InfoRow } from '@/shared/components/entityDetail';

type MortalityViewDialogContentProps = {
  mortality: Mortality | null;
};

function formatNumber(value: number): string {
  return Number.isFinite(value) ? String(value) : '—';
}

export function MortalityViewDialogContent({
  mortality,
}: Readonly<MortalityViewDialogContentProps>) {
  if (!mortality) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Mortalidade não encontrada para visualização.
      </div>
    );
  }

  const title = mortality.batch?.name?.trim() || `Mortalidade ${formatNullableDatePtBR(mortality.mortalityDate)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Skull className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">
            Data: {formatNullableDatePtBR(mortality.mortalityDate)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoRow
          icon={<Hash className="h-4 w-4" />}
          label="Lote"
          value={mortality.batch?.name || '—'}
        />
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Data da mortalidade"
          value={formatNullableDatePtBR(mortality.mortalityDate)}
        />
        <InfoRow
          icon={<Hash className="h-4 w-4" />}
          label="Quantidade"
          value={formatNumber(mortality.quantity)}
        />
        <InfoRow icon={<Hash className="h-4 w-4" />} label="Causa" value={mortality.cause || '—'} />
        <InfoRow
          icon={<Hash className="h-4 w-4" />}
          label="Severidade"
          value={SEVERITY_LABELS[mortality.severity] ?? '—'}
        />
        {mortality.description && (
          <div className="sm:col-span-2">
            <InfoRow
              icon={<Hash className="h-4 w-4" />}
              label="Descrição"
              value={mortality.description}
            />
          </div>
        )}
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Criado em"
          value={formatNullableDatePtBR(mortality.createdAt, true)}
        />
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Última atualização"
          value={formatRelativeDateTimePtBR(mortality.updatedAt)}
        />
      </div>
    </div>
  );
}

