'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { PencilIcon, SpinnerIcon, TrashIcon } from '@/shared/components/icons/AppIcons';

export type DetailPageHeroProps = {
  icon: ReactNode;
  title: string;
  subtitle: ReactNode;
  editHref: string;
  onDeleteClick?: () => void;
  isDeleting?: boolean;
};

export function DetailPageHero({
  icon,
  title,
  subtitle,
  editHref,
  onDeleteClick,
  isDeleting = false,
}: Readonly<DetailPageHeroProps>) {
  return (
    <div className="flex items-start justify-between mb-8 bg-white rounded-t-2xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0EA5A4]/10 border-2 border-[#0EA5A4]/20">
          {icon}
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">{title}</h1>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onDeleteClick ? (
          <button
            type="button"
            onClick={onDeleteClick}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <SpinnerIcon className="h-4 w-4 animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
            Excluir
          </button>
        ) : null}
        <Link
          href={editHref}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
        >
          <PencilIcon className="h-4 w-4" />
          Editar
        </Link>
      </div>
    </div>
  );
}
