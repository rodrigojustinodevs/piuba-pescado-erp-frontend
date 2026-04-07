export type StatusBadgeVariant = 'plain' | 'ring';

const PLAIN: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-rose-100 text-rose-700',
  received: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-slate-100 text-slate-700',
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-700',
};

const RING: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700 ring-blue-200',
  pending: 'bg-amber-100 text-amber-700 ring-amber-200',
  received: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  cancelled: 'bg-rose-100 text-rose-700 ring-rose-200',
  draft: 'bg-slate-100 text-slate-700 ring-slate-200',
  active: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  inactive: 'bg-slate-100 text-slate-700 ring-slate-200',
};

const DEFAULT_PLAIN = 'bg-slate-100 text-slate-700';
const DEFAULT_RING = 'bg-slate-100 text-slate-700 ring-slate-200';

/**
 * Classes Tailwind para badge de status em tabelas (fundo + texto; variante `ring` inclui cor do anel).
 *
 * - `plain`: padrão usado em vendas etc. (sem `ring-1` no span — só cores).
 * - `ring`: igual compras (`ring-1 ring-inset` deve ir no próprio `<span>`).
 */
export function getStatusBadgeClassNames(
  status: string | null | undefined,
  options?: { variant?: StatusBadgeVariant },
): string {
  const key = status?.toLowerCase?.() ?? '';
  const variant = options?.variant ?? 'plain';
  const map = variant === 'ring' ? RING : PLAIN;
  const fallback = variant === 'ring' ? DEFAULT_RING : DEFAULT_PLAIN;
  return map[key] ?? fallback;
}
