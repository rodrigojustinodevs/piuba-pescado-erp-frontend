import type { ApiPagination } from '@/shared/types/api';

export type ClientPersonType = 'company' | 'individual';
export type ClientPriceGroup = 'retail' | 'wholesale' | string;

export interface Client {
  id: string;
  companyId: string;
  name: string;
  personType: ClientPersonType;
  documentNumber: string | null;
  email: string | null;
  phone: string | null;
  contact: string | null;
  address: string | null;
  creditLimit: string | null;
  isDefaulter: boolean;
  priceGroup: ClientPriceGroup;
  companyName: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiClient {
  id: string;
  companyId?: string;
  name: string;
  personType: ClientPersonType;
  documentNumber: string | null;
  email: string | null;
  phone: string | null;
  contact: string | null;
  address: string | null;
  creditLimit: string | null;
  isDefaulter: boolean;
  priceGroup: ClientPriceGroup;
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
  personType: ClientPersonType;
  documentNumber: string | null;
  email: string | null;
  phone: string | null;
  contact: string | null;
  address: string | null;
  creditLimit: number | null;
  priceGroup: ClientPriceGroup;
}

export interface UpdateClientData extends CreateClientData {
  id: string;
}

