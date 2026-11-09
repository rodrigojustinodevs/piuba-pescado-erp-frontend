'use client';

import { Eye, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { MultiSelect, type MultiSelectOption } from '@/shared/components/ui/MultiSelect';
import { PAYMENT_METHOD_LABELS, SALE_STATUS_LABELS } from '../constants';
import type { FilterFieldErrors } from '../schemas';
import type { CommercialFilters as Filters, PaymentMethod, SaleStatusFilter } from '../types';

type Props = Readonly<{
  filters: Filters;
  includeDetails: boolean;
  errors: FilterFieldErrors;
  clientOptions: MultiSelectOption[];
  batchOptions: MultiSelectOption[];
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

export function CommercialFilters({
  filters,
  includeDetails,
  errors,
  clientOptions,
  batchOptions,
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
      aria-label="Filtros do relatório comercial"
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
            Situação da venda
          </label>
          <select
            id="report-status"
            name="status"
            autoComplete="off"
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value as SaleStatusFilter })}
            className={SELECT_CLASS}
          >
            {Object.entries(SALE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
        </div>
        <div>
          <label htmlFor="report-payment" className="mb-1 block text-sm font-medium text-[#0F172A]">
            Forma de pagamento
          </label>
          <select
            id="report-payment"
            name="paymentMethod"
            autoComplete="off"
            value={filters.paymentMethod}
            onChange={(e) => onChange({ paymentMethod: e.target.value as PaymentMethod | '' })}
            className={SELECT_CLASS}
          >
            <option value="">Todas</option>
            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.paymentMethod && (
            <p className="mt-1 text-xs text-red-600">{errors.paymentMethod}</p>
          )}
        </div>
        <MultiSelect
          label="Clientes"
          options={clientOptions}
          value={filters.clientIds}
          loading={optionsLoading}
          onChange={(clientIds) => onChange({ clientIds })}
        />
        <MultiSelect
          label="Lotes"
          options={batchOptions}
          value={filters.batchIds}
          loading={optionsLoading}
          onChange={(batchIds) => onChange({ batchIds })}
        />
      </div>
      {(errors.clientIds || errors.batchIds) && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {errors.clientIds ?? errors.batchIds}
        </p>
      )}

      <p className="mt-2 text-xs text-slate-500">
        O período filtra pela data da venda. Recebido, em aberto e vencido consideram os pagamentos
        até a data de corte.
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
              Uma linha por venda (inclusive canceladas). Deixa a geração bem mais lenta.
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
