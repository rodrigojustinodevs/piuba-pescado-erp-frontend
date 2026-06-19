'use client';

import type { Biometry } from '../types';
import { formatDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';
import { BarChart3, Calendar, Scale } from 'lucide-react';
import { InfoRow } from '@/shared/components/entityDetail';
import { formatNumber, formatSampleWeight, formatSampleQuantity } from '../utils/formatters';

type BiometryViewDialogContentProps = {
  biometry: Biometry | null;
};

export function BiometryViewDialogContent({ biometry }: Readonly<BiometryViewDialogContentProps>) {
  if (!biometry) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Biometria não encontrada para visualização.
      </div>
    );
  }

  const title = biometry.batchName?.trim() || `Biometria ${formatDatePtBR(biometry.biometryDate)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BarChart3 className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">
            Data da biometria: {formatDatePtBR(biometry.biometryDate)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Data da biometria"
          value={formatDatePtBR(biometry.biometryDate)}
        />
        <InfoRow
          icon={<Scale className="h-4 w-4" />}
          label="Peso médio"
          value={formatNumber(biometry.averageWeight)}
        />
        <InfoRow
          icon={<Scale className="h-4 w-4" />}
          label="Peso da amostra"
          value={formatSampleWeight(biometry.sampleWeight)}
        />
        <InfoRow
          icon={<Scale className="h-4 w-4" />}
          label="Quantidade na amostra"
          value={formatSampleQuantity(biometry.sampleQuantity)}
        />
        <InfoRow
          icon={<Scale className="h-4 w-4" />}
          label="FCR"
          value={formatNumber(biometry.fcr)}
        />
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Criado em"
          value={formatDatePtBR(biometry.createdAt)}
        />
        <InfoRow
          icon={<Calendar className="h-4 w-4" />}
          label="Última atualização"
          value={formatRelativeDateTimePtBR(biometry.updatedAt)}
        />
      </div>
    </div>
  );
}

