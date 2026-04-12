import type { ApiPagination } from '@/shared/types/api';

/** Valores conhecidos; `other` quando a API enviar outro código. */
export type FinancialTransactionType = 'revenue' | 'expense' | 'investment' | 'other';

export type FinancialTransactionStatus = 'pending' | 'paid' | 'cancelled' | 'other';

export interface ApiFinancialTransaction {
  id: string;
  type: string;
  typeLabel?: string | null;
  status: string;
  statusLabel?: string | null;
  amount: number;
  dueDate: string | null;
  paymentDate: string | null;
  description: string | null;
  notes: string | null;
  referenceType: string | null;
  referenceId: string | null;
  company?: { name?: string | null } | null;
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
  amount: number;
  dueDate: string | null;
  paymentDate: string | null;
  description: string | null;
  notes: string | null;
  referenceType: string | null;
  referenceId: string | null;
  companyName: string;
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

