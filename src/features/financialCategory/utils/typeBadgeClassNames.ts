/** Cores de badge alinhadas à coluna Status (plain, sem ring). */
export function getFinancialCategoryTypeBadgeClassNames(type: string | null | undefined): string {
  const key = type?.toLowerCase?.() ?? '';
  switch (key) {
    case 'revenue':
    case 'income':
      return 'bg-emerald-100 text-emerald-700';
    case 'expense':
      return 'bg-rose-100 text-rose-700';
    case 'investment':
      return 'bg-violet-100 text-violet-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}
