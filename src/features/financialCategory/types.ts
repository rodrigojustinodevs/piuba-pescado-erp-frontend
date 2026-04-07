import type { ApiPagination } from '@/shared/types/api';

export type FinancialCategoryTypeStrict = 'revenue' | 'expense' | 'investment';
export type FinancialCategoryStatusStrict = 'active' | 'inactive';

export type FinancialCategoryType = string;
export type FinancialCategoryStatus = string;

export interface ApiFinancialCategory {
  id: string;
  name: string;
  type: FinancialCategoryType;
  typeLabel?: string | null;
  status: FinancialCategoryStatus;
  statusLabel?: string | null;
  company?: {
    id?: string;
    name?: string | null;
  };
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type ApiFinancialCategoryListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiFinancialCategory[] | { data?: ApiFinancialCategory[] };
  pagination?: ApiPagination;
};

export interface FinancialCategory {
  id: string;
  name: string;
  type: FinancialCategoryType;
  typeLabel: string;
  status: FinancialCategoryStatus;
  statusLabel: string;
  companyId: string;
  companyName: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface FinancialCategoryListResponse {
  financialCategories: FinancialCategory[];
  total: number;
  page: number;
  limit: number;
}

/** Payload de criação; `companyId` apenas para master (admin). */
export interface CreateFinancialCategoryData {
  companyId?: string;
  name: string;
  type: FinancialCategoryTypeStrict;
  status: FinancialCategoryStatusStrict;
}

export interface UpdateFinancialCategoryData extends CreateFinancialCategoryData {
  id: string;
}
