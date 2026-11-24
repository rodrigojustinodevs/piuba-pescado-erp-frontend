'use client';

import { cn } from '@/shared/lib/utils';
import type { BillingCycle } from '../types';
import { CYCLE_LABELS } from '../utils/labels';

type Props = Readonly<{
  cycles: BillingCycle[];
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}>;

export function CycleToggle({ cycles, value, onChange }: Props) {
  if (cycles.length < 2) return null;
  return (
    <fieldset className="inline-flex rounded-xl bg-muted p-1">
      <legend className="sr-only">Ciclo de cobrança</legend>
      {cycles.map((cycle) => (
        <label
          key={cycle}
          className={cn(
            'cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
            value === cycle
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <input
            type="radio"
            name="billing-cycle"
            value={cycle}
            checked={value === cycle}
            onChange={() => onChange(cycle)}
            className="sr-only"
          />
          {CYCLE_LABELS[cycle]}
        </label>
      ))}
    </fieldset>
  );
}
