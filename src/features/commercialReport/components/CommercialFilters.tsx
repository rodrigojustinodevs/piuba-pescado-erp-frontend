'use client';

import {
  PeriodFields,
  ReportFilterForm,
  SelectField,
} from '@/features/reportExport/ReportFilterForm';
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
    <ReportFilterForm
      ariaLabel="Filtros do relatório comercial"
      multiError={errors.clientIds ?? errors.batchIds}
      helpText="O período filtra pela data da venda. Recebido, em aberto e vencido consideram os pagamentos até a data de corte."
      details={{
        checked: includeDetails,
        onChange: onIncludeDetailsChange,
        description: 'Uma linha por venda (inclusive canceladas). Deixa a geração bem mais lenta.',
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
          label="Situação da venda"
          value={filters.status}
          options={SALE_STATUS_LABELS}
          error={errors.status}
          onChange={(status) => onChange({ status: status as SaleStatusFilter })}
        />
        <SelectField
          id="report-payment"
          name="paymentMethod"
          label="Forma de pagamento"
          value={filters.paymentMethod}
          options={PAYMENT_METHOD_LABELS}
          emptyLabel="Todas"
          error={errors.paymentMethod}
          onChange={(paymentMethod) =>
            onChange({ paymentMethod: paymentMethod as PaymentMethod | '' })
          }
        />
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
    </ReportFilterForm>
  );
}
