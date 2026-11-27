'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/contexts/ToastContext';
import type { CreateSensorData } from '../types';
import { sensorService } from '../services/sensorService';
import { isHandledGlobally } from '@/shared/lib/http/apiError';

export function useCreateSensor() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: CreateSensorData) => sensorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sensors', 'list'] });
      showSuccess('Sensor criado com sucesso!');
      router.push('/company/sensors');
    },
    onError: (error: Error) => {
      if (isHandledGlobally(error)) return;
      showError(error.message || 'Erro ao criar sensor. Tente novamente.');
    },
  });
}
