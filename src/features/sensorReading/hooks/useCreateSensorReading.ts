'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateSensorReadingData } from '../types';
import { sensorReadingService } from '../services/sensorReadingService';

export function useCreateSensorReading() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateSensorReadingData) => sensorReadingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sensorReadings', 'list'] });
      showSuccess('Leitura registrada com sucesso!');
      router.push('/company/sensor-readings');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao registrar leitura. Tente novamente.');
    },
  });
}
