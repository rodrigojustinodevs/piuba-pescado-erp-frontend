'use client';

import { createContext, use, useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { extractHttpStatus } from '@/shared/lib/http/httpError';
import type { CompanySettings, Theme } from '@/shared/types/companySettings';
import { UserRole } from '@/shared/types/auth';
import {
  type FormatSettings,
  formatDateTimeWith,
  formatDateWith,
  formatMoneyWith,
  formatNumberWith,
  formatTemperatureWith,
  formatVolumeWith,
  formatWeightWith,
  toFormatSettings,
} from '@/shared/utils/companyFormat';
import { temperatureToCelsius, volumeToL, weightToKg } from '@/shared/utils/units';

export const COMPANY_SETTINGS_QUERY_KEY = 'company-settings';

export function companySettingsQueryKey(companyId: string | null | undefined) {
  return [COMPANY_SETTINGS_QUERY_KEY, companyId ?? 'none'] as const;
}

export function fetchCompanySettings(): Promise<CompanySettings> {
  return browserHttpClient.get<CompanySettings>('/api/company/settings');
}

type Nullable = number | null | undefined;

type CompanySettingsContextValue = {
  settings: CompanySettings | undefined;
  isLoading: boolean;
  /** Erro da última leitura (ex.: 403 de guest, 422 de master sem empresa). */
  error: unknown;
  /** Recarrega do backend (usar após trocar de empresa). */
  reload: () => Promise<void>;
  /** Substitui o estado global pela resposta de um PUT de configurações. */
  replace: (next: CompanySettings) => void;
  format: FormatSettings;
  formatNumber: (value: Nullable, digits?: number) => string;
  formatMoney: (value: Nullable) => string;
  formatDate: (value: string | null | undefined) => string;
  formatDateTime: (value: string | null | undefined) => string;
  formatWeight: (kg: Nullable, digits?: number) => string;
  formatVolume: (liters: Nullable, digits?: number) => string;
  formatTemperature: (celsius: Nullable) => string;
  /** Valor digitado na unidade da empresa → unidade de armazenamento da API. */
  toStorageWeight: (value: number) => number;
  toStorageVolume: (value: number) => number;
  toStorageTemperature: (value: number) => number;
};

const CompanySettingsContext = createContext<CompanySettingsContextValue | null>(null);

const darkQuery = '(prefers-color-scheme: dark)';

function subscribeColorScheme(onChange: () => void) {
  const media = globalThis.matchMedia?.(darkQuery);
  media?.addEventListener('change', onChange);
  return () => media?.removeEventListener('change', onChange);
}

const getPrefersDark = () => globalThis.matchMedia?.(darkQuery).matches ?? false;
const getPrefersDarkServer = () => false;

/** Cor de texto legível sobre a cor principal (#RRGGBB). */
function readableForeground(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#0F172A' : '#FFFFFF';
}

const PRIMARY_VARS = ['--primary', '--ring', '--sidebar-primary', '--sidebar-ring', '--chart-1'];
const FOREGROUND_VARS = ['--primary-foreground', '--sidebar-primary-foreground'];

function useApplyAppearance(theme: Theme, primaryColor: string | null) {
  const prefersDark = useSyncExternalStore(
    subscribeColorScheme,
    getPrefersDark,
    getPrefersDarkServer,
  );
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.dataset.theme = isDark ? 'dark' : 'light';
    root.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    if (!primaryColor) return;
    const foreground = readableForeground(primaryColor);
    for (const name of PRIMARY_VARS) root.style.setProperty(name, primaryColor);
    for (const name of FOREGROUND_VARS) root.style.setProperty(name, foreground);
    return () => {
      for (const name of [...PRIMARY_VARS, ...FOREGROUND_VARS]) root.style.removeProperty(name);
    };
  }, [primaryColor]);
}

function canLoadSettings(role: string | undefined, companyId: string | null | undefined): boolean {
  if (!role) return false;
  const normalized = role.replaceAll('-', '_');
  if (normalized === UserRole.GUEST) return false;
  if (normalized === UserRole.MASTER || normalized === UserRole.MASTER_ADMIN) return true;
  return Boolean(companyId);
}

export function CompanySettingsProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const companyId = user?.companyId;
  const queryKey = companySettingsQueryKey(companyId);

  const query = useQuery({
    queryKey,
    queryFn: fetchCompanySettings,
    enabled: canLoadSettings(user?.role, companyId),
    staleTime: 1000 * 60 * 10,
    retry: (count, error) => {
      const status = extractHttpStatus(error);
      if (status !== null && status >= 400 && status < 500) return false;
      return count < 2;
    },
  });

  const settings = query.data;
  useApplyAppearance(
    settings?.appearance.effective.theme ?? 'light',
    settings?.appearance.company.primaryColor ?? null,
  );

  const queryKeyId = queryKey[1];
  const reload = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [COMPANY_SETTINGS_QUERY_KEY] });
  }, [queryClient]);

  const replace = useCallback(
    (next: CompanySettings) => {
      queryClient.setQueryData(companySettingsQueryKey(queryKeyId), next);
    },
    [queryClient, queryKeyId],
  );

  const value = useMemo<CompanySettingsContextValue>(() => {
    const format = toFormatSettings(settings);
    return {
      settings,
      isLoading: query.isLoading,
      error: query.error,
      reload,
      replace,
      format,
      formatNumber: (v, digits) => formatNumberWith(format, v, digits),
      formatMoney: (v) => formatMoneyWith(format, v),
      formatDate: (v) => formatDateWith(format, v),
      formatDateTime: (v) => formatDateTimeWith(format, v),
      formatWeight: (v, digits) => formatWeightWith(format, v, digits),
      formatVolume: (v, digits) => formatVolumeWith(format, v, digits),
      formatTemperature: (v) => formatTemperatureWith(format, v),
      toStorageWeight: (v) => weightToKg(v, format.weightUnit),
      toStorageVolume: (v) => volumeToL(v, format.volumeUnit),
      toStorageTemperature: (v) => temperatureToCelsius(v, format.temperatureUnit),
    };
  }, [settings, query.isLoading, query.error, reload, replace]);

  return <CompanySettingsContext value={value}>{children}</CompanySettingsContext>;
}

export function useCompanySettings(): CompanySettingsContextValue {
  const context = use(CompanySettingsContext);
  if (!context) {
    throw new Error('useCompanySettings deve ser usado dentro de CompanySettingsProvider');
  }
  return context;
}
