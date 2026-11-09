import { Lock } from 'lucide-react';

export function ReadOnlyNotice({ label = 'Somente leitura' }: Readonly<{ label?: string }>) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <Lock className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
