import { formatCalendarDatePtBR } from '@/shared/utils/dateFormat';
import { formatCurrency } from '@/shared/utils/numberFormat';
import type { BillingCycle, Plan, PlanFeature } from '../types';

/** dd/MM/yyyy; aceita `YYYY-MM-DD` e ISO 8601. */
export const formatDate = (value: string | null | undefined) => formatCalendarDatePtBR(value);

export const formatBRL = (reais: number) => formatCurrency(reais);

/** Centavos inteiros da API em BRL (só conversão de unidade). */
export const formatCents = (cents: number) => formatCurrency(cents / 100);

export function planPrice(plan: Plan | undefined, cycle: BillingCycle | null) {
  if (!plan || !cycle) return null;
  const price = plan.prices[cycle];
  return price?.available && price.amount !== null ? price.amount : null;
}

/** Ciclos com preço em pelo menos um plano pago. */
export function availableCycles(plans: Plan[]): BillingCycle[] {
  return (['monthly', 'yearly'] as const).filter((cycle) =>
    plans.some((p) => p.paid && p.prices[cycle]?.available),
  );
}

/** Todas as funcionalidades do catálogo (uma por `key`), na ordem em que aparecem. */
export function allFeatures(plans: Plan[]): PlanFeature[] {
  const byKey = new Map<string, PlanFeature>();
  for (const feature of plans.flatMap((p) => p.features)) {
    if (!byKey.has(feature.key)) byKey.set(feature.key, feature);
  }
  return [...byKey.values()];
}

/** O plano libera a funcionalidade: boolean ligado, ou limite/cota maior que zero. */
export function isFeatureIncluded(feature: PlanFeature | undefined): boolean {
  if (!feature) return false;
  if (feature.unlimited) return true;
  if (typeof feature.value === 'boolean') return feature.value;
  return feature.value > 0;
}

const RESET_SUFFIX: Record<string, string> = { month: '/mês' };

/** Quantidade de um limite/cota ("10/mês", "Ilimitado"); null para boolean. */
export function featureAmount(feature: PlanFeature): string | null {
  if (feature.type === 'boolean') return null;
  if (feature.unlimited) return 'Ilimitado';
  const suffix = feature.resetPeriod ? (RESET_SUFFIX[feature.resetPeriod] ?? '') : '';
  return `${Number(feature.value).toLocaleString('pt-BR')}${suffix}`;
}
