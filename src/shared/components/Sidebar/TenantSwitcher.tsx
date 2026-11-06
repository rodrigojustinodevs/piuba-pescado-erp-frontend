'use client';

import Image from 'next/image';
import { ChevronsUpDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { useCompany } from '@/features/company';
import { cn } from '@/shared/lib/utils';
import { useSidebar } from './Sidebar';

const FALLBACK_SUBTITLE = 'Selecione uma empresa';

export function TenantSwitcher() {
  const { user } = useAuthContext();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { data: company } = useCompany(user?.companyId ?? undefined);
  const companyName = company?.name ?? FALLBACK_SUBTITLE;

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
            {companyName}
          </DropdownMenu.Item>
          {/* TODO: listar as empresas/fazendas do usuário e permitir trocar a empresa ativa
              quando existir endpoint/contexto de troca de tenant. */}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
