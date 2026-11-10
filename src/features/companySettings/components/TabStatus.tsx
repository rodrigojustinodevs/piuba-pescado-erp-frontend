'use client';

import { AlertTriangle, Building2, ShieldOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { FORBIDDEN_MESSAGE, errorMessage, errorStatus, isNoCompanyError } from '../utils/errors';

type QueryLike = { isLoading: boolean; error: unknown; refetch?: () => unknown };

function StatusBox({
  icon,
  title,
  children,
}: Readonly<{ icon: ReactNode; title: string; children?: ReactNode }>) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </span>
      <p className="max-w-md text-sm font-medium text-foreground text-pretty">{title}</p>
      {children}
    </div>
  );
}

export function SettingsSkeleton({ cards = 1 }: Readonly<{ cards?: number }>) {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Carregando configurações…">
      {Array.from({ length: cards }, (_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-2 h-4 w-72 max-w-full" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ForbiddenState() {
  return (
    <StatusBox
      icon={<ShieldOff className="size-5" aria-hidden="true" />}
      title={FORBIDDEN_MESSAGE}
    />
  );
}

/** Carregando, sem permissão (403), sem empresa ativa (422) ou erro genérico. */
export function TabStatus({ query, cards }: Readonly<{ query: QueryLike; cards?: number }>) {
  if (query.isLoading) return <SettingsSkeleton cards={cards} />;
  const { error } = query;
  if (errorStatus(error) === 403) return <ForbiddenState />;
  if (isNoCompanyError(error)) {
    return (
      <StatusBox
        icon={<Building2 className="size-5" aria-hidden="true" />}
        title={errorMessage(error)}
      >
        <p className="text-sm text-muted-foreground">
          Escolha a empresa ativa no seletor no topo do menu lateral e volte a esta tela.
        </p>
      </StatusBox>
    );
  }
  return (
    <StatusBox
      icon={<AlertTriangle className="size-5" aria-hidden="true" />}
      title={errorMessage(error, 'Não foi possível carregar as configurações.')}
    >
      {query.refetch ? (
        <Button variant="outline" size="sm" onClick={() => void query.refetch?.()}>
          Tentar novamente
        </Button>
      ) : null}
    </StatusBox>
  );
}
