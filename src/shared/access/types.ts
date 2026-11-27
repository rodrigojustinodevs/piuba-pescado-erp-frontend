/** Tipos do estado de plano vindo de `GET /api/subscription` (qualquer membro da empresa). */

export type PlanCode = 'free' | 'starter' | 'professional' | 'enterprise';

/** Status da assinatura vigente (`SubscriptionStatus` da API). */
export type AccessStatus =
  | 'trialing'
  | 'pending'
  | 'active'
  | 'overdue'
  | 'suspended'
  | 'expired'
  | 'canceled';

export type EntitlementType = 'boolean' | 'limit' | 'quota';

export type Entitlement = {
  key: string;
  type: EntitlementType;
  label: string;
  enabled: boolean;
  limit: number | null;
  used: number | null;
  remaining: number | null;
  resetPeriod: string | null;
  resetsAt: string | null;
};

export type AccessSnapshot = {
  plan: { code: PlanCode | string; name: string };
  status: AccessStatus | string;
  readOnly: boolean;
  trialEndsAt: string | null;
  daysLeftInTrial: number | null;
  entitlements: Entitlement[];
};

/** Chaves de feature usadas pelo front (catálogo `BillingCatalogSeeder`). */
export const FeatureKey = {
  PONDS: 'ponds.included',
  USERS: 'users.max',
  FINANCE: 'finance.full',
  INVENTORY: 'inventory.basic',
  REPORTS_EXPORT: 'reports.export',
  AI_MANAGEMENT_PLAN: 'ai.management_plan',
  HISTORY_MONTHS: 'history.months',
} as const;

export type FeatureKeyType = (typeof FeatureKey)[keyof typeof FeatureKey] | (string & {});
