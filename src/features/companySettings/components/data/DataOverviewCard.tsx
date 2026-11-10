'use client';

import { HardDrive } from 'lucide-react';
import { useCompanySettings } from '@/shared/contexts/CompanySettingsContext';
import { toBcp47 } from '@/shared/utils/companyFormat';
import { ENTITY_LABELS, EXPORTABLE_ENTITIES } from '../../constants/options';
import type { DataOverview } from '../../types';
import { SettingsCard } from '../SettingsCard';
import { formatBytes } from './formatBytes';

export function DataOverviewCard({ overview }: Readonly<{ overview: DataOverview }>) {
  const { formatNumber, format } = useCompanySettings();

  return (
    <SettingsCard
      title="Registros por módulo"
      description="Registros ativos da empresa em cada módulo."
    >
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
          <p className="text-xs text-muted-foreground">Total de registros</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {formatNumber(overview.totalRecords)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HardDrive className="size-3.5" aria-hidden="true" />
            Armazenamento de exportações
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {formatBytes(overview.storage.storedExportsBytes, toBcp47(format.locale))}
          </p>
        </div>
      </div>
      <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {EXPORTABLE_ENTITIES.map((entity) => (
          <div
            key={entity}
            className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm"
          >
            <dt className="truncate text-muted-foreground">{ENTITY_LABELS[entity]}</dt>
            <dd className="font-medium tabular-nums text-foreground">
              {formatNumber(overview.records[entity] ?? 0)}
            </dd>
          </div>
        ))}
      </dl>
    </SettingsCard>
  );
}
