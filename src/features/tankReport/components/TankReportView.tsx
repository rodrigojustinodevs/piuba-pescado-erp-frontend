'use client';

import { Waves } from 'lucide-react';
import { ReportViewShell } from '@/features/reportExport/ReportViewShell';
import { useTankReportPage } from '../hooks/useTankReportPage';
import { TANK_REPORT_ROLES } from '../utils/permissions';
import { TankFilters } from './TankFilters';
import { TankSummaryCards } from './TankSummaryCards';
import { TankTable } from './TankTable';

export function TankReportView() {
  const page = useTankReportPage();
  const { preview } = page;
  const data = preview.data;

  return (
    <ReportViewShell
      title="Relatório de Viveiros"
      icon={Waves}
      allowedRoles={TANK_REPORT_ROLES}
      error={page.error}
      isPreviewLoading={preview.isLoading}
      onExport={page.onExport}
      exporter={page.exporter}
      filters={
        <TankFilters
          filters={page.filters}
          errors={page.fieldErrors}
          tankOptions={page.tankOptions}
          tankTypeOptions={page.tankTypeOptions}
          optionsLoading={page.optionsLoading}
          isPreviewLoading={preview.isLoading}
          isExportBusy={page.isExportBusy}
          onChange={page.updateFilters}
          onPreview={page.onPreview}
          onExport={page.onExport}
        />
      }
    >
      {data && (
        <>
          <TankSummaryCards summary={data.summary} />
          <TankTable tanks={data.tanks} summary={data.summary} />
        </>
      )}
    </ReportViewShell>
  );
}
