'use client';

import { useQuery } from '@tanstack/react-query';
import { managementPlanService } from '../services/managementPlanService';

export function useManagementPlan(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['managementPlans', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID é obrigatório');
      return managementPlanService.getById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60,
  });
}
