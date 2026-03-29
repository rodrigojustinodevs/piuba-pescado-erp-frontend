'use client';

import type { ReactNode } from 'react';
import { PageHeader } from '@/shared/components/ui';

type WaterQualityPageShellProps = {
  breadcrumb: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
};

export function WaterQualityPageShell({
  breadcrumb,
  title,
  subtitle,
  icon,
  children,
}: Readonly<WaterQualityPageShellProps>) {
  return (
    <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
      <PageHeader breadcrumb={breadcrumb} title={title} subtitle={subtitle} icon={icon} />
      {children}
    </div>
  );
}
