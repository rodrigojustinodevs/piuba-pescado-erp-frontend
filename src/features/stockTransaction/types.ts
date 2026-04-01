import type { ApiPagination } from '@/shared/types/api';

export type StockTransactionDirection = 'in' | 'out';

export type StockTransactionReferenceType =
  | 'purchase_item'
  | 'feeding'
  | 'adjustment'
  | 'transfer'
  | 'stocking'
  | 'sale';

export interface StockTransaction {
  id: string;
  direction: StockTransactionDirection;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  referenceType: StockTransactionReferenceType;
  referenceId: string;
  createdAt: string;
}

export interface ApiStockTransaction {
  id: string;
  direction: StockTransactionDirection;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  referenceType: StockTransactionReferenceType;
  referenceId: string;
  createdAt: string;
}

export type ApiStockTransactionListResponse = {
  status?: boolean;
  message?: string;
  response?: { data?: ApiStockTransaction[] } | ApiStockTransaction[];
  pagination?: ApiPagination;
};

export interface StockTransactionListResponse {
  transactions: StockTransaction[];
  total: number;
  page: number;
  limit: number;
}
