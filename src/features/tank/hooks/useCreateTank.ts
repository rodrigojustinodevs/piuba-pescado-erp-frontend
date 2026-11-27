'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { FIELD_ERRORS_TOAST, hasServerFieldErrors } from '@/shared/utils/formErrors';
import { tankService } from '../services/tankService';
import type { CreateTankData } from '../types';

/**
 * Hook para criar um novo tanque
 */
export function useCreateTank() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateTankData) => tankService.create(data),
    onSuccess: () => {
      // Invalida a lista de tanques
      queryClient.invalidateQueries({ queryKey: ['tanks', 'list'] });

      // Mostra mensagem de sucesso
      showSuccess('Tanque criado com sucesso!');

      // Redireciona para a página de lista de tanques
      router.push(`/company/tanks`);
    },
    onError: (error: Error) => {
      // Erros por campo aparecem no próprio formulário; o toast só aponta para eles.
      if (hasServerFieldErrors(error)) {
        showError(FIELD_ERRORS_TOAST);
        return;
      }
      showError(error.message || 'Erro ao criar tanque. Tente novamente.');
    },
  });
}
