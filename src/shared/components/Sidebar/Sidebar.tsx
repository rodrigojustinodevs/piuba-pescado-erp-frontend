'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/features/auth';
import type { SidebarProps } from './types';
import { MenuItem } from './MenuItem';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, LogoutIcon, UserIcon } from './SidebarIcons';

const SIDEBAR_ID = 'app-sidebar';

type SidebarUser = NonNullable<SidebarProps['user']>;

function isExternalUrl(src: string) {
  return /^https?:\/\//i.test(src);
}

export function Sidebar({
  items,
  isOpen: controlledIsOpen,
  onToggle,
  isCollapsed: controlledIsCollapsed,
  onCollapseToggle,
  logo,
  user,
}: SidebarProps) {
  const { logout } = useAuth();

  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  const isOpen = controlledIsOpen ?? internalIsOpen;
  const isCollapsed = controlledIsCollapsed ?? internalIsCollapsed;

  const toggleOpen = useCallback(() => {
    if (onToggle) return onToggle();
    setInternalIsOpen((prev) => !prev);
  }, [onToggle]);

  const toggleCollapse = useCallback(() => {
    if (onCollapseToggle) return onCollapseToggle();
    setInternalIsCollapsed((prev) => !prev);
  }, [onCollapseToggle]);

  const handleLogout = useCallback(() => {
    void logout();
  }, [logout]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleOpen();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, toggleOpen]);

  return (
    <>
      <SidebarOverlay open={isOpen} onClose={toggleOpen} />

      <aside
        id={SIDEBAR_ID}
        aria-label="Menu lateral"
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out relative overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {!isCollapsed && <SidebarBackground />}

        <div className="relative z-10 flex h-full flex-col">
          <SidebarHeader
            isCollapsed={isCollapsed}
            logo={logo}
            onToggleCollapse={toggleCollapse}
            onCloseMobile={toggleOpen}
          />

          <nav className="flex-1 overflow-y-auto py-4" aria-label="Navegação principal">
            <ul className="space-y-1 px-2 list-none">
              {items.map((item) => (
                <li key={item.id}>
                  <MenuItem
                    item={item}
                    isOpen={isOpen}
                    onToggle={toggleOpen}
                    isCollapsed={isCollapsed}
                  />
                </li>
              ))}
            </ul>
          </nav>

          {user && (
            <SidebarUserFooter user={user} isCollapsed={isCollapsed} onLogout={handleLogout} />
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <button
      type="button"
      aria-label="Fechar menu lateral"
      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      onClick={onClose}
    />
  );
}

function SidebarHeader({
  isCollapsed,
  logo,
  onToggleCollapse,
  onCloseMobile,
}: {
  isCollapsed: boolean;
  logo?: React.ReactNode;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <SidebarBrand isCollapsed={isCollapsed} logo={logo} />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          aria-controls={SIDEBAR_ID}
          aria-pressed={isCollapsed}
          title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          aria-label="Fechar menu"
          aria-controls={SIDEBAR_ID}
        >
          <CloseIcon />
        </button>
      </div>
    </header>
  );
}

function SidebarBrand({ isCollapsed, logo }: { isCollapsed: boolean; logo?: React.ReactNode }) {
  if (isCollapsed) {
    return (
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
        <span className="text-white font-bold text-sm">P</span>
      </div>
    );
  }

  return (
    logo || (
      <div className="flex items-center gap-2">
        <div className="w-8 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <span className="font-bold text-lg text-gray-800">Piuba ERP</span>
      </div>
    )
  );
}

function SidebarUserFooter({
  user,
  isCollapsed,
  onLogout,
}: {
  user: SidebarUser;
  isCollapsed: boolean;
  onLogout: () => void;
}) {
  if (isCollapsed) {
    return (
      <footer className="p-4">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center p-2 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          title="Sair"
          aria-label="Sair"
        >
          <LogoutIcon />
        </button>
      </footer>
    );
  }

  return (
    <footer className="px-4 pb-4">
      <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="flex items-center gap-3 p-3">
          <UserAvatar avatar={user.avatar} name={user.name} />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.subtitle || user.email}</p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Sair"
            title="Sair"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </footer>
  );
}

function UserAvatar({ avatar, name }: { avatar?: string; name: string }) {
  if (!avatar) {
    return (
      <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center">
        <UserIcon />
      </div>
    );
  }

  if (isExternalUrl(avatar)) {
    return <Image src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />;
  }

  return (
    <div className="relative w-10 h-10 overflow-hidden rounded-full">
      <Image src={avatar} alt={name} fill className="object-cover" sizes="40px" />
    </div>
  );
}

function SidebarBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[440px]">
      <div className="relative h-full w-full">
        <Image
          src="/aquaculture-sidebar-farm.png"
          alt=""
          fill
          sizes="356px"
          className="object-cover object-bottom"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white/10" />
    </div>
  );
}
