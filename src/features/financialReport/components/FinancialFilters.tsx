'use client';

import { PeriodFields, ReportFilterForm } from '@/features/reportExport/ReportFilterForm';
import { MultiSelect, type MultiSelectOption } from '@/shared/components/ui/MultiSelect';
import type { FilterFieldErrors } from '../schemas';
import type { FinancialFilters as Filters } from '../types';

type Props = Readonly<{
  filters: Filters;
  includeDetails: boolean;
  errors: FilterFieldErrors;
  categoryOptions: MultiSelectOption[];
  optionsLoading: boolean;
  isPreviewLoading: boolean;
  isExportBusy: boolean;
  onChange: (patch: Partial<Filters>) => void;
  onIncludeDetailsChange: (value: boolean) => void;
  onPreview: () => void;
  onExport: () => void;
}>;

export function FinancialFilters({
  filters,
  includeDetails,
  errors,
  categoryOptions,
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
      ariaLabel="Filtros do relatório financeiro"
      helpText="Realizado = pago até a data de corte. Previsto = em aberto na data de corte, no mês do vencimento. Sem janela, o fluxo mostra os 6 meses até o mês de corte (máximo de 60 meses). Lançamentos sem categoria só aparecem quando nenhuma categoria é selecionada."
      details={{
        checked: includeDetails,
        onChange: onIncludeDetailsChange,
        description:
          'Um lançamento por linha (inclusive cancelados e de outros tipos). Deixa a geração bem mais lenta.',
      }}
      isPreviewLoading={isPreviewLoading}
      isExportBusy={isExportBusy}
      onPreview={onPreview}
      onExport={onExport}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PeriodFields
          filters={filters}
          errors={errors}
          onChange={onChange}
          periodLabel="Fluxo de caixa"
        />
        <div>
          <MultiSelect
            label="Categorias"
            options={categoryOptions}
            value={filters.categoryIds}
            loading={optionsLoading}
            onChange={(categoryIds) => onChange({ categoryIds })}
          />
          {errors.categoryIds && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.categoryIds}
            </p>
          )}
        </div>
      </div>
    </ReportFilterForm>
  );
}
