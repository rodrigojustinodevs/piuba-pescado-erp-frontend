'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { sensorService } from '../services/sensorService';

export function useDeleteSensor() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => sensorService.delete(id),
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['sensors', 'list'] });
      queryClient.removeQueries({ queryKey: ['sensors', 'detail', deletedId] });
      showSuccess('Sensor excluído com sucesso!');
      router.push('/company/sensors');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir sensor. Tente novamente.');
    },
  });
}
