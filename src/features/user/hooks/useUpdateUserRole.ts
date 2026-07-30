'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { userService } from '../services/userService';
import type { UpdateUserRoleData } from '../types';

/**
 * Hook para alterar o perfil de acesso (role) de um usuário
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateUserRoleData) => userService.updateRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
      showSuccess('Perfil de acesso atualizado com sucesso!');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar perfil de acesso. Tente novamente.');
    },
  });
}
