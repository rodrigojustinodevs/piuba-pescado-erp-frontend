import { extractHttpStatus } from '@/shared/lib/http/httpError';
import type { PlanTier } from '../types';

export const GATE_CODES = [
  'PLAN_UPGRADE_REQUIRED',
  'SUBSCRIPTION_SUSPENDED',
  'SUBSCRIPTION_PENDING',
] as const;

export type GateCode = (typeof GATE_CODES)[number];

export type GateError = {
  code: GateCode;
  feature: string | null;
  currentTier: PlanTier | null;
  requiredTier: PlanTier | null;
  message: string | null;
};

const GATE_CODE_SET: ReadonlySet<string> = new Set(GATE_CODES);

function str(value: unknown): string | null {
  return typeof value === 'string' && value ? value : null;
}

/**
 * Reconhece o 403 de feature gating. Um 403 sem `code` conhecido é falta de
 * permissão do papel e devolve `null` (segue o tratamento normal de 403).
 */
export function parseGateError(error: unknown): GateError | null {
  if (extractHttpStatus(error) !== 403) return null;
  const e = error as { code?: unknown; details?: Record<string, unknown>; message?: unknown };
  if (typeof e.code !== 'string' || !GATE_CODE_SET.has(e.code)) return null;
  const details = e.details ?? {};
  return {
    code: e.code as GateCode,
    feature: str(details.feature),
    currentTier: str(details.currentTier) as PlanTier | null,
    requiredTier: str(details.requiredTier) as PlanTier | null,
    message: str(e.message),
  };
}

export function isGateError(error: unknown): boolean {
  return parseGateError(error) !== null;
}
