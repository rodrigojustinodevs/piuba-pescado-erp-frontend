import type { ReactNode } from 'react';

type DetailItemProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

export function DetailItem({ icon, label, value }: Readonly<DetailItemProps>) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-slate-400 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value || '—'}</p>
      </div>
    </div>
  );
}
