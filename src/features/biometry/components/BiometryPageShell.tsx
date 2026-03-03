'use client';

import type { ReactNode } from 'react';
import { PageHeader } from '@/shared/components/ui';

type BiometryPageShellProps = {
  breadcrumb: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
};

export function BiometryPageShell({
  breadcrumb,
  title,
  subtitle,
  icon,
  children,
}: Readonly<BiometryPageShellProps>) {
  return (
    <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
      <PageHeader breadcrumb={breadcrumb} title={title} subtitle={subtitle} icon={icon} />
      {children}
    </div>
  );
}
