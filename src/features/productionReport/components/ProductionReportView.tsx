'use client';

import { FileText } from 'lucide-react';
import { ReportViewShell } from '@/features/reportExport/ReportViewShell';
import { ListEmptyState } from '@/shared/components/states/ListStates';
import { useProductionReportPage } from '../hooks/useProductionReportPage';
import { PRODUCTION_REPORT_ROLES } from '../utils/permissions';
import { BatchesTable } from './BatchesTable';
import { GrowthSection } from './GrowthSection';
import { HarvestsSection } from './HarvestsSection';
import { MortalitySection } from './MortalitySection';
import { ReportFilters } from './ReportFilters';
import { SummaryCards } from './SummaryCards';
import { WeeklyFeedingSection } from './WeeklyFeedingSection';

export function ProductionReportView() {
  const page = useProductionReportPage();
  const { preview } = page;
  const data = preview.data;

  return (
    <ReportViewShell
      title="Relatório de Produção"
      icon={FileText}
      allowedRoles={PRODUCTION_REPORT_ROLES}
      error={page.error}
      isPreviewLoading={preview.isLoading}
      onExport={page.onExport}
      exporter={page.exporter}
      filters={
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
      }
    >
      {data && (
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
    </ReportViewShell>
  );
}
