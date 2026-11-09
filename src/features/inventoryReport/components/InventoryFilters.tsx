'use client';

import { Eye, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
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

const SELECT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4]';

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
  const multiError = errors.categories ?? errors.stockTypes ?? errors.supplyIds;

  return (
    <form
      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        onPreview();
      }}
      aria-label="Filtros do relatório de estoque"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          type="date"
          autoComplete="off"
          name="cutoffDate"
          label="Data de corte"
          value={filters.cutoffDate}
          error={errors.cutoffDate}
          onChange={(e) => onChange({ cutoffDate: e.target.value })}
        />
        <Input
          type="date"
          autoComplete="off"
          name="periodStart"
          label="Janela de consumo — início"
          value={filters.periodStart}
          error={errors.periodStart}
          onChange={(e) => onChange({ periodStart: e.target.value })}
        />
        <Input
          type="date"
          autoComplete="off"
          name="periodEnd"
          label="Janela de consumo — fim"
          value={filters.periodEnd}
          min={filters.periodStart || undefined}
          error={errors.periodEnd}
          onChange={(e) => onChange({ periodEnd: e.target.value })}
        />
        <div>
          <label
            htmlFor="report-situation"
            className="mb-1 block text-sm font-medium text-[#0F172A]"
          >
            Situação
          </label>
          <select
            id="report-situation"
            name="situation"
            autoComplete="off"
            value={filters.situation}
            onChange={(e) => onChange({ situation: e.target.value as SituationFilter })}
            className={SELECT_CLASS}
          >
            {Object.entries(SITUATION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.situation && <p className="mt-1 text-xs text-red-600">{errors.situation}</p>}
        </div>
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
          />
          Incluir estoques inativos
        </label>
      </div>
      {multiError && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {multiError}
        </p>
      )}

      <p className="mt-2 text-xs text-slate-500">
        O saldo é sempre o atual. A janela define o período usado para calcular o consumo e a
        cobertura (padrão: 30 dias até a data de corte).
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-start gap-2 text-sm text-[#0F172A]">
          <input
            type="checkbox"
            role="switch"
            checked={includeDetails}
            onChange={(e) => onIncludeDetailsChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#0EA5A4]"
          />
          <span>
            Incluir anexos analíticos no PDF
            <span className="block text-xs text-slate-500">
              Movimentações do livro e baixas por alimentação. Deixa a geração bem mais lenta.
            </span>
          </span>
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" variant="outline" disabled={isPreviewLoading}>
            {isPreviewLoading ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Eye aria-hidden="true" />
            )}
            Visualizar
          </Button>
          <Button
            type="button"
            onClick={onExport}
            disabled={isExportBusy}
            className="bg-[#0EA5A4] hover:bg-[#0F766E]"
          >
            <FileDown aria-hidden="true" />
            Gerar PDF
          </Button>
        </div>
      </div>
    </form>
  );
}
