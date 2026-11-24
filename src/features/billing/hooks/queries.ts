'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { extractHttpStatus } from '@/shared/lib/http/httpError';
import { billingService } from '../services/billingService';
import type {
  ChangeSubscriptionPayload,
  Invoice,
  InvoiceListParams,
  SubscribePayload,
  Subscription,
} from '../types';
import { canManageBilling } from '../utils/permissions';

/** 4xx não se resolve tentando de novo (403 de papel, 404, 429). */
const noRetryOn4xx = (count: number, error: unknown) => {
  const status = extractHttpStatus(error);
  if (status !== null && status >= 400 && status < 500) return false;
  return count < 2;
};

/** Chaves sob `billing` e por empresa: trocar de empresa nunca reaproveita a anterior. */
export function useBillingScope() {
  const { user } = useAuthContext();
  return {
    scope: user?.companyId ?? 'none',
    canManage: canManageBilling(user?.role) && Boolean(user?.companyId),
  };
}

export const billingKeys = {
  all: ['billing'] as const,
  plans: () => ['billing', 'plans'] as const,
  subscription: (scope: string) => ['billing', scope, 'subscription'] as const,
  invoices: (scope: string, params?: InvoiceListParams) =>
    params
      ? (['billing', scope, 'invoices', params] as const)
      : (['billing', scope, 'invoices'] as const),
};

export function usePlans() {
  return useQuery({
    queryKey: billingKeys.plans(),
    queryFn: billingService.getPlans,
    staleTime: 1000 * 60 * 30,
    retry: noRetryOn4xx,
  });
}

type SubscriptionQueryOptions = {
  enabled?: boolean;
  refetchInterval?: number | false | ((data: Subscription | undefined) => number | false);
};

export function useSubscription({
  enabled = true,
  refetchInterval,
}: SubscriptionQueryOptions = {}) {
  const { scope, canManage } = useBillingScope();
  return useQuery({
    queryKey: billingKeys.subscription(scope),
    queryFn: billingService.getSubscription,
    enabled: enabled && canManage,
    staleTime: 1000 * 60,
    retry: noRetryOn4xx,
    refetchInterval:
      typeof refetchInterval === 'function'
        ? (query) => refetchInterval(query.state.data)
        : refetchInterval,
  });
}

export function useInvoices(params: InvoiceListParams, enabled = true) {
  const { scope, canManage } = useBillingScope();
  return useQuery({
    queryKey: billingKeys.invoices(scope, params),
    queryFn: () => billingService.getInvoices(params),
    enabled: enabled && canManage,
    retry: noRetryOn4xx,
    placeholderData: keepPreviousData,
  });
}

/** Fatura vencida mais antiga, para o "Pagar agora" do banner de atraso. */
export function useOldestOverdueInvoice(enabled: boolean) {
  const query = useInvoices({ status: 'overdue', perPage: 100 }, enabled);
  const oldest = (query.data?.items ?? []).reduce<Invoice | null>(
    (acc, inv) => (!acc || (inv.dueDate ?? '') < (acc.dueDate ?? '') ? inv : acc),
    null,
  );
  return { ...query, oldest };
}

/** Grava a assinatura devolvida pela escrita e invalida as faturas. */
function useApplySubscription() {
  const queryClient = useQueryClient();
  const { scope } = useBillingScope();
  return useCallback(
    (sub: Subscription) => {
      queryClient.setQueryData(billingKeys.subscription(scope), sub);
      queryClient.invalidateQueries({ queryKey: billingKeys.invoices(scope) });
    },
    [queryClient, scope],
  );
}

export function useSubscribe() {
  const apply = useApplySubscription();
  return useMutation({
    mutationKey: ['billing', 'subscribe'],
    mutationFn: (payload: SubscribePayload) => billingService.subscribe(payload),
    onSuccess: apply,
    retry: 0,
  });
}

export function useChangeSubscription() {
  const apply = useApplySubscription();
  return useMutation({
    mutationKey: ['billing', 'change'],
    mutationFn: (payload: ChangeSubscriptionPayload) => billingService.changeSubscription(payload),
    onSuccess: apply,
    retry: 0,
  });
}

export function useCancelSubscription() {
  const apply = useApplySubscription();
  return useMutation({
    mutationKey: ['billing', 'cancel'],
    mutationFn: billingService.cancelSubscription,
    onSuccess: apply,
    retry: 0,
  });
}
