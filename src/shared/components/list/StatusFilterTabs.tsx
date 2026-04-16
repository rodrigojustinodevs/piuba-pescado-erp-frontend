'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';

type DefaultFilterType = 'all' | 'active' | 'inactive';

export type StatusFilterTabsOption<T extends string> = {
  value: T;
  label: string;
  badgeCount?: number;
};

export type StatusFilterTabsProps<T extends string = DefaultFilterType> = {
  filter: T;
  onChange: (next: T) => void;
  /**
   * Lista de opções customizadas (ex.: batches: finished).
   * Se omitido, mantém o comportamento padrão: all/active/inactive.
   */
  options?: Array<StatusFilterTabsOption<T>>;
  /** Contagem padrão do botão "inactive" (retrocompatibilidade) */
  inactiveCount?: number;
  /** Labels padrão (retrocompatibilidade) */
  labels?: { all: string; active: string; inactive: string };
};

export function StatusFilterTabs<T extends string = DefaultFilterType>({
  filter,
  onChange,
  options,
  inactiveCount = 0,
  labels = { all: 'Todas', active: 'Ativos', inactive: 'Inativos' },
}: StatusFilterTabsProps<T>) {
  const computedOptions: Array<StatusFilterTabsOption<T>> =
    options ??
    ([
      { value: 'all' as T, label: labels.all },
      { value: 'active' as T, label: labels.active },
      { value: 'inactive' as T, label: labels.inactive, badgeCount: inactiveCount },
    ] satisfies Array<StatusFilterTabsOption<T>>);

  return (
    <Select
      value={filter}
      onValueChange={(v) => {
        onChange(v as T);
      }}
    >
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {computedOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
