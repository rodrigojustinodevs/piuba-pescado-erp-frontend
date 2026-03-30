/**
 * Fornecedores — contrato com GET /api/company/suppliers
 */

import type { ApiPagination } from '@/shared/types/api';

export interface ApiSupplier {
  id: string;
  companyId: string;
  name: string;
  contact: string | null;
  phone: string | null;
  email: string | null;
  company?: {
    name?: string;
  };
  createdAt: string | null;
  updatedAt: string | null;
}

export type ApiSupplierListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiSupplier[] | { data?: ApiSupplier[] };
  pagination?: ApiPagination;
};

export interface Supplier {
  id: string;
  companyId: string;
  name: string;
  contact: string | null;
  phone: string | null;
  email: string | null;
  companyName: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SupplierListResponse {
  suppliers: Supplier[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSupplierData {
  companyId?: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
}

export interface UpdateSupplierData extends CreateSupplierData {
  id: string;
}
