'use client';

import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { useId } from 'react';
import { cn } from '@/shared/lib/utils';

export type ThemeChoiceValue = 'light' | 'dark' | 'system' | 'company';

const ICONS: Record<ThemeChoiceValue, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
  company: Monitor,
};

type Props = Readonly<{
  legend: string;
  value: ThemeChoiceValue;
  onChange: (value: ThemeChoiceValue) => void;
  options: Array<{ value: ThemeChoiceValue; label: string; description?: string }>;
  disabled?: boolean;
}>;

/** Grupo de rádios em cartões (tema). */
export function ThemeChoice({ legend, value, onChange, options, disabled }: Props) {
  const name = useId();
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-2 text-sm font-medium text-foreground">{legend}</legend>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-3">
        {options.map((option) => {
          const Icon = ICONS[option.value];
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border bg-background px-4 py-3 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring/40 has-disabled:cursor-not-allowed has-disabled:opacity-60',
                checked ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <Icon
                className={cn(
                  'size-4 shrink-0',
                  checked ? 'text-primary' : 'text-muted-foreground',
                )}
                aria-hidden="true"
              />
              <span className="flex min-w-0 flex-col">
                <span className="font-medium text-foreground">{option.label}</span>
                {option.description ? (
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
