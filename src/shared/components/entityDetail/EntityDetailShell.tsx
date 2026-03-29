import type { ReactNode } from 'react';

export type EntityDetailShellProps = {
  breadcrumb: ReactNode;
  children: ReactNode;
};

export function EntityDetailShell({ breadcrumb, children }: Readonly<EntityDetailShellProps>) {
  return (
    <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
      <p className="text-sm text-slate-600 mb-4">{breadcrumb}</p>
      <div className="rounded-2xl border border-slate-200 shadow-sm">{children}</div>
    </div>
  );
}
