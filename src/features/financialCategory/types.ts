import type { ApiPagination } from '@/shared/types/api';

export type FinancialCategoryTypeStrict = 'revenue' | 'expense' | 'investment';
export type FinancialCategoryStatusStrict = 'active' | 'inactive';

export interface ApiFinancialCategory {
  id: string;
  name: string;
  type: string;
  typeLabel?: string | null;
  status: string;
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
  type: string;
  typeLabel: string;
  status: string;
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
