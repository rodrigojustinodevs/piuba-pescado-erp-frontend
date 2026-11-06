'use client';

import { useId, useMemo, useState } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export type MultiSelectOption = { value: string; label: string };

type MultiSelectProps = Readonly<{
  label: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}>;

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Todos',
  disabled,
  loading,
}: MultiSelectProps) {
  const labelId = useId();
  const [query, setQuery] = useState('');

  const selected = useMemo(() => new Set(value), [value]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  function toggle(optionValue: string) {
    onChange(
      selected.has(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue],
    );
  }

  let summary = placeholder;
  if (loading) summary = 'Carregando…';
  else if (value.length === 1)
    summary = options.find((o) => o.value === value[0])?.label ?? '1 selecionado';
  else if (value.length > 1) summary = `${value.length} selecionados`;

  return (
    <div>
      <span id={labelId} className="mb-1 block text-sm font-medium text-[#0F172A]">
        {label}
      </span>
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger
          aria-labelledby={labelId}
          disabled={disabled}
          className={cn(
            'flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-left text-sm text-[#0F172A]',
            'hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4] disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          <span className="truncate">{summary}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={4}
            className="z-50 w-(--radix-popover-trigger-width) min-w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-md"
          >
            <input
              type="search"
              name={`${labelId}-search`}
              aria-label={`Buscar ${label.toLowerCase()}`}
              autoComplete="off"
              placeholder="Buscar…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mb-2 w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4]"
            />
            <ul className="max-h-60 overflow-auto" aria-label={label}>
              {visible.length === 0 && (
                <li className="px-2 py-3 text-center text-sm text-slate-500">Nenhuma opção</li>
              )}
              {visible.map((option) => {
                const checked = selected.has(option.value);
                return (
                  <li key={option.value}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(option.value)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded border border-slate-300 peer-focus-visible:ring-2 peer-focus-visible:ring-[#0EA5A4]',
                          checked && 'border-[#0EA5A4] bg-[#0EA5A4] text-white',
                        )}
                      >
                        {checked && <Check className="h-3 w-3" />}
                      </span>
                      <span className="min-w-0 truncate">{option.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            {value.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="mt-2 w-full rounded-md px-2 py-1.5 text-xs font-medium text-[#0F766E] hover:bg-slate-50"
              >
                Limpar seleção
              </button>
            )}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}
