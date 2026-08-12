import type {
  ManagementPlan,
  ManagementPlanListParams,
  ManagementPlanListResponse,
  ReviewManagementPlanData,
} from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const managementPlanService = {
  async list(params?: ManagementPlanListParams): Promise<ManagementPlanListResponse> {
    const queryString = buildQueryString(
      {
        companyId: params?.companyId,
        batchId: params?.batchId,
        status: params?.status,
        page: params?.page,
        perPage: params?.perPage,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString
      ? `/api/company/management-plans?${queryString}`
      : '/api/company/management-plans';
    return browserHttpClient.get<ManagementPlanListResponse>(endpoint);
  },

  async getById(id: string): Promise<ManagementPlan> {
    return browserHttpClient.get<ManagementPlan>(`/api/company/management-plan/${id}`);
  },

  async generate(batchId: string): Promise<ManagementPlan> {
    return browserHttpClient.post<ManagementPlan>(
      `/api/company/batches/${batchId}/management-plan/generate`,
      {},
    );
  },

  async review(data: ReviewManagementPlanData): Promise<ManagementPlan> {
    const { id, ...body } = data;
    return browserHttpClient.post<ManagementPlan>(`/api/company/management-plan/${id}/review`, body);
  },
};
