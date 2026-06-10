/**
 * Tipos relacionados à entidade Mortality (Mortalidade)
 */

import type { ApiPagination } from '@/shared/types/api';

export type MortalityCause =
  | 'disease'
  | 'water_quality'
  | 'predation'
  | 'handling'
  | 'climate'
  | 'unknown'
  | 'other';

export type MortalitySeverity = 'low' | 'medium' | 'high' | 'critical';
export interface Mortality {
  id: string;
  batchId: string;
  batch?: {
    id: string;
    name: string;
    initialQuantity?: number;
  };
  mortalityDate: string;
  quantity: number;
  cause: MortalityCause;
  severity: MortalitySeverity;
  description?: string;
  batchPercentage: number;
  createdAt: string | null;
  updatedAt: string;
}

export const CAUSE_LABELS: Record<MortalityCause, string> = {
  disease: 'Doença',
  water_quality: 'Qualidade da água',
  predation: 'Predação',
  handling: 'Manejo',
  climate: 'Evento climático',
  unknown: 'Desconhecida',
  other: 'Outra',
};

export const SEVERITY_LABELS: Record<MortalitySeverity, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

/**
 * Item retornado pela API na listagem
 */
export interface ApiMortality {
  id: string;
  batchId?: string;
  batch?: {
    id: string;
    name: string;
    initialQuantity?: number;
  };
  mortalityDate: string;
  quantity: number;
  cause: MortalityCause;
  severity?: MortalitySeverity;
  description?: string;
  batchPercentage?: number;
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
  cause: MortalityCause;
  severity: MortalitySeverity;
  description?: string;
}

export interface UpdateMortalityData extends CreateMortalityData {
  id: string;
}

/** Modos do dialog de mortalidade (lista / CRUD em modal) */
export type MortalityDialogMode = 'create' | 'edit' | 'view';
