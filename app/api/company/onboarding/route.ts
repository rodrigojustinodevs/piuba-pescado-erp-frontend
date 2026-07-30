import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { mapApiOnboarding } from '@/features/onboarding/utils/apiMapper';
import type {
  ApiOnboardingResponse,
  DismissOnboardingData,
  OnboardingProgress,
} from '@/features/onboarding/types';

const CONTEXT = 'Onboarding API Proxy';

/**
 * Contrato assumido para o backend externo (ainda não implementado lá):
 * GET  /api/company/onboarding -> { status, message, response: { companyId, steps, dismissedAt, updatedAt } }
 * PUT  /api/company/onboarding { dismissedAt } -> mesmo shape
 */
export const GET = createListGetHandler<ApiOnboardingResponse, OnboardingProgress>({
  backendPath: '/api/company/onboarding',
  context: CONTEXT,
  mapResponse: (data) => mapApiOnboarding(data.response),
  buildQueryString: () => '',
});

export const PUT = createUpsertHandler<ApiOnboardingResponse, DismissOnboardingData>({
  backendPath: '/api/company/onboarding',
  method: 'PUT',
  context: CONTEXT,
  mapResponse: (data) => mapApiOnboarding(data.response),
});
