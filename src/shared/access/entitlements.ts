import type { AccessSnapshot, Entitlement, EntitlementType } from './types';

/**
 * Funções puras sobre o snapshot de `GET /api/subscription`. O front não decide
 * nada sozinho: só lê o que a API calculou (enabled, limit, used, remaining).
 */

type ApiEntitlement = {
  key?: unknown;
  type?: unknown;
  label?: unknown;
  enabled?: unknown;
  limit?: unknown;
  used?: unknown;
  remaining?: unknown;
  reset_period?: unknown;
  resets_at?: unknown;
};

export type ApiAccessSnapshot = {
  plan?: { code?: unknown; name?: unknown } | null;
  status?: unknown;
  read_only?: unknown;
  trial_ends_at?: unknown;
  days_left_in_trial?: unknown;
  entitlements?: ApiEntitlement[] | null;
};

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);

const ENTITLEMENT_TYPES: ReadonlySet<string> = new Set(['boolean', 'limit', 'quota']);

export function mapAccessSnapshot(data: ApiAccessSnapshot | null | undefined): AccessSnapshot {
  const entitlements: Entitlement[] = (data?.entitlements ?? []).flatMap((e) => {
    const key = str(e?.key);
    if (!key) return [];
    const type = str(e.type);
    return [
      {
        key,
        type: (type && ENTITLEMENT_TYPES.has(type) ? type : 'boolean') as EntitlementType,
        label: str(e.label) ?? key,
        enabled: e.enabled === true,
        limit: num(e.limit),
        used: num(e.used),
        remaining: num(e.remaining),
        resetPeriod: str(e.reset_period),
        resetsAt: str(e.resets_at),
      },
    ];
  });

  return {
    plan: { code: str(data?.plan?.code) ?? 'free', name: str(data?.plan?.name) ?? 'Free' },
    status: str(data?.status) ?? 'expired',
    readOnly: data?.read_only === true,
    trialEndsAt: str(data?.trial_ends_at),
    daysLeftInTrial: num(data?.days_left_in_trial),
    entitlements,
  };
}

export function findEntitlement(snapshot: AccessSnapshot | null | undefined, key: string) {
  return snapshot?.entitlements.find((e) => e.key === key) ?? null;
}

/**
 * A empresa pode usar a feature agora? Para limite e cota, considera o saldo.
 * Sem snapshot (carregando ou erro) devolve `true`: o front não bloqueia por
 * suposição; a API continua sendo a autoridade e responde 402 se for o caso.
 */
export function canUse(snapshot: AccessSnapshot | null | undefined, key: string): boolean {
  if (!snapshot) return true;
  const e = findEntitlement(snapshot, key);
  if (!e) return true;
  if (!e.enabled) return false;
  if (e.type === 'boolean') return true;
  return e.remaining === null || e.remaining > 0;
}

/** Saldo de limite/cota; `null` = ilimitado ou desconhecido. */
export function remainingOf(snapshot: AccessSnapshot | null | undefined, key: string) {
  return findEntitlement(snapshot, key)?.remaining ?? null;
}

export function usageOf(snapshot: AccessSnapshot | null | undefined, key: string) {
  const e = findEntitlement(snapshot, key);
  if (!e || e.limit === null) return null;
  return { used: e.used ?? 0, limit: e.limit, remaining: e.remaining };
}

export function isReadOnly(snapshot: AccessSnapshot | null | undefined): boolean {
  return snapshot?.readOnly === true;
}

/** Dias que disparam o aviso de fim do teste (a API não avisa por e-mail nem notificação). */
export const TRIAL_WARNING_DAYS: readonly number[] = [7, 3, 1];

/**
 * Mostrar "teste termina em N dias"? Só em D-7, D-3 e D-1 (e no último dia, D-0),
 * para o aviso não virar ruído permanente.
 */
export function trialWarningDays(snapshot: AccessSnapshot | null | undefined): number | null {
  if (!snapshot || snapshot.status !== 'trialing' || snapshot.readOnly) return null;
  const days = snapshot.daysLeftInTrial;
  if (days === null) return null;
  if (days === 0 || TRIAL_WARNING_DAYS.includes(days)) return days;
  return null;
}

/* ---------- plano exigido (aprendido dos 402) ---------- */

/**
 * `required_plan` só chega num 402. Guardamos por empresa + feature para que, depois
 * do primeiro bloqueio, a tela já diga "disponível no Starter". Antes disso o texto é
 * genérico ("disponível em planos superiores"); o front nunca deduz o plano sozinho.
 */
const requiredPlans = new Map<string, string>();
const requiredKey = (companyId: string | null | undefined, feature: string) =>
  `${companyId ?? '-'}:${feature}`;

export function rememberRequiredPlan(
  companyId: string | null | undefined,
  feature: string | null | undefined,
  plan: string | null | undefined,
) {
  if (feature && plan) requiredPlans.set(requiredKey(companyId, feature), plan);
}

export function requiredPlanFor(
  companyId: string | null | undefined,
  feature: string,
): string | null {
  return requiredPlans.get(requiredKey(companyId, feature)) ?? null;
}

export function __resetRequiredPlansForTests() {
  requiredPlans.clear();
}
