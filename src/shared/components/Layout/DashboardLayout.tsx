'use client';

import { useState } from 'react';
import { Sidebar, type SidebarProps } from '../Sidebar';
import { menuConfig } from '../Sidebar/menuConfig';
import { useMenuAuthorization } from '../Sidebar/hooks/useMenuAuthorization';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { Header, type HeaderProps } from '../Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems?: SidebarProps['items'];
  user?: SidebarProps['user'];
  headerProps?: HeaderProps;
}

export function DashboardLayout({
  children,
  menuItems,
  user: userProp,
  headerProps,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Obtém o usuário do contexto de autenticação
  const { user: contextUser } = useAuthContext();

  // Usa o usuário do contexto ou o passado como prop (fallback)
  const user = contextUser || userProp;

  // Filtra itens de menu baseado nas permissões do usuário
  const authorizedMenuItems = useMenuAuthorization(menuConfig);
  // Se menuItems for passado como prop, usa ele diretamente (sem filtro de autorização)
  const menuItemsToUse = menuItems ?? authorizedMenuItems;

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <Sidebar
        items={menuItemsToUse}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={
          user
            ? {
                name: user.name || user.email,
                email: user.email,
              }
            : undefined
        }
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header {...headerProps} onMenuClick={() => setIsSidebarOpen((open) => !open)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
