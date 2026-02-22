'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { transferService } from '../services/transferService';
import type { UpdateTransferData } from '../types';

export function useUpdateTransfer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateTransferData) => transferService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transfers', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['transfers', 'detail', data.id] });
      showSuccess('Transferência atualizada com sucesso!');
      router.push(`/company/transfers/${data.id}`);
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar transferência. Tente novamente.');
    },
  });
}
