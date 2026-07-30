import { createPutHandler } from '@/shared/lib/api/routeFactories';
import { mapApiOnboarding } from '@/features/onboarding/utils/apiMapper';
import type { ApiOnboardingResponse, UpdateOnboardingStepData } from '@/features/onboarding/types';

/**
 * Contrato assumido para o backend externo (ainda não implementado lá):
 * PUT /api/company/onboarding/steps/:step { status: 'completed' | 'skipped' } -> mesmo shape do progresso
 */
export const PUT = createPutHandler<
  ApiOnboardingResponse,
  UpdateOnboardingStepData,
  { step: string }
>({
  backendPathBuilder: (params) => `/api/company/onboarding/steps/${params.step}`,
  context: 'Onboarding Step API Proxy',
  mapResponse: (data) => mapApiOnboarding(data.response),
});
