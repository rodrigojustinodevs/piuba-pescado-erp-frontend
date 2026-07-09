'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export function ListHeader({
  icon,
  title,
  subtitle,
  ctaHref,
  ctaOnClick,
  ctaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
  dialogOpen,
  dialogLabel = 'Nova Empresa',
  setDialogOpen,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  ctaHref?: string;
  ctaOnClick?: () => void;
  ctaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  dialogOpen?: boolean;
  dialogLabel?: string;
  setDialogOpen: (open: boolean) => void;
}) {
  const ctaButtonClassName =
    'flex items-center gap-2 rounded-lg bg-[#0EA5A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] transition-colors shrink-0';

  let primaryCta: ReactNode = null;
  if (ctaLabel && ctaHref) {
    primaryCta = (
      <Link href={ctaHref} className={ctaButtonClassName}>
        <Plus className="h-5 w-5" />
        {ctaLabel}
      </Link>
    );
  } else if (ctaLabel && ctaOnClick) {
    primaryCta = (
      <button type="button" onClick={ctaOnClick} className={ctaButtonClassName}>
        <Plus className="h-5 w-5" />
        {ctaLabel}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center">{icon}</div>
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">{title}</h1>
          <p className="mt-1 text-base text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {secondaryCtaHref && secondaryCtaLabel ? (
          <Link
            href={secondaryCtaHref}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors shrink-0"
          >
            <Plus className="h-5 w-5" />
            {secondaryCtaLabel}
          </Link>
        ) : null}
        {primaryCta}
      </div>
      {dialogOpen && (
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          {dialogLabel}
        </Button>
      )}
    </div>
  );
}
