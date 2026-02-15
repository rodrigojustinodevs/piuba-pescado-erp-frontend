'use client';

import Link from 'next/link';
import { SpinnerIcon } from '@/shared/components/icons/AppIcons';

export function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="text-center py-8">
      <div className="flex items-center justify-center gap-2 text-slate-500">
        <SpinnerIcon className="w-5 h-5 animate-spin" />
        <span>{label}</span>
      </div>
    </div>
  );
}

export function NotFoundState({
  message,
  backHref,
  backLabel = 'Voltar para lista',
}: {
  message: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-red-600">{message}</p>
      {backHref && (
        <Link href={backHref} className="mt-4 inline-block text-[#0EA5A4] hover:text-[#0F766E]">
          {backLabel}
        </Link>
      )}
    </div>
  );
}
