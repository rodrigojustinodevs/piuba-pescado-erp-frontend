import type { ReactNode, SelectHTMLAttributes } from 'react';

interface FilterSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  children: ReactNode;
}

export function FilterSelect({ children, ...props }: Readonly<FilterSelectProps>) {
  return (
    <select
      className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5A4]"
      {...props}
    >
      {children}
    </select>
  );
}
