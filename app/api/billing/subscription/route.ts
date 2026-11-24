import type { ApiEnvelope, Subscription } from '@/features/billing/types';
import { mapSubscriptionEnvelope } from '@/features/billing/utils/apiMapper';
import { createJsonMutationHandler, createListGetHandler } from '@/shared/lib/api/routeFactories';

type ApiSubscription = ApiEnvelope<Partial<Subscription> | null>;
const BACKEND_PATH = '/api/billing/subscription';

/** Corpo do PATCH: só as chaves aceitas (nunca `company_id`). */
function pickChangeBody(payload: unknown) {
  const body = (payload ?? {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of ['plan_tier', 'billing_cycle', 'payment_method']) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}

export const GET = createListGetHandler<ApiSubscription, Subscription>({
  backendPath: BACKEND_PATH,
  context: 'Billing Subscription API Proxy',
  buildQueryString: () => '',
  mapResponse: mapSubscriptionEnvelope,
});

export const PATCH = createJsonMutationHandler<ApiSubscription>({
  backendPath: BACKEND_PATH,
  method: 'PATCH',
  context: 'Billing Change Subscription API Proxy',
  mapBody: pickChangeBody,
  mapResponse: mapSubscriptionEnvelope,
});

export const DELETE = createJsonMutationHandler<ApiSubscription>({
  backendPath: BACKEND_PATH,
  method: 'DELETE',
  context: 'Billing Cancel Subscription API Proxy',
  mapBody: () => undefined,
  mapResponse: mapSubscriptionEnvelope,
});
