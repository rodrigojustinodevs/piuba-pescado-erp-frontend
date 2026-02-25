'use client';

import { SpinnerIcon } from '@/shared/components/icons/AppIcons';

export function ListLoadingState({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="p-8 text-center">
      <div className="flex items-center justify-center gap-2 text-slate-500">
        <SpinnerIcon className="w-5 h-5 animate-spin" />
        <span>{label}</span>
      </div>
    </div>
  );
}

export function ListEmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="p-8 text-center text-slate-500">
      <p className="text-base">{title}</p>
      {subtitle && <p className="mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}
