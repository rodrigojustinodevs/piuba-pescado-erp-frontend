'use client';

import { Download, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/components/ui/Button';
import { MultiSelect } from '@/shared/components/ui/MultiSelect';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { ExportStatusCard } from '@/features/reportExport/ExportStatusCard';
import { useReportExport } from '@/features/reportExport/useReportExport';
import { ENTITY_LABELS, EXPORTABLE_ENTITIES } from '../../constants/options';
import { companySettingsService } from '../../services/companySettingsService';
import type { ExportableEntity } from '../../types';
import { EXPORT_LIMIT_MESSAGE, errorMessage, errorStatus } from '../../utils/errors';
import { SettingsCard } from '../SettingsCard';

const ENTITY_OPTIONS = EXPORTABLE_ENTITIES.map((entity) => ({
  value: entity,
  label: ENTITY_LABELS[entity],
}));

/** O POST devolve `id`; o acompanhamento dos relatórios espera `exportId`. */
const startExport = (entities: ExportableEntity[]) =>
  companySettingsService
    .startDataExport(entities)
    .then((result) => ({ exportId: result.id, status: result.status }));

function toStartErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (errorStatus(error) === 429) return EXPORT_LIMIT_MESSAGE;
  return errorMessage(error, 'Não foi possível iniciar a exportação.');
}

const signature = (entities: ExportableEntity[]) => [...entities].sort().join(',');

export function DataExportCard() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [entities, setEntities] = useState<ExportableEntity[]>([]);

  const exporter = useReportExport<ExportableEntity[]>({
    storageKey: `settings-data-export:${user?.companyId ?? 'none'}`,
    queryKeyPrefix: 'settings-data-export',
    startExport,
    getExport: companySettingsService.getExport,
    signature,
  });

  const status = exporter.exportStatus?.status;
  // Ao concluir, a lista de exportações e o armazenamento mudam.
  useEffect(() => {
    if (status === 'done' || status === 'failed') {
      void queryClient.invalidateQueries({ queryKey: ['company-settings-data'] });
    }
  }, [status, queryClient]);

  const startMutation = exporter.start;
  const start = useCallback(() => startMutation(entities), [startMutation, entities]);
  const startErrorMessage = toStartErrorMessage(exporter.startError);

  return (
    <SettingsCard
      title="Exportar dados"
      description="Gera um arquivo .zip com um CSV por módulo (separador ;, UTF-8). Limite de 5 exportações por hora."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <MultiSelect
            label="Módulos"
            options={ENTITY_OPTIONS}
            value={entities}
            onChange={(next) => setEntities(next as ExportableEntity[])}
            placeholder="Todos os módulos"
            disabled={exporter.isActive || exporter.isStarting}
          />
        </div>
        <Button
          onClick={start}
          disabled={exporter.isActive || exporter.isStarting}
          className="h-10"
        >
          {exporter.isStarting ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <Download aria-hidden="true" />
          )}
          {exporter.isStarting ? 'Solicitando…' : 'Exportar'}
        </Button>
      </div>

      {startErrorMessage ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {startErrorMessage}
        </p>
      ) : null}

      {exporter.exportId ? (
        <div className="mt-4">
          <ExportStatusCard
            fileLabel="arquivo"
            status={exporter.exportStatus}
            timedOut={exporter.timedOut}
            pollingError={exporter.isPollingError}
            isStarting={exporter.isStarting}
            onDownload={exporter.download}
            onRetry={start}
            onDismiss={exporter.dismiss}
          />
        </div>
      ) : null}
    </SettingsCard>
  );
}
