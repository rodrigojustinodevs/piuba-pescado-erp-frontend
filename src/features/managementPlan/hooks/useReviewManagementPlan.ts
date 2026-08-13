'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { managementPlanService } from '../services/managementPlanService';
import type { ReviewManagementPlanData } from '../types';

export function useReviewManagementPlan() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: ReviewManagementPlanData) => managementPlanService.review(data),
    onSuccess: (_plan, variables) => {
      queryClient.invalidateQueries({ queryKey: ['managementPlans', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['managementPlans', 'detail', variables.id] });
      showSuccess(
        variables.decision === 'approved' ? 'Plano aprovado com sucesso!' : 'Plano rejeitado.',
      );
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao revisar plano de manejo. Tente novamente.');
    },
  });
}
