'use client';

import type { Stocking } from '../types';
import { formatDatePtBR, formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Calendar, Fish, Package, Scale } from 'lucide-react';
import { InfoRow } from '@/shared/components/entityDetail';

type StockingViewDialogContentProps = {
  stocking: Stocking | null;
  batchMap?: Record<string, string>;
};

function batchLabel(stocking: Stocking, batchMap: Record<string, string> = {}): string {
  if (stocking.batchName) return stocking.batchName;
  if (stocking.batchId && batchMap[stocking.batchId]) return batchMap[stocking.batchId];
  if (stocking.batchId) return `${stocking.batchId.slice(0, 8)}…`;
  return '—';
}

function formatNumberPtBR(value: number) {
  return value.toLocaleString('pt-BR');
}

export function StockingViewDialogContent({
  stocking,
  batchMap = {},
}: Readonly<StockingViewDialogContentProps>) {
  if (!stocking) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Povoamento não encontrado para visualização.
      </div>
    );
  }

  const lotLabel = batchLabel(stocking, batchMap);
  const totalWeightKg = stocking.quantity * stocking.averageWeight;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Fish className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">Povoamento</h3>
          <p className="text-sm text-muted-foreground">Lote: {lotLabel}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Data do povoamento"
          value={formatDatePtBR(stocking.stockingDate)}
        />
        <InfoRow
          icon={<Package className="h-4 w-4" />}
          label="Quantidade"
          value={formatNumberPtBR(stocking.quantity)}
        />
        <InfoRow
          icon={<Scale className="h-4 w-4" />}
          label="Peso médio (kg)"
          value={formatNumberPtBR(stocking.averageWeight)}
        />
        <InfoRow
          icon={<Scale className="h-4 w-4" />}
          label="Peso total estimado (kg)"
          value={formatNumberPtBR(totalWeightKg)}
        />
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Criado em"
          value={formatNullableDatePtBR(stocking.createdAt, true)}
        />
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Última atualização"
          value={formatNullableDatePtBR(stocking.updatedAt, true)}
        />
      </div>
    </div>
  );
}

