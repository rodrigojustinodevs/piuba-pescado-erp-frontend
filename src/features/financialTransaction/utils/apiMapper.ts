import type {
  ApiFinancialTransaction,
  ApiFinancialTransactionListResponse,
  FinancialTransaction,
  FinancialTransactionListResponse,
} from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

function normalizeTypeLabel(item: Pick<ApiFinancialTransaction, 'type' | 'typeLabel'>): string {
  const key = item.type?.toLowerCase?.() ?? '';
  if (key === 'revenue') return 'Receita';
  if (key === 'expense') return 'Despesa';
  if (key === 'investment') return 'Investimento';
  return item.typeLabel?.trim() || item.type || '—';
}

function normalizeStatusLabel(item: Pick<ApiFinancialTransaction, 'status' | 'statusLabel'>): string {
  const key = item.status?.toLowerCase?.() ?? '';
  if (key === 'pending') return 'Pendente';
  if (key === 'paid') return 'Pago';
  if (key === 'cancelled') return 'Cancelado';
  return item.statusLabel?.trim() || item.status || '—';
}

export function mapApiFinancialTransaction(api: ApiFinancialTransaction): FinancialTransaction {
  return {
    id: api.id,
    type: api.type,
    typeLabel: normalizeTypeLabel(api),
    status: api.status,
    statusLabel: normalizeStatusLabel(api),
    amount: api.amount,
    dueDate: api.dueDate ?? null,
    paymentDate: api.paymentDate ?? null,
    description: api.description ?? null,
    notes: api.notes ?? null,
    referenceType: api.referenceType ?? null,
    referenceId: api.referenceId ?? null,
    companyName: api.company?.name ?? '',
    categoryId: api.category?.id ?? null,
    categoryName: api.category?.name ?? '',
    categoryType: api.category?.type ?? null,
    categoryTypeLabel: api.category?.typeLabel ?? null,
    createdAt: api.createdAt ?? null,
    updatedAt: api.updatedAt ?? null,
  };
}

export function mapApiFinancialTransactionList(
  apiData: ApiFinancialTransactionListResponse,
): FinancialTransactionListResponse {
  const financialTransactions = extractListFromPagedApiResponse(apiData).map(mapApiFinancialTransaction);
  return {
    financialTransactions,
    ...getApiPagedListMeta(apiData),
  };
}

