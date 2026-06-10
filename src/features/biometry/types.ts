/**
 * Tipos relacionados à entidade Biometry
 */

import type { ApiListResponse } from '@/shared/types/api';

export interface Biometry {
  id: string;
  batchId: string;
  batchName: string;
  biometryDate: string;
  averageWeight: number;
  sampleWeight: number;
  sampleQuantity: number;
  fcr: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Formato de biometria retornado pela API (backend)
 */
export interface ApiBiometry {
  id: string;
  batch: {
    id: string;
    name: string;
  };
  biometryDate: string;
  averageWeight: number;
  sampleWeight?: number;
  sampleQuantity?: number;
  fcr: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Formato de resposta da API para listagem
 */
export type ApiBiometryListResponse = ApiListResponse<ApiBiometry>;

/**
 * Formato padronizado para uso no frontend (listagem)
 */
export interface BiometryListResponse {
  biometries: Biometry[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Dados para criação de biometria
 */
export interface CreateBiometryData {
  batchId: string;
  biometryDate: string;
  averageWeight: number;
  sampleWeight: number;
  sampleQuantity: number;
  fcr: number;
}

/**
 * Dados para atualização de biometria
 */
export interface UpdateBiometryData extends CreateBiometryData {
  id: string;
}

/** Modos do dialog de biometria (lista / CRUD em modal) */
export type BiometryDialogMode = 'create' | 'edit' | 'view';
