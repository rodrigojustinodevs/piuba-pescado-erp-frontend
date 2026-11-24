'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { isGateError } from '@/features/billing/utils/gating';
import { managementPlanService } from '../services/managementPlanService';

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
      // 403 de plano/assinatura: o diálogo global de billing já orienta o usuário.
      if (isGateError(error)) return;
      showError(error.message || 'Falha ao gerar plano de manejo. Tente novamente.');
    },
  });
}
