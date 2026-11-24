import type {
  ApiEnvelope,
  ApiListEnvelope,
  Invoice,
  InvoiceListResponse,
  Plan,
  Subscription,
} from '../types';

/**
 * A API já devolve camelCase; o mapper só garante os valores padrão (null/false)
 * para o front não precisar testar `undefined` em todo lugar. Não deriva status.
 */
export function mapSubscription(raw: Partial<Subscription> | null | undefined): Subscription {
  const s = raw ?? {};
  return {
    id: s.id ?? null,
    planTier: s.planTier ?? 'free',
    billingCycle: s.billingCycle ?? null,
    paymentMethod: s.paymentMethod ?? null,
    status: s.status ?? null,
    hasAccess: s.hasAccess ?? true,
    currentPeriodStart: s.currentPeriodStart ?? null,
    currentPeriodEnd: s.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: s.cancelAtPeriodEnd ?? false,
    canceledAt: s.canceledAt ?? null,
    overdueSince: s.overdueSince ?? null,
    gracePeriodEndsAt: s.gracePeriodEndsAt ?? null,
    nfseEnabled: s.nfseEnabled ?? false,
    pendingChange: s.pendingChange ?? null,
    payment: s.payment ?? null,
    change: s.change ?? null,
  };
}

export function mapSubscriptionEnvelope(data: ApiEnvelope<Partial<Subscription> | null>) {
  return mapSubscription(data.response);
}

export function mapPlansEnvelope(data: ApiEnvelope<Plan[] | null>): Plan[] {
  return data.response ?? [];
}

export function mapInvoiceListEnvelope(data: ApiListEnvelope<Invoice>): InvoiceListResponse {
  const p = data.pagination ?? {};
  return {
    items: data.response ?? [],
    total: p.total ?? 0,
    page: p.current_page ?? 1,
    limit: p.per_page ?? 25,
    lastPage: p.last_page ?? 1,
  };
}
