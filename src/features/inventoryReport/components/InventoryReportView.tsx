'use client';

import { Boxes } from 'lucide-react';
import { ReportViewShell } from '@/features/reportExport/ReportViewShell';
import { useInventoryReportPage } from '../hooks/useInventoryReportPage';
import { INVENTORY_REPORT_ROLES } from '../utils/permissions';
import { InventoryFilters } from './InventoryFilters';
import { InventorySummaryCards } from './InventorySummaryCards';
import { InventoryTable } from './InventoryTable';

export function InventoryReportView() {
  const page = useInventoryReportPage();
  const { preview } = page;
  const data = preview.data;

  return (
    <ReportViewShell
      title="Relatório de Estoque"
      icon={Boxes}
      allowedRoles={INVENTORY_REPORT_ROLES}
      error={page.error}
      isPreviewLoading={preview.isLoading}
      onExport={page.onExport}
      exporter={page.exporter}
      filters={
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
      }
    >
      {data && (
        <>
          <InventorySummaryCards summary={data.summary} />
          <InventoryTable items={data.items} summary={data.summary} />
        </>
      )}
    </ReportViewShell>
  );
}
