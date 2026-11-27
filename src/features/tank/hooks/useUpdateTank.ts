'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { FIELD_ERRORS_TOAST, hasServerFieldErrors } from '@/shared/utils/formErrors';
import { tankService } from '../services/tankService';
import type { UpdateTankData } from '../types';

/**
 * Hook para atualizar um tanque existente
 */
export function useUpdateTank() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateTankData) => tankService.update(data),
    onSuccess: () => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['tanks', 'list'] });

      // Mostra mensagem de sucesso
      showSuccess('Tanque atualizado com sucesso!');

      // Redireciona para a página de detalhes
      router.push(`/company/tanks`);
    },

    onError: (error: Error) => {
      // Erros por campo aparecem no próprio formulário; o toast só aponta para eles.
      if (hasServerFieldErrors(error)) {
        showError(FIELD_ERRORS_TOAST);
        return;
      }
      showError(error.message || 'Erro ao atualizar tanque. Tente novamente.');
    },
  });
}
