import type {
  ApiFinancialTransaction,
  ApiFinancialTransactionListResponse,
  FinancialTransaction,
  FinancialTransactionListResponse,
  FinancialTransactionMethod,
  FinancialTransactionStatus,
  FinancialTransactionType,
} from '../types';
import { METHOD_LABELS as METHODS } from '../types';
import {
  extractListFromPagedApiResponse,
  getApiPagedListMeta,
} from '@/shared/utils/apiListResponse';

function mapType(raw: string | undefined | null): FinancialTransactionType {
  const k = (raw ?? '').toLowerCase();
  if (k === 'income' || k === 'revenue') return 'income';
  if (k === 'expense') return 'expense';
  if (k === 'transfer') return 'transfer';
  if (k === 'investment') return 'investment';
  return 'other';
}

function mapStatus(raw: string | undefined | null): FinancialTransactionStatus {
  const k = (raw ?? '').toLowerCase();
  if (k === 'paid') return 'paid';
  if (k === 'pending') return 'pending';
  if (k === 'overdue') return 'overdue';
  if (k === 'cancelled') return 'cancelled';
  return 'other';
}

function mapMethod(raw: string | undefined | null): FinancialTransactionMethod | null {
  const k = (raw ?? '').toLowerCase();
  const valid: FinancialTransactionMethod[] = [
    'bank_slip',
    'pix',
    'bank_transfer',
    'credit_card',
    'debit_card',
    'cash',
    'check',
  ];
  return valid.includes(k as FinancialTransactionMethod) ? (k as FinancialTransactionMethod) : null;
}

function normalizeTypeLabel(type: FinancialTransactionType): string {
  const map: Record<FinancialTransactionType, string> = {
    income: 'Receita',
    expense: 'Despesa',
    transfer: 'Transferência',
    investment: 'Investimento',
    other: 'Outro',
  };
  return map[type];
}

function normalizeStatusLabel(status: FinancialTransactionStatus): string {
  const map: Record<FinancialTransactionStatus, string> = {
    paid: 'Pago',
    pending: 'Pendente',
    overdue: 'Atrasado',
    cancelled: 'Cancelado',
    other: 'Outro',
  };
  return map[status];
}

export function mapApiFinancialTransaction(api: ApiFinancialTransaction): FinancialTransaction {
  const type = mapType(api.type);
  const status = mapStatus(api.status);
  const method = mapMethod(api.method);
  return {
    id: api.id,
    type,
    typeLabel: normalizeTypeLabel(type),
    status,
    statusLabel: normalizeStatusLabel(status),
    method,
    methodLabel: method ? METHODS[method] : null,
    amount: api.amount,
    dueDate: api.dueDate ?? null,
    paymentDate: api.paymentDate ?? null,
    description: api.description ?? null,
    notes: api.notes ?? null,
    referenceType: api.referenceType ?? null,
    referenceId: api.referenceId ?? null,
    companyName: api.company?.name ?? '',
    companyId: api.company ? (api.company.id ?? '') : '',
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
  const financialTransactions = extractListFromPagedApiResponse(apiData).map(
    mapApiFinancialTransaction,
  );
  return {
    financialTransactions,
    ...getApiPagedListMeta(apiData),
  };
}
