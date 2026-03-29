'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { sensorReadingService } from '../services/sensorReadingService';
import type { UpdateSensorReadingData } from '../types';

export function useUpdateSensorReading() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateSensorReadingData) => sensorReadingService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sensorReadings', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['sensorReadings', 'detail', data.id] });
      showSuccess('Leitura atualizada com sucesso!');
      router.push('/company/sensor-readings');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar leitura. Tente novamente.');
    },
  });
}
