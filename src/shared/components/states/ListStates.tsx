'use client';

import { SpinnerIcon } from '@/shared/components/icons/AppIcons';
import { Alert } from '@/shared/components/Alert';

export function ListLoadingState({ label = 'Carregando...' }: Readonly<{ label?: string }>) {
  return (
    <div className="p-8 text-center">
      <div className="flex items-center justify-center gap-2 text-slate-500">
        <SpinnerIcon className="w-5 h-5 animate-spin" />
        <span>{label}</span>
      </div>
    </div>
  );
}

export function ListEmptyState({
  title,
  subtitle,
}: Readonly<{ title: string; subtitle?: string }>) {
  return (
    <div className="p-8 text-center text-slate-500">
      <p className="text-base">{title}</p>
      {subtitle && <p className="mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}

export function ListErrorState({
  title,
  message,
}: Readonly<{ title: string; message: string }>) {
  return (
    <div className="p-6">
      <Alert type="error" title={title} message={message} />
    </div>
  );
}
