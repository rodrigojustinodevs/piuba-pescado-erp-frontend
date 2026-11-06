'use client';

import { FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/ui/Alert';
import { ListEmptyState, ListLoadingState } from '@/shared/components/states/ListStates';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { useProductionReportPage } from '../hooks/useProductionReportPage';
import { PRODUCTION_REPORT_ROLES } from '../utils/permissions';
import { BatchesTable } from './BatchesTable';
import { ExportStatusCard } from './ExportStatusCard';
import { GrowthSection } from './GrowthSection';
import { HarvestsSection } from './HarvestsSection';
import { MortalitySection } from './MortalitySection';
import { ReportFilters } from './ReportFilters';
import { SummaryCards } from './SummaryCards';
import { WeeklyFeedingSection } from './WeeklyFeedingSection';

export function ProductionReportView() {
  const { user, isLoading, canAccess } = useAuthContext();
  const page = useProductionReportPage();
  const { preview, exporter } = page;

  if (isLoading || !user) return <ListLoadingState label="Carregando sessão…" />;

  if (!canAccess(PRODUCTION_REPORT_ROLES)) {
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
          <FileText className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Relatório de Produção</h1>
          <p className="text-sm text-slate-600">
            Visualize na tela ou gere o PDF com os mesmos filtros.
          </p>
        </div>
      </header>

      <ReportFilters
        filters={page.filters}
        includeDetails={page.includeDetails}
        errors={page.fieldErrors}
        batchOptions={page.batchOptions}
        tankOptions={page.tankOptions}
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
          {data.batches.length === 0 && (
            <ListEmptyState
              title="Nenhum lote encontrado."
              subtitle="Ajuste os filtros e visualize novamente."
            />
          )}
          <SummaryCards summary={data.summary} />
          <BatchesTable batches={data.batches} />
          <MortalitySection mortality={data.mortality} batches={data.batches} />
          <GrowthSection points={data.growth} />
          <WeeklyFeedingSection rows={data.weeklyFeeding} />
          <HarvestsSection harvests={data.harvests} />
        </>
      )}
    </div>
  );
}
