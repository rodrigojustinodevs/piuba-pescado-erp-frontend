'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { userService } from '../services/userService';
import type { UpdateUserData } from '../types';

/**
 * Hook para atualizar um usuário existente
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateUserData) => userService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
      showSuccess('Usuário atualizado com sucesso!');
      router.push('/dashboard/usuarios');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar usuário. Tente novamente.');
    },
  });
}
