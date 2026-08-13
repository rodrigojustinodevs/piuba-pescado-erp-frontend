'use client';

import { useQuery } from '@tanstack/react-query';
import { managementPlanService } from '../services/managementPlanService';
import type { ManagementPlanListParams } from '../types';

export function useManagementPlans(params: ManagementPlanListParams = {}) {
  return useQuery({
    queryKey: ['managementPlans', 'list', params],
    queryFn: () => managementPlanService.list(params),
    enabled: !!params.batchId,
    staleTime: 1000 * 60,
  });
}
