'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { userService } from '../services/userService';
import type { CreateUserData } from '../types';

/**
 * Hook para criar um novo usuário
 */
export function useCreateUser() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateUserData) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
      showSuccess('Usuário criado com sucesso!');
      router.push('/dashboard/usuarios');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao criar usuário. Tente novamente.');
    },
  });
}
