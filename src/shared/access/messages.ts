import type { BillingBlock } from '@/shared/lib/http/apiError';
import { findEntitlement, requiredPlanFor } from './entitlements';
import type { AccessSnapshot } from './types';

/**
 * Textos de bloqueio: dizem o que aconteceu e como resolver, sem pedir desculpas.
 * Ex.: "Seu plano Free permite 3 tanques ativos. Desative um tanque ou faça upgrade para o Starter."
 */

const PLAN_NAMES: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

export function planName(code: string | null | undefined): string {
  if (!code) return 'atual';
  return PLAN_NAMES[code] ?? code.charAt(0).toUpperCase() + code.slice(1);
}

/** "o Starter" quando a API já disse o plano; senão, genérico. */
function upgradeTarget(requiredPlan: string | null): string {
  return requiredPlan ? `o ${planName(requiredPlan)}` : 'um plano superior';
}

type LimitCopy = { noun: string; howToFree: string };

const LIMIT_COPY: Record<string, LimitCopy> = {
  'ponds.included': { noun: 'tanques ativos', howToFree: 'Desative um tanque' },
  'users.max': { noun: 'usuários ativos', howToFree: 'Desative um usuário' },
};

const FEATURE_NAMES: Record<string, string> = {
  'finance.full': 'O financeiro completo',
  'inventory.basic': 'O controle de estoque',
  'reports.export': 'A exportação de relatórios',
  'ai.management_plan': 'O plano de manejo com IA',
};

function featureName(feature: string | null, snapshot?: AccessSnapshot | null): string {
  if (!feature) return 'Este recurso';
  return FEATURE_NAMES[feature] ?? findEntitlement(snapshot, feature)?.label ?? 'Este recurso';
}

export const READ_ONLY_MESSAGES = {
  TRIAL_EXPIRED:
    'O teste gratuito terminou e a empresa está em modo somente leitura. Assine um plano para voltar a registrar dados.',
  SUBSCRIPTION_SUSPENDED:
    'A assinatura foi suspensa por falta de pagamento e a empresa está em modo somente leitura. Regularize as faturas para voltar a registrar dados.',
} as const;

export function readOnlyReason(code: BillingBlock['code'] | string | null): string {
  return code === 'SUBSCRIPTION_SUSPENDED'
    ? READ_ONLY_MESSAGES.SUBSCRIPTION_SUSPENDED
    : READ_ONLY_MESSAGES.TRIAL_EXPIRED;
}

export function limitMessage(
  block: Pick<BillingBlock, 'feature' | 'limit' | 'currentPlan' | 'requiredPlan'>,
): string {
  const copy = block.feature ? LIMIT_COPY[block.feature] : undefined;
  const target = upgradeTarget(block.requiredPlan);
  if (!copy || block.limit === null) {
    return `Você atingiu o limite do plano ${planName(block.currentPlan)}. Faça upgrade para ${target}.`;
  }
  return `Seu plano ${planName(block.currentPlan)} permite ${block.limit} ${copy.noun}. ${copy.howToFree} ou faça upgrade para ${target}.`;
}

export function featureRequiredMessage(
  block: Pick<BillingBlock, 'feature' | 'currentPlan' | 'requiredPlan'>,
  snapshot?: AccessSnapshot | null,
): string {
  const name = featureName(block.feature, snapshot);
  if (!block.requiredPlan) {
    return `${name} não faz parte do plano ${planName(block.currentPlan)}. Disponível em planos superiores.`;
  }
  return `${name} não faz parte do plano ${planName(block.currentPlan)}. Faça upgrade para ${upgradeTarget(block.requiredPlan)} para usar.`;
}

export function quotaMessage(
  block: Pick<BillingBlock, 'feature' | 'limit' | 'requiredPlan' | 'resetsAt'>,
  formatDate: (iso: string) => string,
): string {
  const used = block.limit === null ? 'toda a cota' : `as ${block.limit} gerações da cota`;
  const reset = block.resetsAt
    ? ` A cota renova em ${formatDate(block.resetsAt)}.`
    : ' No seu plano a cota não renova.';
  return `Você usou ${used} deste recurso.${reset} Para gerar mais agora, faça upgrade para ${upgradeTarget(block.requiredPlan)}.`;
}

/**
 * Motivo para desabilitar uma ação de escrita por plano, antes de chamar a API.
 * `null` = liberado. Somente leitura vale para qualquer escrita; feature/limite só
 * quando informados.
 */
export function planBlockReason(
  snapshot: AccessSnapshot | null | undefined,
  feature: string | null,
  companyId: string | null | undefined,
): string | null {
  if (!snapshot) return null;
  if (snapshot.readOnly) {
    return readOnlyReason(
      snapshot.status === 'suspended' ? 'SUBSCRIPTION_SUSPENDED' : 'TRIAL_EXPIRED',
    );
  }
  if (!feature) return null;
  const e = findEntitlement(snapshot, feature);
  if (!e) return null;
  const requiredPlan = requiredPlanFor(companyId, feature);
  if (!e.enabled) {
    return featureRequiredMessage(
      { feature, currentPlan: String(snapshot.plan.code), requiredPlan },
      snapshot,
    );
  }
  if (e.type !== 'boolean' && e.remaining !== null && e.remaining <= 0) {
    if (e.type === 'quota') {
      return quotaMessage({ feature, limit: e.limit, requiredPlan, resetsAt: e.resetsAt }, (iso) =>
        new Date(iso).toLocaleDateString('pt-BR'),
      );
    }
    return limitMessage({
      feature,
      limit: e.limit,
      currentPlan: String(snapshot.plan.code),
      requiredPlan,
    });
  }
  return null;
}

export const ACCESS_MESSAGES = {
  SESSION_ENDED: 'Sua sessão foi encerrada. Entre novamente para continuar.',
  COMPANY_DENIED:
    'Seu acesso a esta empresa está inativo. Troque de empresa ou peça a um administrador para reativar seu usuário.',
  NO_COMPANY: 'Nenhuma empresa ativa na sessão. Escolha a empresa para continuar.',
  FORBIDDEN: 'Você não tem permissão para fazer isso. Peça a um administrador da empresa.',
  ASK_ADMIN: 'Peça a um administrador da empresa para assinar ou trocar de plano.',
} as const;
