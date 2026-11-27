import type { QueryClient } from '@tanstack/react-query';
import { classifyApiError } from '@/shared/lib/http/apiError';
import { accessEvents } from './accessEvents';
import { rememberRequiredPlan } from './entitlements';
import { readOnlyReason } from './messages';

/** Chave do estado de plano (por empresa): invalidada a cada 402 e a cada ação de billing. */
export const accessKeys = {
  all: ['access'] as const,
  subscription: (companyId: string | null | undefined) =>
    ['access', companyId ?? 'none', 'subscription'] as const,
};

type Origin = { queryKey?: readonly unknown[]; isMutation: boolean };

/** Leituras de rotas de billing nunca são bloqueadas por plano; o modal não deve abrir por elas. */
function isBillingOrigin(key: readonly unknown[] | undefined) {
  return key?.[0] === 'billing';
}

function companyIdFromCache(client: QueryClient): string | null {
  const auth = client.getQueryData<{ user?: { companyId?: string | null } }>(['auth', 'check']);
  return auth?.user?.companyId ?? null;
}

/**
 * Tratamento central por status/código (tabela do contrato da API). As telas não
 * tratam 401/402/403/409; 422 fica com a tela (erro no campo ou `message`).
 */
export function handleApiError(client: QueryClient, error: unknown, origin: Origin) {
  const result = classifyApiError(error);
  const companyId = companyIdFromCache(client);
  const refreshPlan = () =>
    client.invalidateQueries({ queryKey: accessKeys.all, refetchType: 'active' });

  switch (result.kind) {
    case 'session':
      // O BFF já tentou o refresh (com fila); 401 aqui é sessão encerrada.
      accessEvents.notify({ type: 'sessionEnded' });
      return;
    case 'noCompany':
      accessEvents.openCompanySelector();
      return;
    case 'companyDenied':
      accessEvents.setCompanyDenied(true);
      return;
    case 'forbidden':
      // Só mutações viram toast: uma leitura negada já cai no estado de erro da tela.
      if (origin.isMutation) accessEvents.notify({ type: 'forbidden', message: result.message });
      return;
    case 'readOnly':
      refreshPlan();
      if (origin.isMutation) {
        accessEvents.notify({ type: 'readOnly', message: readOnlyReason(result.block.code) });
      }
      return;
    case 'featureRequired':
    case 'limitReached':
    case 'quotaExhausted':
      rememberRequiredPlan(companyId, result.block.feature, result.block.requiredPlan);
      refreshPlan();
      if (!isBillingOrigin(origin.queryKey)) {
        accessEvents.showPlanDialog({ kind: result.kind, block: result.block });
      }
      return;
    case 'conflict':
      refreshPlan();
      client.invalidateQueries({ queryKey: ['billing'] });
      if (origin.isMutation && result.message) {
        accessEvents.notify({ type: 'conflict', message: result.message });
      }
      return;
    default:
      return;
  }
}
