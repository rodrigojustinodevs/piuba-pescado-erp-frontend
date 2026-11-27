'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import {
  canUse,
  isReadOnly as snapshotIsReadOnly,
  remainingOf,
  requiredPlanFor as rememberedRequiredPlan,
  usageOf,
} from './entitlements';
import { accessKeys } from './handleApiError';
import { planBlockReason } from './messages';
import type { AccessSnapshot } from './types';

/** Snapshot cru (para quem só precisa do status). */
export function useAccessSnapshot() {
  const { user, isAuthenticated } = useAuthContext();
  const companyId = user?.companyId ?? null;
  return useQuery({
    queryKey: accessKeys.subscription(companyId),
    queryFn: () => browserHttpClient.get<AccessSnapshot>('/api/subscription'),
    enabled: isAuthenticated && Boolean(companyId),
    staleTime: 1000 * 60,
    // Suspensão e fim do teste mudam sem ação do usuário: revalida ao voltar para a aba.
    refetchOnWindowFocus: true,
  });
}

/**
 * Fonte única de "o que o plano da empresa permite agora". Claims `plan`/`sub_status`
 * do JWT são só dica e não entram aqui. Enquanto carrega, nada é bloqueado.
 */
export function useEntitlements() {
  const { user } = useAuthContext();
  const companyId = user?.companyId ?? null;
  const query = useAccessSnapshot();
  const snapshot = query.data ?? null;

  const can = useCallback((key: string) => canUse(snapshot, key), [snapshot]);
  const remaining = useCallback((key: string) => remainingOf(snapshot, key), [snapshot]);
  const usage = useCallback((key: string) => usageOf(snapshot, key), [snapshot]);
  const requiredPlanFor = useCallback(
    (key: string) => rememberedRequiredPlan(companyId, key),
    [companyId],
  );
  /** Motivo para desabilitar uma escrita (somente leitura ou feature/limite); `null` = liberado. */
  const blockReason = useCallback(
    (feature: string | null = null) => planBlockReason(snapshot, feature, companyId),
    [snapshot, companyId],
  );

  return useMemo(
    () => ({
      snapshot,
      isLoading: query.isLoading,
      isReadOnly: snapshotIsReadOnly(snapshot),
      can,
      remaining,
      usage,
      requiredPlanFor,
      blockReason,
    }),
    [snapshot, query.isLoading, can, remaining, usage, requiredPlanFor, blockReason],
  );
}
