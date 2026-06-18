import type { ApiPagination } from '@/shared/types/api';

export type FinancialTransactionType = 'income' | 'expense' | 'transfer' | 'investment' | 'other';
export type FinancialTransactionStatus = 'paid' | 'pending' | 'overdue' | 'cancelled' | 'other';
export type FinancialTransactionMethod =
  | 'bank_slip'
  | 'pix'
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card'
  | 'cash'
  | 'check';

export type FinancialTransactionDialogMode = 'create' | 'edit' | 'view';

export const TYPE_LABELS: Record<FinancialTransactionType, string> = {
  income: 'Receita',
  expense: 'Despesa',
  transfer: 'Transferência',
  investment: 'Investimento',
  other: 'Outro',
};

export const STATUS_LABELS: Record<FinancialTransactionStatus, string> = {
  paid: 'Pago',
  pending: 'Pendente',
  overdue: 'Atrasado',
  cancelled: 'Cancelado',
  other: 'Outro',
};

export const METHOD_LABELS: Record<FinancialTransactionMethod, string> = {
  bank_slip: 'Boleto',
  pix: 'PIX',
  bank_transfer: 'Transferência Bancária',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  cash: 'Dinheiro',
  check: 'Cheque',
};

export interface FinancialTransactionCatalogStats {
  total: number;
  totalReceivable: number;
  totalPayable: number;
  overdueCount: number;
}

export interface ApiFinancialTransaction {
  id: string;
  type: string;
  typeLabel?: string | null;
  status: string;
  statusLabel?: string | null;
  method?: string | null;
  amount: number;
  dueDate: string | null;
  paymentDate: string | null;
  description: string | null;
  notes: string | null;
  referenceType: string | null;
  referenceId: string | null;
  company?: { name?: string | null; id?: string | null } | null;
  category?: {
    id?: string | null;
    name?: string | null;
    type?: string | null;
    typeLabel?: string | null;
  } | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type ApiFinancialTransactionListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiFinancialTransaction[] | { data?: ApiFinancialTransaction[] };
  pagination?: ApiPagination;
};

export interface FinancialTransaction {
  id: string;
  type: FinancialTransactionType;
  typeLabel: string;
  status: FinancialTransactionStatus;
  statusLabel: string;
  method: FinancialTransactionMethod | null;
  methodLabel: string | null;
  amount: number;
  dueDate: string | null;
  paymentDate: string | null;
  description: string | null;
  notes: string | null;
  referenceType: string | null;
  referenceId: string | null;
  companyName: string;
  companyId: string;
  categoryId: string | null;
  categoryName: string;
  categoryType: string | null;
  categoryTypeLabel: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface FinancialTransactionListResponse {
  financialTransactions: FinancialTransaction[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateFinancialTransactionData {
  companyId?: string;
  type: Exclude<FinancialTransactionType, 'other'>;
  status: Exclude<FinancialTransactionStatus, 'other'>;
  method?: FinancialTransactionMethod;
  amount: number;
  dueDate?: string;
  paymentDate?: string;
  description?: string;
  notes?: string;
  categoryId?: string;
}

export interface UpdateFinancialTransactionData extends CreateFinancialTransactionData {
  id: string;
}
