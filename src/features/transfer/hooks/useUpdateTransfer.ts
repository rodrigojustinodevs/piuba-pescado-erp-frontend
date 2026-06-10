'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { transferService } from '../services/transferService';
import type { PatchTransferPayload, UpdateTransferData } from '../types';

type UseUpdateTransferOptions = {
  skipNavigateToList?: boolean;
};

export function useUpdateTransfer({ skipNavigateToList }: UseUpdateTransferOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateTransferData | PatchTransferPayload) => transferService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transfers', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['transfers', 'detail', data.id] });
      showSuccess('Transferência atualizada com sucesso!');
      if (!skipNavigateToList) {
        router.push(`/company/transfers/${data.id}`);
      }
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar transferência. Tente novamente.');
    },
  });
}
