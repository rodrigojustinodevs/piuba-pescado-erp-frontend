"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { PlusIcon } from "./AppIcons";

export function ListHeader({
  icon,
  title,
  subtitle,
  ctaHref,
  ctaLabel,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center">{icon}</div>
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">{title}</h1>
          <p className="mt-1 text-base text-slate-500">{subtitle}</p>
        </div>
      </div>

      <Link
        href={ctaHref}
        className="flex items-center gap-2 rounded-lg bg-[#0EA5A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] transition-colors"
      >
        <PlusIcon className="h-5 w-5" />
        {ctaLabel}
      </Link>
    </div>
  );
}

