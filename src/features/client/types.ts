import type { ApiPagination } from '@/shared/types/api';

export type ClientPersonType = 'company' | 'individual';
export type ClientPriceGroup = 'retail' | 'wholesale' | string;
export type ClientStatus = 'active' | 'inactive' | 'prospect';
export type ClientDialogMode = 'create' | 'edit' | 'view';

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  prospect: 'Prospect',
};

export interface ClientCatalogStats {
  total: number;
  activeCount: number;
  prospectCount: number;
  totalCreditLimit: number;
}

export interface Client {
  id: string;
  companyId: string;
  name: string;
  tradeName: string | null;
  personType: ClientPersonType;
  documentNumber: string | null;
  email: string | null;
  phone: string | null;
  contact: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  creditLimit: string | null;
  purchaseTotal: number;
  isDefaulter: boolean;
  status: ClientStatus;
  priceGroup: ClientPriceGroup;
  notes: string | null;
  companyName: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiClient {
  id: string;
  companyId?: string;
  name: string;
  tradeName?: string | null;
  personType: ClientPersonType;
  documentNumber: string | null;
  email: string | null;
  phone: string | null;
  contact: string | null;
  city?: string | null;
  state?: string | null;
  address: string | null;
  creditLimit: string | null;
  purchaseTotal?: number | null;
  isDefaulter: boolean;
  status?: ClientStatus;
  priceGroup: ClientPriceGroup;
  notes?: string | null;
  company?: { name: string } | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type ApiClientListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiClient[] | { data?: ApiClient[] };
  pagination?: ApiPagination;
};

export interface ClientListResponse {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateClientData {
  companyId?: string;
  name: string;
  tradeName?: string | null;
  personType: ClientPersonType;
  documentNumber: string | null;
  email: string | null;
  phone: string | null;
  contact: string | null;
  city?: string | null;
  state?: string | null;
  creditLimit: number | null;
  priceGroup: ClientPriceGroup;
  status?: ClientStatus;
  notes?: string | null;
}

export interface UpdateClientData extends CreateClientData {
  id: string;
}
