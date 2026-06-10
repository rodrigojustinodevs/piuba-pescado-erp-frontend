'use client';

import type { ReactNode } from 'react';
import { PageHeader } from '@/shared/components/ui';
import { CircleIcon } from '@/shared/components/icons/AppIcons';

type HarvestPageShellProps = {
  breadcrumb: string;
  title: string;
  subtitle: string;
  icon?: ReactNode;
  children: ReactNode;
};

export function HarvestPageShell({
  breadcrumb,
  title,
  subtitle,
  icon,
  children,
}: Readonly<HarvestPageShellProps>) {
  return (
    <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
      <PageHeader
        breadcrumb={breadcrumb}
        title={title}
        subtitle={subtitle}
        icon={icon ?? <CircleIcon className="h-6 w-6 text-[#0EA5A4]" />}
      />
      {children}
    </div>
  );
}
