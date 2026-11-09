export type {
  ExportJobStatus,
  ExportStatus,
  StartExportResult,
} from '@/features/reportExport/types';

/** Estado do formulário; strings vazias / arrays vazios = sem filtro. */
export type FinancialFilters = {
  cutoffDate: string;
  periodStart: string;
  periodEnd: string;
  categoryIds: string[];
};

export type StartExportInput = FinancialFilters & { includeDetails: boolean };

export type Summary = {
  revenueRealized: number;
  expenseRealized: number;
  resultRealized: number;
  marginRealizedPct: number | null;
  revenueForecast: number;
  expenseForecast: number;
  resultForecast: number;
  resultProjected: number;
  marginProjectedPct: number | null;
  overdueReceivable: number;
  overduePayable: number;
  cancelledCount: number;
  cancelledValue: number;
  otherTypesCount: number;
  otherTypesValue: number;
};

export type MonthRow = {
  /** 'YYYY-MM' */
  month: string;
  revenueRealized: number;
  expenseRealized: number;
  resultRealized: number;
  revenueForecast: number;
  expenseForecast: number;
  resultForecast: number;
  accumulatedRealized: number;
};

export type FinancialPreview = {
  /** Eco em snake_case: não dependa dele, use o estado do formulário. */
  filters: Record<string, unknown>;
  summary: Summary;
  months: MonthRow[];
};
