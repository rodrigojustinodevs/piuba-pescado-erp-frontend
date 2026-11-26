/**
 * Tons semânticos das modais de detalhes. Cada feature mapeia seu status para um tom;
 * nenhuma feature deve definir cores de status por conta própria.
 */
export type DetailTone = 'success' | 'neutral' | 'warning' | 'danger' | 'info';

export type DetailToneClasses = {
  /** Dot do badge de status. */
  dot: string;
  /** Fundo, texto e ring do badge de status. */
  badge: string;
  /** Fundo e cor do ícone do cabeçalho. */
  iconBg: string;
};

export const DETAIL_TONES: Record<DetailTone, DetailToneClasses> = {
  success: {
    dot: 'bg-emerald-500',
    badge:
      'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20',
    iconBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
  neutral: {
    dot: 'bg-zinc-400',
    badge:
      'bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-400/20',
    iconBg: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-500/10 dark:text-zinc-400',
  },
  warning: {
    dot: 'bg-amber-500',
    badge:
      'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20',
    iconBg: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  },
  danger: {
    dot: 'bg-rose-500',
    badge:
      'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-400/20',
    iconBg: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  },
  info: {
    dot: 'bg-sky-500',
    badge:
      'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-400/20',
    iconBg: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
  },
};

const GENERIC_STATUS_TONE: Record<string, DetailTone> = {
  active: 'success',
  confirmed: 'success',
  received: 'success',
  completed: 'success',
  paid: 'success',
  paga: 'success',
  pending: 'warning',
  in_progress: 'warning',
  scheduled: 'info',
  delivered: 'info',
  entregue: 'info',
  emitida: 'info',
  cancelled: 'danger',
  overdue: 'danger',
  atrasada: 'danger',
  draft: 'neutral',
  inactive: 'neutral',
  cancelada: 'neutral',
};

/**
 * Tom para status genéricos vindos da API como string (vendas, compras etc.).
 * Prefira um `Record<SeuStatus, DetailTone>` quando o status tiver um tipo fechado.
 */
export function getStatusTone(status: string | null | undefined): DetailTone {
  return GENERIC_STATUS_TONE[status?.toLowerCase() ?? ''] ?? 'neutral';
}
