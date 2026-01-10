"use client";

import { useState } from "react";
import { Sidebar, type SidebarProps } from "../Sidebar";
import { menuConfig } from "../Sidebar/menuConfig";
import { useMenuAuthorization } from "../Sidebar/hooks/useMenuAuthorization";
import { useAuthContext } from "@/shared/contexts/AuthContext";

// Ícone de menu para mobile
const MenuIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems?: SidebarProps["items"];
  user?: SidebarProps["user"];
}

export function DashboardLayout({
  children,
  menuItems,
  user: userProp,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Obtém o usuário do contexto de autenticação
  const { user: contextUser } = useAuthContext();
  
  // Usa o usuário do contexto ou o passado como prop (fallback)
  const user = contextUser || userProp;

  // Filtra itens de menu baseado nas permissões do usuário
  // Se menuItems for passado como prop, usa ele diretamente (sem filtro de autorização)
  // Caso contrário, usa a configuração padrão com autorização
  const authorizedMenuItems = menuItems 
    ? menuItems 
    : useMenuAuthorization(menuConfig);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        items={authorizedMenuItems}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={user ? {
          name: user.name || user.email,
          email: user.email,
        } : undefined}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Abrir menu"
          >
            <MenuIcon />
          </button>
          <h1 className="font-semibold text-gray-800">Piuba ERP</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

