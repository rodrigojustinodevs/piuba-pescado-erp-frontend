'use client';

import { Eye, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
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

const SELECT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4]';

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
  const multiError = errors.tankIds ?? errors.tankTypeIds;

  return (
    <form
      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        onPreview();
      }}
      aria-label="Filtros do relatório de viveiros"
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
        <div>
          <label htmlFor="report-status" className="mb-1 block text-sm font-medium text-[#0F172A]">
            Situação do tanque
          </label>
          <select
            id="report-status"
            name="status"
            autoComplete="off"
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value as TankStatusFilter })}
            className={SELECT_CLASS}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
        </div>
        <div>
          <label
            htmlFor="report-occupancy"
            className="mb-1 block text-sm font-medium text-[#0F172A]"
          >
            Ocupação
          </label>
          <select
            id="report-occupancy"
            name="occupancy"
            autoComplete="off"
            value={filters.occupancy}
            onChange={(e) => onChange({ occupancy: e.target.value as OccupancyFilter })}
            className={SELECT_CLASS}
          >
            {Object.entries(OCCUPANCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.occupancy && <p className="mt-1 text-xs text-red-600">{errors.occupancy}</p>}
        </div>
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
      {multiError && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {multiError}
        </p>
      )}

      <p className="mt-2 text-xs text-slate-500">
        População e biomassa são as dos lotes ativos na data de corte, calculadas como no Relatório
        de Produção.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
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
    </form>
  );
}
