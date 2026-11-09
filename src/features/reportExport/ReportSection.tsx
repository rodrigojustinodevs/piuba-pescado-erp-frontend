import type { ReactNode } from 'react';

export function ReportSection({
  title,
  description,
  children,
}: Readonly<{ title: string; description?: string; children: ReactNode }>) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function SectionEmpty({ children }: Readonly<{ children: ReactNode }>) {
  return <p className="py-4 text-center text-sm text-slate-500">{children}</p>;
}
