'use client';

export type PageHeaderProps = {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

export function PageHeader({ breadcrumb, title, subtitle, icon }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-sm text-slate-600">{breadcrumb}</p>

      <div className="flex items-center gap-3 mt-2">
        <div className="bg-[#0EA5A4]/10 p-3 rounded-xl">{icon}</div>
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A]">{title}</h1>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
