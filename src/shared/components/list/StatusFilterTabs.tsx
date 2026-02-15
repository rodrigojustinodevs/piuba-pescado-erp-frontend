'use client';

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
    <div className="flex items-center gap-2 shrink-0">
      {computedOptions.map((opt) => {
        const selected = filter === opt.value;
        const hasBadge = (opt.badgeCount ?? 0) > 0;

        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`${hasBadge ? 'relative' : ''} px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selected
                ? 'bg-[#0EA5A4] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {opt.label}
            {hasBadge && (
              <span
                className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  selected ? 'bg-white/20 text-white' : 'bg-[#0EA5A4] text-white'
                }`}
              >
                {opt.badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
