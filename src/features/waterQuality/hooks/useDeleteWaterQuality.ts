'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { waterQualityService } from '../services/waterQualityService';

export function useDeleteWaterQuality() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => waterQualityService.delete(id),
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['waterQualities', 'list'] });
      queryClient.removeQueries({ queryKey: ['waterQualities', 'detail', deletedId] });
      showSuccess('Medição excluída com sucesso!');
      router.push('/company/water-qualities');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir medição. Tente novamente.');
    },
  });
}
