'use client';

import { BadgeDollarSign } from 'lucide-react';
import { ReportViewShell } from '@/features/reportExport/ReportViewShell';
import { useCommercialReportPage } from '../hooks/useCommercialReportPage';
import { COMMERCIAL_REPORT_ROLES } from '../utils/permissions';
import { ClientsTable } from './ClientsTable';
import { CommercialFilters } from './CommercialFilters';
import { CommercialSummaryCards } from './CommercialSummaryCards';

export function CommercialReportView() {
  const page = useCommercialReportPage();
  const { preview } = page;
  const data = preview.data;

  return (
    <ReportViewShell
      title="Relatório Comercial"
      icon={BadgeDollarSign}
      allowedRoles={COMMERCIAL_REPORT_ROLES}
      error={page.error}
      isPreviewLoading={preview.isLoading}
      onExport={page.onExport}
      exporter={page.exporter}
      filters={
        <CommercialFilters
          filters={page.filters}
          includeDetails={page.includeDetails}
          errors={page.fieldErrors}
          clientOptions={page.clientOptions}
          batchOptions={page.batchOptions}
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
          <CommercialSummaryCards summary={data.summary} />
          <ClientsTable clients={data.clients} summary={data.summary} />
        </>
      )}
    </ReportViewShell>
  );
}
