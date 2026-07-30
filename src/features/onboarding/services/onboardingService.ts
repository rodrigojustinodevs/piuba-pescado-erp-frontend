import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import type { OnboardingProgress, OnboardingStepId, OnboardingStepStatus } from '../types';

export const onboardingService = {
  async getProgress(): Promise<OnboardingProgress> {
    return browserHttpClient.get<OnboardingProgress>('/api/company/onboarding');
  },

  async updateStep(
    step: OnboardingStepId,
    status: Extract<OnboardingStepStatus, 'completed' | 'skipped'>,
  ): Promise<OnboardingProgress> {
    return browserHttpClient.put<OnboardingProgress>(`/api/company/onboarding/steps/${step}`, {
      status,
    });
  },

  async dismiss(): Promise<OnboardingProgress> {
    return browserHttpClient.put<OnboardingProgress>('/api/company/onboarding', {
      dismissedAt: new Date().toISOString(),
    });
  },
};
