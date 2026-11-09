'use client';

import { Eye, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
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
    <form
      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        onPreview();
      }}
      aria-label="Filtros do relatório financeiro"
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
          label="Fluxo de caixa — início"
          value={filters.periodStart}
          error={errors.periodStart}
          onChange={(e) => onChange({ periodStart: e.target.value })}
        />
        <Input
          type="date"
          autoComplete="off"
          name="periodEnd"
          label="Fluxo de caixa — fim"
          value={filters.periodEnd}
          min={filters.periodStart || undefined}
          error={errors.periodEnd}
          onChange={(e) => onChange({ periodEnd: e.target.value })}
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

      <p className="mt-2 text-xs text-slate-500">
        Realizado = pago até a data de corte. Previsto = em aberto na data de corte, no mês do
        vencimento. Sem janela, o fluxo mostra os 6 meses até o mês de corte (máximo de 60 meses).
        Lançamentos sem categoria só aparecem quando nenhuma categoria é selecionada.
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
            Incluir anexo analítico no PDF
            <span className="block text-xs text-slate-500">
              Um lançamento por linha (inclusive cancelados e de outros tipos). Deixa a geração bem
              mais lenta.
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
