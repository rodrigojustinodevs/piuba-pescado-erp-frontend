import type { Subscription } from '../types';
import { SUBSCRIPTION_STATUS_LABELS } from './labels';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type BannerKind = 'none' | 'overdue' | 'suspended';

export type PrimaryAction =
  | { kind: 'pay'; url: string }
  | { kind: 'pay_oldest_overdue' }
  | { kind: 'invoices' }
  | { kind: 'subscribe' }
  | null;

export type SubscriptionView = {
  /** Texto do badge (nunca só cor). */
  label: string;
  tone: StatusTone;
  banner: BannerKind;
  headline: string;
  description: string | null;
  primaryAction: PrimaryAction;
  /** O tenant está no gratuito (sem assinatura ou cancelada). */
  isFree: boolean;
  /** Pode trocar plano/ciclo/forma de pagamento (a API só permite com `active`). */
  canChange: boolean;
  /** Pode cancelar (há assinatura e o cancelamento ainda não foi agendado). */
  canCancel: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Dias inteiros restantes até `until` (0 = hoje/expirado). Apenas exibição. */
export function daysUntil(until: string | null, now: Date = new Date()): number | null {
  if (!until) return null;
  const end = /^\d{4}-\d{2}-\d{2}$/.test(until) ? new Date(`${until}T23:59:59`) : new Date(until);
  if (Number.isNaN(end.getTime())) return null;
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / DAY_MS));
}

function graceText(days: number | null): string {
  if (days === null) return 'O acesso continua por enquanto.';
  if (days === 0) return 'O acesso termina hoje.';
  return days === 1 ? 'O acesso termina em 1 dia.' : `O acesso termina em ${days} dias.`;
}

/**
 * Mapeia a assinatura devolvida pela API para o que a UI mostra. Não decide acesso
 * (isso é `hasAccess`) nem recalcula status: só traduz o que veio.
 */
export function getSubscriptionView(
  sub: Subscription,
  formatDate: (value: string | null) => string,
  now: Date = new Date(),
): SubscriptionView {
  const base = { isFree: false, canChange: false, canCancel: false };

  switch (sub.status) {
    case null:
      return {
        ...base,
        label: 'Plano gratuito',
        tone: 'neutral',
        banner: 'none',
        headline: 'Você está no plano gratuito',
        description: 'Contrate um plano para liberar mais funcionalidades.',
        primaryAction: { kind: 'subscribe' },
        isFree: true,
      };
    case 'pending':
      return {
        ...base,
        label: SUBSCRIPTION_STATUS_LABELS.pending,
        tone: 'info',
        banner: 'none',
        headline: 'Aguardando o primeiro pagamento',
        description:
          'A assinatura é ativada assim que o pagamento for confirmado. Isso pode levar alguns minutos.',
        primaryAction: sub.payment?.url ? { kind: 'pay', url: sub.payment.url } : null,
        canCancel: true,
      };
    case 'active':
      if (sub.cancelAtPeriodEnd) {
        return {
          ...base,
          label: 'Cancelamento agendado',
          tone: 'warning',
          banner: 'none',
          headline: `Cancelada: acesso até ${formatDate(sub.currentPeriodEnd)}`,
          description:
            'Depois dessa data o plano volta para o gratuito. Para continuar, contrate de novo após o fim do período.',
          primaryAction: null,
        };
      }
      return {
        ...base,
        label: SUBSCRIPTION_STATUS_LABELS.active,
        tone: 'success',
        banner: 'none',
        headline: 'Assinatura ativa',
        description: null,
        primaryAction: null,
        canChange: true,
        canCancel: true,
      };
    case 'overdue':
      return {
        ...base,
        label: SUBSCRIPTION_STATUS_LABELS.overdue,
        tone: 'warning',
        banner: 'overdue',
        headline: 'Pagamento em atraso',
        description: `Regularize até ${formatDate(sub.gracePeriodEndsAt)}. ${graceText(
          daysUntil(sub.gracePeriodEndsAt, now),
        )}`,
        primaryAction: { kind: 'pay_oldest_overdue' },
        canCancel: !sub.cancelAtPeriodEnd,
      };
    case 'suspended':
      return {
        ...base,
        label: SUBSCRIPTION_STATUS_LABELS.suspended,
        tone: 'danger',
        banner: 'suspended',
        headline: 'Assinatura suspensa',
        description:
          'As funcionalidades pagas estão bloqueadas. Pague as faturas em aberto para liberar o acesso.',
        primaryAction: { kind: 'invoices' },
        canCancel: !sub.cancelAtPeriodEnd,
      };
    case 'canceled':
      return {
        ...base,
        label: SUBSCRIPTION_STATUS_LABELS.canceled,
        tone: 'neutral',
        banner: 'none',
        headline: 'Assinatura cancelada',
        description: 'Contrate um novo plano quando quiser voltar.',
        primaryAction: { kind: 'subscribe' },
        isFree: true,
      };
    default:
      return {
        ...base,
        label: String(sub.status),
        tone: 'neutral',
        banner: 'none',
        headline: 'Status da assinatura',
        description: null,
        primaryAction: null,
      };
  }
}
