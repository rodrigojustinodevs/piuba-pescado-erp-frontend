'use client';

import { ChevronDownIcon } from '@/app/_components/AppIcons';

export type SortButtonProps = {
  /** Valor atual (apenas para acessibilidade/telemetria visual futura) */
  current?: string;
  /** Callback para alterar a ordenação (opcional; se ausente, o botão não faz nada) */
  onSort?: (val: string) => void;
  /** Valor a aplicar ao clicar */
  value?: string;
  /** Rótulo exibido no botão */
  label?: string;
};

export function SortButton({ current, onSort, value = 'name', label = 'Nome' }: SortButtonProps) {
  const ariaLabel = current ? `Ordenar por: ${current}` : 'Ordenar por';

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-sm text-slate-600">Ordenar por:</span>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onSort ? () => onSort(value) : undefined}
        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0F172A] hover:bg-slate-50 transition-colors"
      >
        <span>{label}</span>
        <ChevronDownIcon className="h-4 w-4 text-slate-400" />
      </button>
    </div>
  );
}
