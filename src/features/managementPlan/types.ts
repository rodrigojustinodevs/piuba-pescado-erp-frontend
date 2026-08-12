/**
 * Tipos relacionados à entidade ManagementPlan (plano de manejo via IA)
 */

import type { ApiListResponse, ApiResponse } from '@/shared/types/api';

export type ManagementPlanStatus =
  | 'draft'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'superseded';

export type ManagementPlanItemCategory = 'feeding' | 'water_quality' | 'biometry' | 'health_alert';

export interface ManagementPlanItem {
  id: string;
  category: ManagementPlanItemCategory;
  dayOffset: number;
  description: string;
  targetValue?: number | string;
  unit?: string;
}

export interface ManagementPlanRef {
  id: string;
  name: string;
}

export interface ManagementPlan {
  id: string;
  status: ManagementPlanStatus;
  generatedBy: string;
  aiModelVersion: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  batch: ManagementPlanRef;
  tank: ManagementPlanRef;
  species: ManagementPlanRef | null;
  items: ManagementPlanItem[];
}

export type ApiManagementPlan = ManagementPlan;
export type ApiManagementPlanListResponse = ApiListResponse<ApiManagementPlan>;
export type ApiManagementPlanResponse = ApiResponse<ApiManagementPlan>;

export interface ManagementPlanListResponse {
  managementPlans: ManagementPlan[];
  total: number;
  page: number;
  limit: number;
}

export interface ManagementPlanListParams {
  companyId?: string;
  batchId?: string;
  status?: ManagementPlanStatus;
  page?: number;
  perPage?: number;
}

export type ReviewDecision = 'approved' | 'rejected';

export interface ReviewManagementPlanData {
  id: string;
  decision: ReviewDecision;
  rejectionReason?: string;
}
