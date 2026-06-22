/**
 * Tipos relacionados à entidade Tank
 */

import type { ApiListResponse, ApiResponse } from '@/shared/types/api';

export interface TankCompany {
  id?: string;
  name: string;
}
export type TankStatus = 'active' | 'inactive' | 'maintenance';

export interface Tank {
  id: string;
  name: string;
  capacityLiters: number;
  location?: string;
  status: TankStatus;
  tankType: TankType;
  company: TankCompany;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTankData {
  companyId: string;
  tankTypeId: string;
  name: string;
  capacityLiters: number;
  location?: string;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface UpdateTankData extends Partial<CreateTankData> {
  id: string;
}

/**
 * Tipo de tanque retornado pela API
 */
export interface TankType {
  id: string;
  name: string;
  description?: string;
}

/**
 * Formato de resposta da API para listagem de tipos
 */
export type ApiTankTypeListResponse = ApiResponse<{ tankTypes: TankType[] }>;

export interface TankTypeListResponse {
  tankTypes: TankType[];
}
/**
 * Formato de tanque retornado pela API (camelCase com objetos aninhados)
 */
export interface ApiTank {
  id: string;
  name: string;
  capacityLiters: number;
  location?: string;
  status: 'active' | 'inactive' | 'maintenance';
  tankType: {
    id: string;
    name: string;
  };
  company: {
    name: string;
    id?: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Formato de resposta da API para listagem
 */
export type ApiTankListResponse = ApiListResponse<ApiTank>;

/**
 * Formato padronizado para uso no frontend
 */
export interface TankListResponse {
  tanks: Tank[];
  total: number;
  page: number;
  limit: number;
}

export type TankDialogMode = 'create' | 'edit' | 'view';

export interface TankTableProps {
  tanks: Tank[];
  openTankDialog: (mode: TankDialogMode, tank: Tank | null) => void;
  handleTankDelete: (id: string, name: string) => void;
  rowActions: (tank: Tank) => DataTableAction[];
  isDeleting?: boolean;
}
