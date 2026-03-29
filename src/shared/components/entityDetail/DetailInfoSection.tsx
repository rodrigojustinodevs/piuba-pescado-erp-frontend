import type { ReactNode } from 'react';

export type DetailInfoSectionProps = {
  title: string;
  children: ReactNode;
};

export function DetailInfoSection({ title, children }: Readonly<DetailInfoSectionProps>) {
  return (
    <div className="mb-8 mr-8 ml-8 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-1 rounded-full bg-[#0EA5A4]" />
        <h2 className="text-base font-semibold text-[#0F172A]">{title}</h2>
      </div>
      {children}
    </div>
  );
}
