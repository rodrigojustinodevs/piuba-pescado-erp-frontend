import type {
  BillingCycle,
  InvoiceKind,
  InvoiceStatus,
  PaymentMethod,
  PlanTier,
  SubscriptionStatus,
} from '../types';

export const TIER_ORDER: readonly PlanTier[] = ['free', 'starter', 'professional', 'enterprise'];

export const TIER_LABELS: Record<PlanTier, string> = {
  free: 'Gratuito',
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

export const CYCLE_LABELS: Record<BillingCycle, string> = { monthly: 'Mensal', yearly: 'Anual' };
export const CYCLE_UNIT: Record<BillingCycle, string> = { monthly: '/mês', yearly: '/ano' };

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  boleto: 'Boleto',
  pix: 'Pix',
  credit_card: 'Cartão de crédito',
  pix_automatic: 'Pix Automático',
};

export const PAYMENT_METHOD_HINTS: Record<PaymentMethod, string> = {
  boleto: 'Você recebe o boleto a cada ciclo. Compensa em até 3 dias úteis.',
  pix: 'Você recebe um Pix a cada ciclo. Confirmação em instantes.',
  credit_card: 'Cobrança automática no cartão. Os dados são digitados na página segura do Asaas.',
  pix_automatic: 'Autorize uma vez no app do banco e as cobranças são debitadas automaticamente.',
};

export const PAYMENT_METHODS: readonly PaymentMethod[] = [
  'pix_automatic',
  'pix',
  'boleto',
  'credit_card',
];

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  pending: 'Aguardando pagamento',
  active: 'Ativa',
  overdue: 'Pagamento em atraso',
  suspended: 'Suspensa',
  canceled: 'Cancelada',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  pending: 'Em aberto',
  overdue: 'Vencida',
  paid: 'Paga',
  refunded: 'Estornada',
  canceled: 'Cancelada',
};

export const INVOICE_STATUSES: readonly InvoiceStatus[] = [
  'pending',
  'overdue',
  'paid',
  'refunded',
  'canceled',
];

export const INVOICE_KIND_LABELS: Record<InvoiceKind, string> = {
  cycle: 'Mensalidade',
  proration: 'Proporcional',
};

/**
 * Só rótulos de exibição: quais funcionalidades cada plano tem vem sempre de
 * `GET /billing/plans`. Código desconhecido aparece legível em vez de sumir.
 */
const FEATURE_LABELS: Record<string, string> = {
  ai_management_plan: 'Plano de manejo gerado por IA',
};

export function featureLabel(code: string): string {
  if (FEATURE_LABELS[code]) return FEATURE_LABELS[code];
  const text = code.replaceAll('_', ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function tierLabel(tier: string | null | undefined): string {
  if (!tier) return '—';
  return TIER_LABELS[tier as PlanTier] ?? tier;
}

export function tierRank(tier: PlanTier): number {
  return TIER_ORDER.indexOf(tier);
}
