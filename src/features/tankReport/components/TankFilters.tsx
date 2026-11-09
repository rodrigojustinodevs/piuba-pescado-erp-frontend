'use client';

import { ReportFilterForm, SelectField } from '@/features/reportExport/ReportFilterForm';
import { Input } from '@/shared/components/ui/Input';
import { MultiSelect, type MultiSelectOption } from '@/shared/components/ui/MultiSelect';
import { OCCUPANCY_LABELS, STATUS_LABELS } from '../constants';
import type { FilterFieldErrors } from '../schemas';
import type { OccupancyFilter, TankFilters as Filters, TankStatusFilter } from '../types';

type Props = Readonly<{
  filters: Filters;
  errors: FilterFieldErrors;
  tankOptions: MultiSelectOption[];
  tankTypeOptions: MultiSelectOption[];
  optionsLoading: boolean;
  isPreviewLoading: boolean;
  isExportBusy: boolean;
  onChange: (patch: Partial<Filters>) => void;
  onPreview: () => void;
  onExport: () => void;
}>;

export function TankFilters({
  filters,
  errors,
  tankOptions,
  tankTypeOptions,
  optionsLoading,
  isPreviewLoading,
  isExportBusy,
  onChange,
  onPreview,
  onExport,
}: Props) {
  return (
    <ReportFilterForm
      ariaLabel="Filtros do relatório de viveiros"
      multiError={errors.tankIds ?? errors.tankTypeIds}
      helpText="População e biomassa são as dos lotes ativos na data de corte, calculadas como no Relatório de Produção."
      isPreviewLoading={isPreviewLoading}
      isExportBusy={isExportBusy}
      onPreview={onPreview}
      onExport={onExport}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          type="date"
          autoComplete="off"
          name="cutoffDate"
          label="Data de corte"
          value={filters.cutoffDate}
          error={errors.cutoffDate}
          onChange={(e) => onChange({ cutoffDate: e.target.value })}
        />
        <SelectField
          id="report-status"
          name="status"
          label="Situação do tanque"
          value={filters.status}
          options={STATUS_LABELS}
          error={errors.status}
          onChange={(status) => onChange({ status: status as TankStatusFilter })}
        />
        <SelectField
          id="report-occupancy"
          name="occupancy"
          label="Ocupação"
          value={filters.occupancy}
          options={OCCUPANCY_LABELS}
          error={errors.occupancy}
          onChange={(occupancy) => onChange({ occupancy: occupancy as OccupancyFilter })}
        />
        <MultiSelect
          label="Tanques"
          options={tankOptions}
          value={filters.tankIds}
          loading={optionsLoading}
          onChange={(tankIds) => onChange({ tankIds })}
        />
        <MultiSelect
          label="Tipos de tanque"
          options={tankTypeOptions}
          value={filters.tankTypeIds}
          loading={optionsLoading}
          onChange={(tankTypeIds) => onChange({ tankTypeIds })}
        />
      </div>
    </ReportFilterForm>
  );
}
