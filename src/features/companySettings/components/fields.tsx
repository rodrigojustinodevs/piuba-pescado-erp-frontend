'use client';

import { createContext, use, useId, type ComponentProps, type ReactNode } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { cn } from '@/shared/lib/utils';

type FieldContextValue = { id: string; describedBy: string | undefined; invalid: boolean };

const FieldContext = createContext<FieldContextValue | null>(null);

/** `id`, `describedBy` e `invalid` do <Field> atual, para controles customizados. */
export function useFieldContext(): FieldContextValue {
  const ctx = use(FieldContext);
  if (!ctx) throw new Error('Controle de campo usado fora de <Field>');
  return ctx;
}

type FieldProps = Readonly<{
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}>;

/** Rótulo + controle + ajuda/erro, ligados por `id` e `aria-describedby`. */
export function Field({ label, error, hint, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <FieldContext value={{ id, describedBy, invalid: Boolean(error) }}>
      <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {children}
        {error ? (
          <p id={errorId} className="text-xs text-destructive">
            {error}
          </p>
        ) : null}
        {hint ? (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    </FieldContext>
  );
}

export const controlClasses =
  'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/30';

export function TextField({ className, ...props }: ComponentProps<'input'>) {
  const { id, describedBy, invalid } = useFieldContext();
  return (
    <input
      id={id}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={cn(controlClasses, className)}
      {...props}
    />
  );
}

export type Option = { value: string; label: string };

type SelectFieldProps = Readonly<{
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}>;

export function SelectField({
  value,
  onValueChange,
  options,
  placeholder = 'Selecione…',
  disabled,
  name,
}: SelectFieldProps) {
  const { id, describedBy, invalid } = useFieldContext();
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled} name={name}>
      <SelectTrigger
        id={id}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className={cn(controlClasses, 'h-10 bg-background')}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
