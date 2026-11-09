import { EMPTY_VALUE } from '@/features/reportExport/format';

/** 'YYYY-MM' -> 'mm/aaaa'. */
export function fmtMonth(month: string | null | undefined): string {
  if (!month) return EMPTY_VALUE;
  const [year, mon] = month.split('-');
  return year && mon ? `${mon}/${year}` : month;
}
