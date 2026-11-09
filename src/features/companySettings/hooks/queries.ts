'use client';

import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { errorStatus } from '../utils/errors';
import { type AuditLogQuery, companySettingsService } from '../services/companySettingsService';
import type { NotificationPreference, SecuritySettings } from '../types';

const noRetryOn4xx = (count: number, error: unknown) => {
  const status = errorStatus(error);
  if (status !== null && status >= 400 && status < 500) return false;
  return count < 2;
};

/** Escopo por empresa: trocar de empresa nunca reaproveita dados da anterior. */
function useCompanyScope() {
  const { user } = useAuthContext();
  return user?.companyId ?? 'none';
}

export function useNotificationsQuery(enabled: boolean) {
  const scope = useCompanyScope();
  return useQuery({
    queryKey: ['company-settings-notifications', scope],
    queryFn: companySettingsService.getNotifications,
    enabled,
    retry: noRetryOn4xx,
  });
}

export function useSecurityQuery(enabled: boolean) {
  const scope = useCompanyScope();
  return useQuery({
    queryKey: ['company-settings-security', scope],
    queryFn: companySettingsService.getSecurity,
    enabled,
    retry: noRetryOn4xx,
  });
}

export function useDataOverviewQuery(enabled: boolean) {
  const scope = useCompanyScope();
  return useQuery({
    queryKey: ['company-settings-data', scope],
    queryFn: companySettingsService.getDataOverview,
    enabled,
    retry: noRetryOn4xx,
  });
}

export function useAuditLogsQuery(params: AuditLogQuery, enabled: boolean) {
  const scope = useCompanyScope();
  return useQuery({
    queryKey: ['company-settings-audit', scope, params],
    queryFn: () => companySettingsService.getAuditLogs(params),
    enabled,
    retry: noRetryOn4xx,
    placeholderData: keepPreviousData,
  });
}

/** Setters do cache para substituir o estado local pela resposta do PUT. */
export function useSettingsCache() {
  const queryClient = useQueryClient();
  const scope = useCompanyScope();

  const setNotifications = useCallback(
    (data: NotificationPreference[]) =>
      queryClient.setQueryData(['company-settings-notifications', scope], data),
    [queryClient, scope],
  );

  const setSecurity = useCallback(
    (data: SecuritySettings) =>
      queryClient.setQueryData(['company-settings-security', scope], data),
    [queryClient, scope],
  );

  return { setNotifications, setSecurity };
}
