'use client';

import { useMemo } from 'react';
import { useCompanySettings } from '@/shared/contexts/CompanySettingsContext';
import {
  EMPTY_VALUE,
  formatMoneyWith,
  formatNumberWith,
  formatWeightWith,
} from '@/shared/utils/companyFormat';

type Nullable = number | null | undefined;

export type ReportFormatters = {
  fmtNumber: (value: Nullable, digits?: number) => string;
  fmtPct: (value: Nullable, digits?: number) => string;
  /** Moeda da empresa (sem conversão cambial). Também para preço/kg e custo/kg. */
  fmtMoney: (value: Nullable) => string;
  /** Recebe kg da API e exibe na unidade de peso da empresa. */
  fmtKg: (value: Nullable, digits?: number) => string;
};

/** Formatadores dos relatórios ligados às configurações da empresa (moeda, idioma e peso). */
export function useReportFormatters(): ReportFormatters {
  const { format } = useCompanySettings();
  return useMemo(
    () => ({
      fmtNumber: (value, digits = 0) => formatNumberWith(format, value, digits),
      fmtPct: (value, digits = 1) =>
        value === null || value === undefined
          ? EMPTY_VALUE
          : `${formatNumberWith(format, value, digits)}%`,
      fmtMoney: (value) => formatMoneyWith(format, value),
      fmtKg: (value, digits) => formatWeightWith(format, value, digits),
    }),
    [format],
  );
}
