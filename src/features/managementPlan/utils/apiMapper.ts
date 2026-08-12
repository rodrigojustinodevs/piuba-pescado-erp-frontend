import type {
  ApiManagementPlan,
  ApiManagementPlanListResponse,
  ManagementPlan,
  ManagementPlanListResponse,
} from '../types';

export function mapApiManagementPlan(apiPlan: ApiManagementPlan): ManagementPlan {
  return {
    id: apiPlan.id,
    status: apiPlan.status,
    generatedBy: apiPlan.generatedBy,
    aiModelVersion: apiPlan.aiModelVersion,
    reviewedBy: apiPlan.reviewedBy,
    reviewedAt: apiPlan.reviewedAt,
    rejectionReason: apiPlan.rejectionReason,
    createdAt: apiPlan.createdAt,
    updatedAt: apiPlan.updatedAt,
    batch: apiPlan.batch,
    tank: apiPlan.tank,
    species: apiPlan.species,
    items: apiPlan.items ?? [],
  };
}

export function mapApiManagementPlanList(
  apiData: ApiManagementPlanListResponse,
): ManagementPlanListResponse {
  const managementPlans: ManagementPlan[] = (apiData.response || []).map(mapApiManagementPlan);

  return {
    managementPlans,
    total: apiData.pagination?.total || 0,
    page: apiData.pagination?.current_page || 1,
    limit: apiData.pagination?.per_page || 10,
  };
}
