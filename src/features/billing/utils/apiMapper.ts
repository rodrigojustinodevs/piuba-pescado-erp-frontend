import type {
  ApiEnvelope,
  ApiListEnvelope,
  Invoice,
  InvoiceListResponse,
  Plan,
  PlanFeature,
  Subscription,
} from '../types';
import { featureLabel } from './labels';

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

type RawPlanFeature = {
  key?: string;
  type?: PlanFeature['type'];
  value?: boolean | number | null;
  unlimited?: boolean;
  reset_period?: PlanFeature['resetPeriod'];
  resetPeriod?: PlanFeature['resetPeriod'];
  label?: string | null;
};

type RawPlan = Omit<Plan, 'features'> & { features?: Array<RawPlanFeature | string> | null };

/** Aceita o formato atual (objeto) e o antigo (só o código, como string). */
export function mapPlanFeature(raw: RawPlanFeature | string): PlanFeature {
  if (typeof raw === 'string') {
    return {
      key: raw,
      type: 'boolean',
      value: true,
      unlimited: false,
      resetPeriod: null,
      label: featureLabel(raw),
    };
  }
  const key = raw.key ?? '';
  return {
    key,
    type: raw.type ?? 'boolean',
    value: raw.value ?? false,
    unlimited: raw.unlimited ?? false,
    resetPeriod: raw.resetPeriod ?? raw.reset_period ?? null,
    label: raw.label || featureLabel(key),
  };
}

export function mapPlansEnvelope(data: ApiEnvelope<RawPlan[] | null>): Plan[] {
  return (data.response ?? []).map((plan) => ({
    ...plan,
    features: (plan.features ?? []).map(mapPlanFeature).filter((f) => f.key !== ''),
  }));
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
