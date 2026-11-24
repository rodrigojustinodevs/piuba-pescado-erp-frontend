'use client';

import { CreditCard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { canManageBilling } from '../utils/permissions';
import { BillingLoading, BillingNoAccess } from './states';

const NAV = [
  { href: '/dashboard/assinatura', label: 'Minha assinatura' },
  { href: '/dashboard/assinatura/planos', label: 'Planos' },
  { href: '/dashboard/assinatura/faturas', label: 'Faturas' },
] as const;

type Props = Readonly<{
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}>;

/** Casca comum das telas de billing: cabeçalho, navegação e guarda de papel. */
export function BillingPage({ title, subtitle, actions, children }: Props) {
  const { user, isLoading } = useAuthContext();
  const pathname = usePathname();

  let content: ReactNode = children;
  if (isLoading || !user) content = <BillingLoading label="Carregando sessão…" />;
  else if (!canManageBilling(user.role)) content = <BillingNoAccess />;
  else if (!user.companyId) {
    content = (
      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Selecione uma empresa para ver a assinatura.
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCard className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground text-balance">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {actions}
      </header>

      <nav aria-label="Assinatura" className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {content}
    </div>
  );
}
