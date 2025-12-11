/**
 * Tipos relacionados à entidade Company
 */

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  active: boolean;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyData {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  active?: boolean;
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {
  id: string;
}

/**
 * Formato de resposta da API para listagem
 */
export interface ApiCompanyListResponse {
  status: boolean;
  response: Company[];
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
export interface CompanyListResponse {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
}

