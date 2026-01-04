/**
 * Tipos relacionados à entidade Tank
 */

export interface Tank {
  id: string;
  companyId: string;
  tankTypeId: string;
  name: string;
  capacityLiters: number;
  location?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface CreateTankData {
  companyId: string;
  tankTypeId: string;
  name: string;
  capacityLiters: number;
  location?: string;
  status: "active" | "inactive";
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
export interface ApiTankTypeListResponse {
  status: boolean;
  response: TankType[];
  message: string;
}

/**
 * Formato de tanque retornado pela API (camelCase com objetos aninhados)
 */
export interface ApiTank {
  id: string;
  name: string;
  capacityLiters: number;
  location?: string;
  status: "active" | "inactive";
  tankType: {
    id: string;
    name: string;
  };
  company: {
    name: string;
    id?: string;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Formato de resposta da API para listagem
 */
export interface ApiTankListResponse {
  status: boolean;
  response: ApiTank[];
  message: string;
  pagination: {
    total: number;
    current_page: number;
    last_page: number;
    first_page: number;
    per_page: number;
  };
}

/**
 * Formato padronizado para uso no frontend
 */
export interface TankListResponse {
  tanks: Tank[];
  total: number;
  page: number;
  limit: number;
}
