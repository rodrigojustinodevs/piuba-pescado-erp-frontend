import { formatCurrency, formatNumber } from '@/shared/utils/numberFormat';

export const EMPTY_VALUE = '—';

type Nullable = number | null | undefined;

export function fmtNumber(value: Nullable, digits = 0): string {
  if (value === null || value === undefined) return EMPTY_VALUE;
  return formatNumber(value, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function fmtPct(value: Nullable, digits = 1): string {
  if (value === null || value === undefined) return EMPTY_VALUE;
  return `${fmtNumber(value, digits)}%`;
}

export function fmtMoney(value: Nullable): string {
  if (value === null || value === undefined) return EMPTY_VALUE;
  return formatCurrency(value);
}

export function fmtKg(value: Nullable, digits = 1): string {
  if (value === null || value === undefined) return EMPTY_VALUE;
  return `${fmtNumber(value, digits)} kg`;
}

export function fmtDuration(ms: Nullable): string {
  if (ms === null || ms === undefined) return EMPTY_VALUE;
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds} s`;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes} min ${totalSeconds % 60} s`;
}

/** Data de hoje (YYYY-MM-DD) no fuso local, usada como data de corte padrão. */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
