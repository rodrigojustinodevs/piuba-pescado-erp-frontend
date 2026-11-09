'use client';

import {
  PeriodFields,
  ReportFilterForm,
  SelectField,
} from '@/features/reportExport/ReportFilterForm';
import { MultiSelect, type MultiSelectOption } from '@/shared/components/ui/MultiSelect';
import { STATUS_FILTER_LABELS } from '../constants';
import type { FilterFieldErrors } from '../schemas';
import type { ReportFilters as Filters, ReportStatusFilter } from '../types';

type Props = Readonly<{
  filters: Filters;
  includeDetails: boolean;
  errors: FilterFieldErrors;
  batchOptions: MultiSelectOption[];
  tankOptions: MultiSelectOption[];
  optionsLoading: boolean;
  isPreviewLoading: boolean;
  isExportBusy: boolean;
  onChange: (patch: Partial<Filters>) => void;
  onIncludeDetailsChange: (value: boolean) => void;
  onPreview: () => void;
  onExport: () => void;
}>;

export function ReportFilters({
  filters,
  includeDetails,
  errors,
  batchOptions,
  tankOptions,
  optionsLoading,
  isPreviewLoading,
  isExportBusy,
  onChange,
  onIncludeDetailsChange,
  onPreview,
  onExport,
}: Props) {
  return (
    <ReportFilterForm
      ariaLabel="Filtros do relatório de produção"
      helpText="O período recorta mortalidade, crescimento, alimentação e despescas. A tabela por lote é sempre acumulada até a data de corte."
      details={{
        checked: includeDetails,
        onChange: onIncludeDetailsChange,
        description:
          'Lançamentos de alimentação, mortalidade e biometria. Deixa a geração bem mais lenta.',
      }}
      isPreviewLoading={isPreviewLoading}
      isExportBusy={isExportBusy}
      onPreview={onPreview}
      onExport={onExport}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PeriodFields filters={filters} errors={errors} onChange={onChange} />
        <SelectField
          id="report-status"
          name="status"
          label="Situação"
          value={filters.status}
          options={STATUS_FILTER_LABELS}
          onChange={(status) => onChange({ status: status as ReportStatusFilter })}
        />
        <MultiSelect
          label="Lotes"
          options={batchOptions}
          value={filters.batchIds}
          loading={optionsLoading}
          onChange={(batchIds) => onChange({ batchIds })}
        />
        <MultiSelect
          label="Tanques"
          options={tankOptions}
          value={filters.tankIds}
          loading={optionsLoading}
          onChange={(tankIds) => onChange({ tankIds })}
        />
      </div>
    </ReportFilterForm>
  );
}
