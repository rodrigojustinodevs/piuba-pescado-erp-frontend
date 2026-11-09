'use client';

import { Landmark } from 'lucide-react';
import { ReportViewShell } from '@/features/reportExport/ReportViewShell';
import { useFinancialReportPage } from '../hooks/useFinancialReportPage';
import { FINANCIAL_REPORT_ROLES } from '../utils/permissions';
import { CashFlowTable } from './CashFlowTable';
import { FinancialFilters } from './FinancialFilters';
import { FinancialSummaryCards } from './FinancialSummaryCards';

export function FinancialReportView() {
  const page = useFinancialReportPage();
  const { preview } = page;
  const data = preview.data;

  return (
    <ReportViewShell
      title="Relatório Financeiro"
      icon={Landmark}
      allowedRoles={FINANCIAL_REPORT_ROLES}
      error={page.error}
      isPreviewLoading={preview.isLoading}
      onExport={page.onExport}
      exporter={page.exporter}
      filters={
        <FinancialFilters
          filters={page.filters}
          includeDetails={page.includeDetails}
          errors={page.fieldErrors}
          categoryOptions={page.categoryOptions}
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
          <FinancialSummaryCards summary={data.summary} />
          <CashFlowTable months={data.months} summary={data.summary} />
        </>
      )}
    </ReportViewShell>
  );
}
