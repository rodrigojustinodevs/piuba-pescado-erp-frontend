'use client';

import { useState } from 'react';
import { useAuthContext } from '@/shared/contexts/AuthContext';

// Ícones SVG
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const UserIcon = () => (
  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

export interface HeaderProps {
  userTitle?: string;
  /** Chamado ao clicar no botão de menu (mobile). Use para abrir o sidebar. */
  onMenuClick?: () => void;
}

export function Header({ userTitle, onMenuClick }: HeaderProps) {
  const { user } = useAuthContext();
  const [searchValue, setSearchValue] = useState('');

  const getUserTitle = () => {
    if (userTitle) return userTitle;
    if (user?.role) {
      const roleMap: Record<string, string> = {
        master: 'Administrador Master',
        company_admin: 'Administrador',
        manager: 'Gerente',
        operator: 'Operador',
      };
      return roleMap[user.role] || 'Usuário';
    }
    return 'Usuário';
  };

  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Botão menu (mobile) - abre o sidebar */}
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Abrir menu"
          >
            <MenuIcon />
          </button>
        )}
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Side Icons and User Profile */}
        <div className="flex items-center gap-4">
          {/* Language/Flag Icon */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Idioma"
            title="Idioma"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-red-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">UK</span>
            </div>
          </button>

          {/* Notifications Bell */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            aria-label="Notificações"
            title="Notificações"
          >
            <BellIcon />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Messages Envelope */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            aria-label="Mensagens"
            title="Mensagens"
          >
            <EnvelopeIcon />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-lg">
              {user?.name ? <span>{getUserInitials()}</span> : <UserIcon />}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name || user?.email || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500">{getUserTitle()}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
