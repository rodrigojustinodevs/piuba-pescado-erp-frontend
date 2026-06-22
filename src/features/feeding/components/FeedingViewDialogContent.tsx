'use client';

import type { Feeding } from '../types';
import { formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';
import { Calendar, Package, Scale, Sprout, Warehouse } from 'lucide-react';
import { InfoRow } from '@/shared/components/entityDetail';

type FeedingViewDialogContentProps = {
  feeding: Feeding | null;
};

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

function formatNumber(value: number): string {
  return Number.isFinite(value) ? value.toLocaleString('pt-BR') : '—';
}

export function FeedingViewDialogContent({ feeding }: Readonly<FeedingViewDialogContentProps>) {
  if (!feeding) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Alimentação não encontrada para visualização.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Package className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">Alimentação</h3>
          <p className="text-sm text-muted-foreground">Lote: {feeding.batch.name || '—'}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoRow
          icon={<Warehouse className="h-4 w-4" />}
          label="Estoque"
          value={feeding.stock.name?.trim() ? feeding.stock.name : '—'}
        />
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Data da alimentação"
          value={formatDateTime(feeding.feedingDate)}
        />
        <InfoRow
          icon={<Scale className="h-4 w-4" />}
          label="Quantidade fornecida"
          value={formatNumber(feeding.quantityProvided)}
        />
        <InfoRow
          icon={<Sprout className="h-4 w-4" />}
          label="Tipo de ração"
          value={feeding.feedType || '—'}
        />
        <InfoRow
          icon={<Warehouse className="h-4 w-4" />}
          label="Redução de estoque"
          value={formatNumber(feeding.stockReductionQuantity)}
        />
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Última atualização"
          value={formatRelativeDateTimePtBR(feeding.updatedAt)}
        />
      </div>
    </div>
  );
}
