import type { UserStatus } from '../types';

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  blocked: 'Bloqueado',
};

export const STATUS_BADGE_STYLES: Record<UserStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  blocked: 'bg-rose-100 text-rose-700 border-rose-200',
};

export const STATUS_FILTER_OPTIONS: Array<{ value: 'all' | UserStatus; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'blocked', label: 'Bloqueado' },
];
