import type { ApiPagination } from '@/shared/types/api';

export interface Supply {
  id: string;
  companyId: string;
  name: string;
  category: string | null;
  defaultUnit: string;
  companyName: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiSupply {
  id: string;
  companyId: string;
  name: string;
  category: string | null;
  defaultUnit: string;
  company?: { name: string } | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type ApiSupplyListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiSupply[] | { data?: ApiSupply[] };
  pagination?: ApiPagination;
};

export interface SupplyListResponse {
  supplies: Supply[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSupplyData {
  companyId?: string;
  name: string;
  category: string | null;
  defaultUnit: string;
}

export interface UpdateSupplyData extends CreateSupplyData {
  id: string;
}

