import type { ApiOnboardingProgress, OnboardingProgress, OnboardingStepId } from '../types';

export function mapApiOnboarding(apiData: ApiOnboardingProgress): OnboardingProgress {
  return {
    companyId: apiData.companyId,
    steps: (apiData.steps || []).map((step) => ({
      step: step.step as OnboardingStepId,
      status: step.status,
      completedAt: step.completedAt ?? null,
    })),
    dismissedAt: apiData.dismissedAt ?? null,
    updatedAt: apiData.updatedAt,
  };
}
