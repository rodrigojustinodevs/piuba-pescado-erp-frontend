'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import { sensorService } from '../services/sensorService';
import type { UpdateSensorData } from '../types';

export function useUpdateSensor() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: UpdateSensorData) => sensorService.update(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sensors', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['sensors', 'detail', data.id] });
      showSuccess('Sensor atualizado com sucesso!');
      router.push('/company/sensors');
    },
    onError: (error: Error) => {
      showError(error.message || 'Erro ao atualizar sensor. Tente novamente.');
    },
  });
}
