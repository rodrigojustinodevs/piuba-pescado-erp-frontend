'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { managementPlanService } from '../services/managementPlanService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

export function useGenerateManagementPlan() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (batchId: string) => managementPlanService.generate(batchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managementPlans', 'list'] });
      showSuccess('Plano de manejo gerado com sucesso!');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Falha ao gerar plano de manejo. Tente novamente.');
    },
  });
}
