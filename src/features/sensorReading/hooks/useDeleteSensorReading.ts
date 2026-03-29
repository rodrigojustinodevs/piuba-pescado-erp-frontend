'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { sensorReadingService } from '../services/sensorReadingService';

export function useDeleteSensorReading() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => sensorReadingService.delete(id),
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['sensorReadings', 'list'] });
      queryClient.removeQueries({ queryKey: ['sensorReadings', 'detail', deletedId] });
      showSuccess('Leitura excluída com sucesso!');
      router.push('/company/sensor-readings');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao excluir leitura. Tente novamente.');
    },
  });
}
