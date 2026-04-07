import type {
  CreateFinancialCategoryData,
  FinancialCategory,
  FinancialCategoryListResponse,
  FinancialCategoryStatus,
  FinancialCategoryType,
  UpdateFinancialCategoryData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const financialCategoryService = {
  async list(params?: {
    page?: number;
    limit?: number;
    companyId?: string;
    type?: FinancialCategoryType;
    status?: FinancialCategoryStatus;
  }): Promise<FinancialCategoryListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        per_page: params?.limit,
        company_id: params?.companyId,
        type: params?.type,
        status: params?.status,
      },
      { skipEmptyString: true },
    );

    const endpoint = queryString
      ? `/api/company/financial-categories?${queryString}`
      : '/api/company/financial-categories';

    return browserHttpClient.get<FinancialCategoryListResponse>(endpoint);
  },

  async create(data: CreateFinancialCategoryData): Promise<FinancialCategory> {
    return browserHttpClient.post<FinancialCategory>('/api/company/financial-category', data);
  },

  async getById(id: string): Promise<FinancialCategory> {
    return browserHttpClient.get<FinancialCategory>(`/api/company/financial-categories/${id}`);
  },

  async update(data: UpdateFinancialCategoryData): Promise<FinancialCategory> {
    const { id, ...body } = data;
    return browserHttpClient.put<FinancialCategory>(`/api/company/financial-categories/${id}`, body);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/company/financial-categories/${id}`);
  },

  async activate(id: string): Promise<FinancialCategory> {
    return browserHttpClient.patch<FinancialCategory>(`/api/company/financial-categories/${id}/active`);
  },

  async deactivate(id: string): Promise<FinancialCategory> {
    return browserHttpClient.patch<FinancialCategory>(`/api/company/financial-categories/${id}/inactive`);
  },
};
