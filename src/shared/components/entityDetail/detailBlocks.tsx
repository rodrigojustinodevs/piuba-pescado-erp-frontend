/** Blocos reutilizáveis nas telas de detalhe de entidades (ERP). */
import type { ReactNode } from 'react';

export interface InfoRowProps {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: string;
  readonly className?: string;
}

export function InfoRow({ icon, label, value, className }: InfoRowProps) {
  return (
    <div className={`space-y-1 ${className ?? ''}`}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="wrap-break-word text-sm">{value}</p>
    </div>
  );
}


export type DetailSummaryCardProps = {
  label: string;
  value: string;
};

export function DetailSummaryCard({ label, value }: Readonly<DetailSummaryCardProps>) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
      <p className="text-sm text-slate-600 mb-2">{label}</p>
      <p className="text-2xl font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}

export type DetailInfoFieldProps = {
  label: string;
  value: string;
};

export function DetailInfoField({ label, value }: Readonly<DetailInfoFieldProps>) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <p className="text-xs font-medium text-slate-600 uppercase mb-2">{label}</p>
      <p className="text-sm font-medium text-[#0F172A]">{value}</p>
    </div>
  );
}
