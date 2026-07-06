'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { userService } from '../services/userService';

/**
 * Hook para deletar um usuário
 */
export function useDeleteUser() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
      showSuccess('Usuário excluído com sucesso!');
      router.push('/dashboard/usuarios');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir usuário. Tente novamente.');
    },
  });
}
