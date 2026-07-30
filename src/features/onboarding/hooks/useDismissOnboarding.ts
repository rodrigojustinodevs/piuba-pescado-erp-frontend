'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingService } from '../services/onboardingService';

export function useDismissOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => onboardingService.dismiss(),
    onSuccess: (data) => {
      queryClient.setQueryData(['onboarding', 'progress'], data);
    },
  });
}
