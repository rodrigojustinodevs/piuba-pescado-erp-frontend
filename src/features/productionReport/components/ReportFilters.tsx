'use client';

import { FileDown, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
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
    <form
      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        onPreview();
      }}
      aria-label="Filtros do relatório de produção"
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
          label="Período — início"
          value={filters.periodStart}
          error={errors.periodStart}
          onChange={(e) => onChange({ periodStart: e.target.value })}
        />
        <Input
          type="date"
          autoComplete="off"
          name="periodEnd"
          label="Período — fim"
          value={filters.periodEnd}
          min={filters.periodStart || undefined}
          error={errors.periodEnd}
          onChange={(e) => onChange({ periodEnd: e.target.value })}
        />
        <div>
          <label htmlFor="report-status" className="mb-1 block text-sm font-medium text-[#0F172A]">
            Situação
          </label>
          <select
            id="report-status"
            name="status"
            autoComplete="off"
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value as ReportStatusFilter })}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4]"
          >
            {Object.entries(STATUS_FILTER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
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

      <p className="mt-2 text-xs text-slate-500">
        O período recorta mortalidade, crescimento, alimentação e despescas. A tabela por lote é
        sempre acumulada até a data de corte.
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
              Lançamentos de alimentação, mortalidade e biometria. Deixa a geração bem mais lenta.
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
