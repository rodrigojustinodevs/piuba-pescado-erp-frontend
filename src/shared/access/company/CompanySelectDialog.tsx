'use client';

import { Building2, Check } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { Button } from '@/shared/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { accessEvents } from '../accessEvents';
import { ACCESS_MESSAGES } from '../messages';
import { ROLE_LABELS, normalizeRole } from '../roles';
import { useSwitchCompany } from './useSwitchCompany';

/** Lista de empresas ativas do usuário com a troca. Usada pelo diálogo e pela tela sem acesso. */
export function CompanyList({ onSwitched }: Readonly<{ onSwitched?: () => void }>) {
  const { user } = useAuthContext();
  const switchCompany = useSwitchCompany();
  const companies = user?.companies ?? [];

  if (companies.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Você não tem outra empresa ativa. Peça a um administrador para reativar seu acesso.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {companies.map((company) => {
        const active = company.id === user?.companyId;
        const role = normalizeRole(company.role);
        return (
          <li key={company.id}>
            <button
              type="button"
              disabled={active || switchCompany.isPending}
              aria-current={active ? 'true' : undefined}
              onClick={() => switchCompany.mutate(company.id, { onSuccess: onSwitched })}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none disabled:cursor-default disabled:hover:bg-transparent"
            >
              <Building2 className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">
                  {company.name || 'Empresa sem nome'}
                </span>
                {role ? (
                  <span className="block text-xs text-muted-foreground">{ROLE_LABELS[role]}</span>
                ) : null}
              </span>
              {active ? <Check className="size-4 text-primary" aria-label="Empresa ativa" /> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Aberto pelo 403 NO_COMPANY_CONTEXT ou pelo "Trocar de empresa". */
export function CompanySelectDialog() {
  const { companySelectorOpen } = useSyncExternalStore(
    accessEvents.subscribe,
    accessEvents.getState,
    accessEvents.getServerState,
  );

  return (
    <Dialog
      open={companySelectorOpen}
      onOpenChange={(open) => !open && accessEvents.closeCompanySelector()}
    >
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escolha a empresa</DialogTitle>
          <DialogDescription>{ACCESS_MESSAGES.NO_COMPANY}</DialogDescription>
        </DialogHeader>
        <CompanyList onSwitched={() => accessEvents.closeCompanySelector()} />
      </DialogContent>
    </Dialog>
  );
}

/** Substitui o conteúdo quando a API responde 403 COMPANY_ACCESS_DENIED. Sem logout em loop. */
export function CompanyAccessDenied() {
  const { logout } = useAuthContext();
  return (
    <div className="mx-auto max-w-lg space-y-5 rounded-2xl border border-border bg-card p-6">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold text-foreground">Sem acesso a esta empresa</h1>
        <p className="text-sm text-muted-foreground">{ACCESS_MESSAGES.COMPANY_DENIED}</p>
      </div>
      <CompanyList />
      <Button type="button" variant="outline" onClick={() => void logout()}>
        Sair
      </Button>
    </div>
  );
}
