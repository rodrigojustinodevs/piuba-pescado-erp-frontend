import { formatCalendarDatePtBR } from '@/shared/utils/dateFormat';
import { formatCurrency } from '@/shared/utils/numberFormat';
import type { BillingCycle, Plan } from '../types';

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

/** Todas as funcionalidades do catálogo, na ordem em que aparecem. */
export function allFeatures(plans: Plan[]): string[] {
  return [...new Set(plans.flatMap((p) => p.features))];
}
