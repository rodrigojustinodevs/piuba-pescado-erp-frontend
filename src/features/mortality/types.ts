/**
 * Tipos relacionados à entidade Mortality (Mortalidade)
 */

import type { ApiPagination } from '@/shared/types/api';

export interface Mortality {
  id: string;
  batchId: string;
  batchName: string;
  mortalityDate: string;
  quantity: number;
  cause: string;
  createdAt: string | null;
  updatedAt: string;
}

/**
 * Item retornado pela API na listagem
 */
export interface ApiMortality {
  id: string;
  batchId?: string;
  batch?: {
    id: string;
    name: string;
  };
  mortalityDate: string;
  quantity: number;
  cause: string;
  createdAt: string | null;
  updatedAt: string;
}

/**
 * Listagem: `response` pode ser `{ data: [] }` ou, em formato alternativo, o array direto.
 */
export type ApiMortalityListResponse = {
  status?: boolean;
  message?: string;
  response?: ApiMortality[] | { data?: ApiMortality[] };
  pagination?: ApiPagination;
};

export interface MortalityListResponse {
  mortalities: Mortality[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateMortalityData {
  batchId: string;
  mortalityDate: string;
  quantity: number;
  cause: string;
}

export interface UpdateMortalityData extends CreateMortalityData {
  id: string;
}
