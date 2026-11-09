'use client';

import {
  PeriodFields,
  ReportFilterForm,
  SelectField,
} from '@/features/reportExport/ReportFilterForm';
import { MultiSelect, type MultiSelectOption } from '@/shared/components/ui/MultiSelect';
import { CATEGORY_OPTIONS, SITUATION_LABELS, STOCK_TYPE_OPTIONS } from '../constants';
import type { FilterFieldErrors } from '../schemas';
import type { Category, InventoryFilters as Filters, SituationFilter, StockType } from '../types';

type Props = Readonly<{
  filters: Filters;
  includeDetails: boolean;
  errors: FilterFieldErrors;
  supplyOptions: MultiSelectOption[];
  optionsLoading: boolean;
  isPreviewLoading: boolean;
  isExportBusy: boolean;
  onChange: (patch: Partial<Filters>) => void;
  onIncludeDetailsChange: (value: boolean) => void;
  onPreview: () => void;
  onExport: () => void;
}>;

export function InventoryFilters({
  filters,
  includeDetails,
  errors,
  supplyOptions,
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
      ariaLabel="Filtros do relatório de estoque"
      multiError={errors.categories ?? errors.stockTypes ?? errors.supplyIds}
      helpText="O saldo é sempre o atual. A janela define o período usado para calcular o consumo e a cobertura (padrão: 30 dias até a data de corte)."
      details={{
        checked: includeDetails,
        onChange: onIncludeDetailsChange,
        label: 'Incluir anexos analíticos no PDF',
        description:
          'Movimentações do livro e baixas por alimentação. Deixa a geração bem mais lenta.',
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
          periodLabel="Janela de consumo"
        />
        <SelectField
          id="report-situation"
          name="situation"
          label="Situação"
          value={filters.situation}
          options={SITUATION_LABELS}
          error={errors.situation}
          onChange={(situation) => onChange({ situation: situation as SituationFilter })}
        />
        <MultiSelect
          label="Categorias"
          options={CATEGORY_OPTIONS}
          value={filters.categories}
          onChange={(categories) => onChange({ categories: categories as Category[] })}
        />
        <MultiSelect
          label="Tipos de estoque"
          options={STOCK_TYPE_OPTIONS}
          value={filters.stockTypes}
          onChange={(stockTypes) => onChange({ stockTypes: stockTypes as StockType[] })}
        />
        <MultiSelect
          label="Insumos"
          options={supplyOptions}
          value={filters.supplyIds}
          loading={optionsLoading}
          onChange={(supplyIds) => onChange({ supplyIds })}
        />
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-[#0F172A]">
          <input
            type="checkbox"
            role="switch"
            checked={filters.includeInactive}
            onChange={(e) => onChange({ includeInactive: e.target.checked })}
            className="h-4 w-4 accent-[#0EA5A4]"
          />{' '}
          Incluir estoques inativos
        </label>
      </div>
    </ReportFilterForm>
  );
}
