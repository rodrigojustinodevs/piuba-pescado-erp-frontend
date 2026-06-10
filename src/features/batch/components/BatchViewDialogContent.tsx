'use client';

import type { ReactNode } from 'react';
import type { Batch } from '../types';
import { BatchStatusBadge } from './BatchStatusBadge';
import { formatDate, formatDateTime, formatQuantity, getCultivationLabel } from '../utils/format';
import { Calendar, Fish, Leaf, Package, Sprout } from 'lucide-react';

type BatchViewDialogContentProps = {
  batch: Batch | null;
};

export function BatchViewDialogContent({ batch }: Readonly<BatchViewDialogContentProps>) {
  if (!batch) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Lote não encontrado para visualização.
      </div>
    );
  }

  const title = batch.name?.trim() || batch.species;
  const subtitle = batch.tank?.name ? `Viveiro: ${batch.tank.name}` : 'Viveiro não informado';

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Fish className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-2">
            <BatchStatusBadge status={batch.status} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoRow icon={<Sprout className="h-4 w-4" />} label="Espécie" value={batch.species} />
        <InfoRow
          icon={<Package className="h-4 w-4" />}
          label="Quantidade inicial"
          value={formatQuantity(batch.initialQuantity)}
        />
        <InfoRow
          icon={<Leaf className="h-4 w-4" />}
          label="Tipo de cultivo"
          value={getCultivationLabel(batch.cultivation)}
        />
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Data de entrada"
          value={formatDate(batch.entryDate)}
        />
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Criado em"
          value={formatDateTime(batch.createdAt)}
        />
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Última atualização"
          value={formatDateTime(batch.updatedAt)}
        />
        <InfoRow
          icon={<Sprout className="h-4 w-4" />}
          label="Descrição"
          value={batch.description?.trim() ? batch.description.trim() : '—'}
          className="sm:col-span-2"
        />
      </div>
    </div>
  );
}

interface InfoRowProps {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: string;
  readonly className?: string;
}

function InfoRow({ icon, label, value, className }: Readonly<InfoRowProps>) {
  return (
    <div className={`space-y-1 ${className ?? ''}`}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="break-words text-sm">{value}</p>
    </div>
  );
}
