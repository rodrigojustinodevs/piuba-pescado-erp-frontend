'use client';

import Image from 'next/image';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSwitchCompany } from '@/shared/access/company/useSwitchCompany';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { useCompanySettings } from '@/shared/contexts/CompanySettingsContext';
import { cn } from '@/shared/lib/utils';
import { useSidebar } from './Sidebar';

const FALLBACK_SUBTITLE = 'Selecione uma empresa';

export function TenantSwitcher() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  // Nome vem de /api/company/settings (já carregado no provider), que vale para todos os perfis.
  const { settings } = useCompanySettings();
  const companyName = settings?.general.name ?? FALLBACK_SUBTITLE;
  const { user } = useAuthContext();
  const switchCompany = useSwitchCompany();
  const others = (user?.companies ?? []).filter((c) => c.id !== user?.companyId);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Empresa ativa: ${companyName}`}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg bg-sidebar-accent/50 p-2 text-left outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent focus-visible:ring-2',
            isCollapsed && 'justify-center bg-transparent p-0',
          )}
        >
          <Image
            src="/icone-piuba-pescados.svg"
            alt=""
            width={40}
            height={40}
            className={cn('shrink-0', isCollapsed ? 'size-8' : 'size-9')}
          />
          {!isCollapsed && (
            <>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span
                  translate="no"
                  className="truncate text-sm font-semibold text-sidebar-foreground"
                >
                  Piúba&nbsp;Pescado
                </span>
                <span className="truncate text-xs text-sidebar-foreground/60">{companyName}</span>
              </span>
              <ChevronsUpDown
                aria-hidden="true"
                className="size-4 shrink-0 text-sidebar-foreground/60"
              />
            </>
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={isCollapsed ? 'right' : 'bottom'}
          align="start"
          sideOffset={8}
          className="z-50 min-w-56 rounded-lg border border-sidebar-border bg-sidebar p-1 text-sidebar-foreground shadow-lg"
        >
          <DropdownMenu.Label className="px-2 py-1.5 text-[11px] uppercase tracking-wider text-sidebar-foreground/50">
            Empresa ativa
          </DropdownMenu.Label>
          <DropdownMenu.Item
            disabled
            className="rounded-md px-2 py-2 text-sm outline-none data-disabled:opacity-100"
          >
            <span className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate">{companyName}</span>
              <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
            </span>
          </DropdownMenu.Item>
          {others.length > 0 ? (
            <>
              <DropdownMenu.Separator className="my-1 h-px bg-sidebar-border" />
              <DropdownMenu.Label className="px-2 py-1.5 text-[11px] uppercase tracking-wider text-sidebar-foreground/50">
                Trocar para
              </DropdownMenu.Label>
              {others.map((company) => (
                <DropdownMenu.Item
                  key={company.id}
                  disabled={switchCompany.isPending}
                  onSelect={() => switchCompany.mutate(company.id)}
                  className="cursor-pointer rounded-md px-2 py-2 text-sm outline-none data-highlighted:bg-sidebar-accent data-disabled:opacity-50"
                >
                  {company.name || 'Empresa sem nome'}
                </DropdownMenu.Item>
              ))}
            </>
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
