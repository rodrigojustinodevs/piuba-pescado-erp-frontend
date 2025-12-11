import axios from "axios";
import type {
  Company,
  CreateCompanyData,
  UpdateCompanyData,
  CompanyListResponse,
} from "../types";

/**
 * Cliente axios configurado para a API de empresas
 * Usa a rota de proxy do Next.js que faz requisição para o backend
 */
const companyApi = axios.create({
  baseURL: "/api/companies",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Serviço de API para empresas
 */
export const companyService = {
  /**
   * Lista todas as empresas com paginação
   */
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<CompanyListResponse> {
    const response = await companyApi.get<CompanyListResponse>("/", { params });
    return response.data;
  },

  /**
   * Busca uma empresa por ID
   */
  async getById(id: string): Promise<Company> {
    const response = await companyApi.get<Company>(`/${id}`);
    return response.data;
  },

  /**
   * Cria uma nova empresa
   */
  async create(data: CreateCompanyData): Promise<Company> {
    const response = await companyApi.post<Company>("/", data);
    return response.data;
  },

  /**
   * Atualiza uma empresa existente
   */
  async update(data: UpdateCompanyData): Promise<Company> {
    const { id, ...updateData } = data;
    const response = await companyApi.put<Company>(`/${id}`, updateData);
    return response.data;
  },

  /**
   * Remove uma empresa
   */
  async delete(id: string): Promise<void> {
    await companyApi.delete(`/${id}`);
  },
};

