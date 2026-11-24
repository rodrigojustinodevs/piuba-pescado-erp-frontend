import type { BillingCycle, PaymentMethod, PlanTier, Subscription } from '../types';
import { CYCLE_LABELS, PAYMENT_METHOD_LABELS, tierLabel, tierRank } from './labels';

export type ChangeTarget = {
  planTier?: PlanTier;
  billingCycle?: BillingCycle;
  paymentMethod?: PaymentMethod;
};

export type ChangePreviewKind =
  | 'upgrade'
  | 'downgrade'
  | 'cycle_change'
  | 'payment_method'
  | 'cancel'
  | 'none';

export type ChangePreview = {
  kind: ChangePreviewKind;
  title: string;
  /** Avisos que precisam aparecer antes do usuário confirmar. */
  warnings: string[];
  confirmLabel: string;
  requiresConfirmation: boolean;
  /** Ação destrutiva/irreversível (botão em vermelho). */
  destructive: boolean;
};

type Format = (value: string | null) => string;

/**
 * Classifica a troca pedida *antes* do PATCH, só para escolher o aviso certo.
 * Não calcula valores: o proporcional real vem em `change.proration` da API.
 */
export function previewChange(
  sub: Subscription,
  target: ChangeTarget,
  formatDate: Format,
): ChangePreview {
  const tier = target.planTier ?? sub.planTier;
  const cycle = target.billingCycle ?? sub.billingCycle;
  const method = target.paymentMethod ?? sub.paymentMethod;
  const periodEnd = formatDate(sub.currentPeriodEnd);

  if (tier === 'free' && sub.planTier !== 'free') {
    return previewCancel(sub, formatDate);
  }

  if (tierRank(tier) > tierRank(sub.planTier)) {
    return {
      kind: 'upgrade',
      title: `Mudar para o plano ${tierLabel(tier)}`,
      warnings: [
        'A mudança vale imediatamente.',
        'Será gerada uma cobrança proporcional aos dias restantes do período atual.',
      ],
      confirmLabel: 'Confirmar upgrade',
      requiresConfirmation: true,
      destructive: false,
    };
  }

  if (tierRank(tier) < tierRank(sub.planTier)) {
    return {
      kind: 'downgrade',
      title: `Mudar para o plano ${tierLabel(tier)}`,
      warnings: [
        `A mudança vale em ${periodEnd}, no fim do período já pago.`,
        'Até lá você continua com o plano atual. Não há reembolso do período em curso.',
      ],
      confirmLabel: 'Agendar mudança',
      requiresConfirmation: true,
      destructive: false,
    };
  }

  if (cycle && cycle !== sub.billingCycle) {
    return {
      kind: 'cycle_change',
      title: `Mudar a cobrança para ${CYCLE_LABELS[cycle].toLowerCase()}`,
      warnings: [
        `A mudança vale em ${periodEnd}, no fim do período já pago.`,
        'Não há reembolso do período em curso.',
      ],
      confirmLabel: 'Agendar mudança',
      requiresConfirmation: true,
      destructive: false,
    };
  }

  if (method && method !== sub.paymentMethod) {
    return {
      kind: 'payment_method',
      title: `Mudar a forma de pagamento para ${PAYMENT_METHOD_LABELS[method]}`,
      warnings: ['Vale a partir da próxima cobrança.'],
      confirmLabel: 'Mudar forma de pagamento',
      requiresConfirmation: true,
      destructive: false,
    };
  }

  return {
    kind: 'none',
    title: 'Nada para mudar',
    warnings: [],
    confirmLabel: 'Confirmar',
    requiresConfirmation: false,
    destructive: false,
  };
}

/** Aviso do cancelamento, com a data em que o acesso termina. */
export function previewCancel(sub: Subscription, formatDate: Format): ChangePreview {
  const neverPaid = sub.status === 'pending';
  return {
    kind: 'cancel',
    title: 'Cancelar assinatura',
    warnings: neverPaid
      ? ['A assinatura ainda não foi paga e será cancelada imediatamente.']
      : [
          `Você continua com acesso até ${formatDate(sub.currentPeriodEnd)}.`,
          'Depois dessa data o plano volta para o gratuito. Não há reembolso do período em curso.',
        ],
    confirmLabel: 'Cancelar assinatura',
    requiresConfirmation: true,
    destructive: true,
  };
}
