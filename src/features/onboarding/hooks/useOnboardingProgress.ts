'use client';

import { useQuery } from '@tanstack/react-query';
import { onboardingService } from '../services/onboardingService';

export function useOnboardingProgress(enabled: boolean) {
  return useQuery({
    queryKey: ['onboarding', 'progress'],
    queryFn: () => onboardingService.getProgress(),
    enabled,
    staleTime: 1000 * 60,
    retry: false,
  });
}
