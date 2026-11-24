import type { ApiEnvelope, Subscription } from '@/features/billing/types';
import { mapSubscriptionEnvelope } from '@/features/billing/utils/apiMapper';
import { createJsonMutationHandler } from '@/shared/lib/api/routeFactories';

/** Corpo do POST: só as chaves aceitas (nunca `company_id`). */
function pickSubscribeBody(payload: unknown) {
  const body = (payload ?? {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {
    plan_tier: body.plan_tier,
    billing_cycle: body.billing_cycle,
    payment_method: body.payment_method,
  };
  if (typeof body.document === 'string' && body.document.trim()) out.document = body.document;
  return out;
}

export const POST = createJsonMutationHandler<ApiEnvelope<Partial<Subscription> | null>>({
  backendPath: '/api/billing/subscriptions',
  method: 'POST',
  context: 'Billing Subscribe API Proxy',
  successStatus: 201,
  mapBody: pickSubscribeBody,
  mapResponse: mapSubscriptionEnvelope,
});
