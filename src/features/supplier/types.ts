/**
 * Fornecedores — contrato com GET /api/company/suppliers
 */

import type { ApiPagination } from '@/shared/types/api';

export type SupplierCategory =
  | 'feed'
  | 'medication'
  | 'equipment'
  | 'supply'
  | 'service'
  | 'logistics'
  | 'other';

export type SupplierStatus = 'active' | 'inactive' | 'suspended';

export const CATEGORY_LABELS: Record<SupplierCategory, string> = {
  feed: 'Ração',
  medication: 'Medicamento',
  equipment: 'Equipamento',
  supply: 'Insumo',
  service: 'Serviço',
  logistics: 'Logística',
  other: 'Outros',
};

export const STATUS_LABELS: Record<SupplierStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  suspended: 'Suspenso',
};

export interface SupplierAddress {
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}

export interface ApiSupplierAddress {
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
}

export interface ApiSupplier {
  id: string;
  companyId: string;
  name: string;
  tradeName?: string | null;
  document?: string | null;
  stateRegistration?: string | null;
  contact: string | null;
  contactName?: string | null;
  phone: string | null;
  email: string | null;
  category?: SupplierCategory | null;
  categoryLabel?: string | null;
  paymentTerms?: string | null;
  rating?: number | null;
  address?: ApiSupplierAddress | null;
  status?: SupplierStatus | null;
  statusLabel?: string | null;
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
  tradeName: string | null;
  document: string | null;
  stateRegistration: string | null;
  contact: string | null;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  category: SupplierCategory | null;
  categoryLabel: string | null;
  paymentTerms: string | null;
  rating: number | null;
  address: SupplierAddress;
  status: SupplierStatus;
  statusLabel: string;
  totalPurchases: number;
  lastPurchaseAt: string | null;
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
  tradeName?: string | null;
  document: string;
  stateRegistration?: string | null;
  contact?: string | null;
  phone: string;
  email: string;
  category?: SupplierCategory | null;
  paymentTerms?: string | null;
  status: SupplierStatus;
  rating?: number | null;
  address: {
    street?: string | null;
    number?: string | null;
    complement?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
  };
}

export interface UpdateSupplierData extends CreateSupplierData {
  id: string;
}

export type SupplierDialogMode = 'create' | 'edit' | 'view';
