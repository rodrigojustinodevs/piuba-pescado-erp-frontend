'use client';

import { Eye, FileDown, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

export const SELECT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4]';

type FormProps = Readonly<{
  ariaLabel: string;
  /** Campos do filtro (normalmente uma grid). */
  children: ReactNode;
  /** Erro de campos multi-select, exibido abaixo da grid. */
  multiError?: string;
  helpText?: string;
  details?: {
    checked: boolean;
    onChange: (value: boolean) => void;
    description: string;
    label?: string;
  };
  isPreviewLoading: boolean;
  isExportBusy: boolean;
  onPreview: () => void;
  onExport: () => void;
}>;

/** Formulário de filtros com o rodapé padrão (anexos opcionais, Visualizar e Gerar PDF). */
export function ReportFilterForm({
  ariaLabel,
  children,
  multiError,
  helpText,
  details,
  isPreviewLoading,
  isExportBusy,
  onPreview,
  onExport,
}: FormProps) {
  return (
    <form
      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        onPreview();
      }}
      aria-label={ariaLabel}
    >
      {children}
      {multiError && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {multiError}
        </p>
      )}
      {helpText && <p className="mt-2 text-xs text-slate-500">{helpText}</p>}

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {details ? (
          <label className="flex items-start gap-2 text-sm text-[#0F172A]">
            <input
              type="checkbox"
              role="switch"
              checked={details.checked}
              onChange={(e) => details.onChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#0EA5A4]"
            />
            <span>
              {details.label ?? 'Incluir anexo analítico no PDF'}{' '}
              <span className="block text-xs text-slate-500">{details.description}</span>
            </span>
          </label>
        ) : (
          <span />
        )}

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

type PeriodFilters = { cutoffDate: string; periodStart: string; periodEnd: string };

type PeriodProps = Readonly<{
  filters: PeriodFilters;
  errors: Partial<Record<keyof PeriodFilters, string>>;
  onChange: (patch: Partial<PeriodFilters>) => void;
  periodLabel?: string;
}>;

/** Data de corte + início/fim do período (três inputs date). */
export function PeriodFields({ filters, errors, onChange, periodLabel = 'Período' }: PeriodProps) {
  return (
    <>
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
        label={`${periodLabel} — início`}
        value={filters.periodStart}
        error={errors.periodStart}
        onChange={(e) => onChange({ periodStart: e.target.value })}
      />
      <Input
        type="date"
        autoComplete="off"
        name="periodEnd"
        label={`${periodLabel} — fim`}
        value={filters.periodEnd}
        min={filters.periodStart || undefined}
        error={errors.periodEnd}
        onChange={(e) => onChange({ periodEnd: e.target.value })}
      />
    </>
  );
}

type SelectProps = Readonly<{
  id: string;
  name: string;
  label: string;
  value: string;
  options: Record<string, string>;
  /** Opção extra "vazia" (ex.: "Todas"); omitida quando o mapa já tem `all`. */
  emptyLabel?: string;
  error?: string;
  onChange: (value: string) => void;
}>;

/** Select nativo rotulado a partir de um mapa valor → rótulo. */
export function SelectField({
  id,
  name,
  label,
  value,
  options,
  emptyLabel,
  error,
  onChange,
}: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[#0F172A]">
        {label}
      </label>
      <select
        id={id}
        name={name}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={SELECT_CLASS}
      >
        {emptyLabel !== undefined && <option value="">{emptyLabel}</option>}
        {Object.entries(options).map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
