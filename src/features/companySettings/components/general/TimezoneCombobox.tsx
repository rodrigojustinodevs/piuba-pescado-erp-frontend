'use client';

import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown, Search } from 'lucide-react';
import { useDeferredValue, useId, useMemo, useState, type KeyboardEvent } from 'react';
import { cn } from '@/shared/lib/utils';
import { BRAZIL_TIMEZONES } from '../../constants/options';
import { controlClasses, type Option } from '../fields';

const MAX_VISIBLE = 80;

let cachedOptions: Option[] | null = null;

/** Fusos do Brasil no topo e, depois, todos os fusos IANA do navegador. */
function getTimezoneOptions(): Option[] {
  if (cachedOptions) return cachedOptions;
  const brazil = new Set(BRAZIL_TIMEZONES.map((tz) => tz.value));
  const all =
    typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : [];
  cachedOptions = [
    ...BRAZIL_TIMEZONES,
    ...all
      .filter((tz) => !brazil.has(tz))
      .map((tz) => ({ value: tz, label: tz.replaceAll('_', ' ') })),
  ];
  return cachedOptions;
}

export function timezoneLabel(value: string): string {
  return BRAZIL_TIMEZONES.find((tz) => tz.value === value)?.label ?? value.replaceAll('_', ' ');
}

function normalize(text: string): string {
  return text.normalize('NFD').replaceAll(/[̀-ͯ]/g, '').toLowerCase();
}

type Props = Readonly<{
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}>;

/** Select pesquisável de fusos horários (IANA). */
export function TimezoneCombobox({ id, value, onChange, disabled, invalid, describedBy }: Props) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const deferredQuery = useDeferredValue(query);

  const matches = useMemo(() => {
    const term = normalize(deferredQuery.trim());
    const options = getTimezoneOptions();
    const filtered = term
      ? options.filter(
          (o) => normalize(o.label).includes(term) || normalize(o.value).includes(term),
        )
      : options;
    return filtered.slice(0, MAX_VISIBLE);
  }, [deferredQuery]);

  function select(option: Option) {
    onChange(option.value);
    setOpen(false);
    setQuery('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, matches.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const option = matches[activeIndex];
      if (option) select(option);
    }
  }

  const activeId = matches[activeIndex] ? `${listId}-${activeIndex}` : undefined;

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setActiveIndex(0);
      }}
    >
      <Popover.Trigger
        id={id}
        type="button"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(controlClasses, 'flex items-center justify-between gap-2 text-left')}
      >
        <span className="truncate">{value ? timezoneLabel(value) : 'Selecione…'}</span>
        <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-(--radix-popover-trigger-width) min-w-64 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <div className="flex items-center gap-2 rounded-md border-b border-border px-2 pb-1 focus-within:ring-2 focus-within:ring-ring/40">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={activeId}
              aria-label="Buscar fuso horário"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Buscar cidade ou região…"
              className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul
            id={listId}
            role="listbox"
            aria-label="Fusos horários"
            className="max-h-64 overflow-y-auto py-1"
          >
            {matches.length === 0 ? (
              <li className="px-2 py-2 text-sm text-muted-foreground">Nenhum fuso encontrado.</li>
            ) : (
              matches.map((option, index) => (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={option.value === value}
                  onPointerMove={() => setActiveIndex(index)}
                  onClick={() => select(option)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm',
                    index === activeIndex && 'bg-accent text-accent-foreground',
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value ? (
                    <Check className="size-4 shrink-0" aria-hidden="true" />
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
