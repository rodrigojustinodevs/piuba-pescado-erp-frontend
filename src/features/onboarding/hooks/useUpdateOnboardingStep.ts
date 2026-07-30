'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingService } from '../services/onboardingService';
import type { OnboardingStepId, OnboardingStepStatus } from '../types';

interface UpdateOnboardingStepInput {
  step: OnboardingStepId;
  status: Extract<OnboardingStepStatus, 'completed' | 'skipped'>;
}

export function useUpdateOnboardingStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ step, status }: UpdateOnboardingStepInput) =>
      onboardingService.updateStep(step, status),
    onSuccess: (data) => {
      queryClient.setQueryData(['onboarding', 'progress'], data);
    },
  });
}
