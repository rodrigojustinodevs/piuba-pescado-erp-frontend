'use client';

import { Boxes } from 'lucide-react';
import { ExportStatusCard } from '@/features/reportExport/ExportStatusCard';
import { ListEmptyState, ListLoadingState } from '@/shared/components/states/ListStates';
import { Alert, AlertDescription } from '@/shared/components/ui/Alert';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { useInventoryReportPage } from '../hooks/useInventoryReportPage';
import { INVENTORY_REPORT_ROLES } from '../utils/permissions';
import { InventoryFilters } from './InventoryFilters';
import { InventorySummaryCards } from './InventorySummaryCards';
import { InventoryTable } from './InventoryTable';

export function InventoryReportView() {
  const { user, isLoading, canAccess } = useAuthContext();
  const page = useInventoryReportPage();
  const { preview, exporter } = page;

  if (isLoading || !user) return <ListLoadingState label="Carregando sessão…" />;

  if (!canAccess(INVENTORY_REPORT_ROLES)) {
    return (
      <ListEmptyState
        title="Você não tem permissão para acessar este relatório."
        subtitle="Fale com um administrador da empresa."
      />
    );
  }

  const data = preview.data;

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-3">
        <span className="rounded-lg bg-[#0EA5A4]/10 p-2 text-[#0F766E]">
          <Boxes className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Relatório de Estoque</h1>
          <p className="text-sm text-slate-600">
            Visualize na tela ou gere o PDF com os mesmos filtros.
          </p>
        </div>
      </header>

      <InventoryFilters
        filters={page.filters}
        includeDetails={page.includeDetails}
        errors={page.fieldErrors}
        supplyOptions={page.supplyOptions}
        optionsLoading={page.optionsLoading}
        isPreviewLoading={preview.isLoading}
        isExportBusy={page.isExportBusy}
        onChange={page.updateFilters}
        onIncludeDetailsChange={page.setIncludeDetails}
        onPreview={page.onPreview}
        onExport={page.onExport}
      />

      {page.error && (
        <Alert variant="destructive">
          <AlertDescription>{page.error.message}</AlertDescription>
        </Alert>
      )}

      {exporter.exportId && (
        <ExportStatusCard
          status={exporter.exportStatus}
          timedOut={exporter.timedOut}
          pollingError={exporter.isPollingError}
          isStarting={exporter.isStarting}
          onDownload={exporter.download}
          onRetry={page.onExport}
          onDismiss={exporter.dismiss}
        />
      )}

      {preview.isLoading && <ListLoadingState label="Carregando relatório…" />}

      {data && !preview.isLoading && (
        <>
          <InventorySummaryCards summary={data.summary} />
          <InventoryTable items={data.items} summary={data.summary} />
        </>
      )}
    </div>
  );
}
