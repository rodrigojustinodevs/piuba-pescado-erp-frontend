export type {
  ExportJobStatus,
  ExportStatus,
  StartExportResult,
} from '@/features/reportExport/types';

export type SaleStatusFilter = 'all' | 'pending' | 'confirmed' | 'paid' | 'delivered' | 'overdue';

export type PaymentMethod =
  | 'pix'
  | 'bank_slip'
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card'
  | 'cash'
  | 'check';

/** Estado do formulário; strings vazias / arrays vazios = sem filtro. */
export type CommercialFilters = {
  cutoffDate: string;
  periodStart: string;
  periodEnd: string;
  status: SaleStatusFilter;
  paymentMethod: PaymentMethod | '';
  clientIds: string[];
  batchIds: string[];
};

export type StartExportInput = CommercialFilters & { includeDetails: boolean };

export type Summary = {
  sales: number;
  clients: number;
  kg: number;
  grossRevenue: number;
  discount: number;
  taxes: number;
  shipping: number;
  netRevenue: number;
  avgPricePerKg: number | null;
  avgTicket: number | null;
  received: number;
  receivedPct: number | null;
  openAmount: number;
  overdueAmount: number;
  clientsWithOverdue: number;
  cancelledSales: number;
  cancelledValue: number;
};

export type ClientRow = {
  clientId: string;
  clientName: string;
  tradeName: string | null;
  sales: number;
  kg: number;
  grossRevenue: number;
  discount: number;
  taxes: number;
  shipping: number;
  netRevenue: number;
  avgPricePerKg: number | null;
  avgTicket: number | null;
  sharePct: number | null;
  received: number;
  openAmount: number;
  overdueAmount: number;
  lastSaleDate: string | null;
  creditLimit: number | null;
  creditUsagePct: number | null;
  isDefaulter: boolean;
};

export type CommercialPreview = {
  /** Eco em snake_case: não dependa dele, use o estado do formulário. */
  filters: Record<string, unknown>;
  summary: Summary;
  clients: ClientRow[];
};
