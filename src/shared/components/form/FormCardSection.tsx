import type { ReactNode } from 'react';

export type FormCardSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function FormCardSection({ title, description, children, footer }: Readonly<FormCardSectionProps>) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[#0F172A]">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      </div>
      {children}
      {footer ? <div className="mt-8">{footer}</div> : null}
    </div>
  );
}
