import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

type Props = Readonly<{
  title: string;
  description?: ReactNode;
  /** Ação ou selo no canto do cabeçalho. */
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}>;

export function SettingsCard({ title, description, aside, className, children }: Props) {
  const headingId = `settings-card-${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`;
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6',
        className,
      )}
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id={headingId} className="text-base font-semibold text-foreground">
            {title}
          </h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}
