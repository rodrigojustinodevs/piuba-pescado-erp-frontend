'use client';

import Link from 'next/link';
import { LogOut, Settings } from 'lucide-react';
import { canSeeSettings } from '@/features/companySettings/utils/permissions';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/shared/components/ui/Avatar';
import { cn } from '@/shared/lib/utils';
import { SidebarFooter, useSidebar } from './Sidebar';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  const first = parts[0].charAt(0);
  const second = parts.length > 1 ? parts.at(-1)!.charAt(0) : (parts[0].charAt(1) ?? '');
  return `${first}${second}`.toUpperCase();
}

const footerActionClass =
  'flex size-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2';

export function SidebarUserFooter() {
  const { user, logout } = useAuthContext();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const name = user?.name || 'Usuário';

  return (
    <SidebarFooter className="border-t border-sidebar-border px-3 py-4">
      <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
        <Avatar className="size-9">
          <AvatarFallback className="bg-linear-to-br from-sidebar-primary to-sidebar-ring text-sm font-semibold text-sidebar-primary-foreground">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <>
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-sm font-semibold text-sidebar-foreground">{name}</span>
              {user?.email && (
                <span className="truncate text-xs text-sidebar-foreground/60">{user.email}</span>
              )}
            </div>
            {canSeeSettings(user?.role) ? (
              <Link
                href="/dashboard/configuracoes"
                aria-label="Configurações"
                title="Configurações"
                className={footerActionClass}
              >
                <Settings aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
            <button
              type="button"
              aria-label="Sair"
              title="Sair"
              onClick={() => void logout()}
              className={footerActionClass}
            >
              <LogOut aria-hidden="true" className="size-4" />
            </button>
          </>
        )}
      </div>
    </SidebarFooter>
  );
}
