'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MenuItem as MenuItemType } from './types';
import { Dropdown } from './Dropdown';

interface MenuItemProps {
  item: MenuItemType;
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed?: boolean;
}

export function MenuItem({ item, isOpen, onToggle, isCollapsed = false }: MenuItemProps) {
  const pathname = usePathname();
  const isActive = item.href
    ? pathname === item.href || pathname.startsWith(`${item.href}/`)
    : false;
  const itemStateClasses = isActive
    ? 'bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)]'
    : 'text-white/85 hover:bg-white/10 hover:text-white';

  // Se está colapsado e tem filhos, não mostra dropdown
  if (isCollapsed && item.children && item.children.length > 0) {
    return (
      <div className="group relative" title={item.label}>
        <div
          className={`flex items-center justify-center px-3 py-2.5 text-sm font-bold rounded-xl transition-colors ${itemStateClasses}`}
        >
          {item.icon && (
            <span className="w-5 h-5">
              <item.icon className="w-5 h-5" />
            </span>
          )}
        </div>
        {/* Tooltip no hover quando colapsado */}
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
          {item.label}
        </div>
      </div>
    );
  }

  // Se tem filhos, renderiza como dropdown
  if (item.children && item.children.length > 0) {
    return <Dropdown item={item} isOpen={isOpen} onToggle={onToggle} isCollapsed={isCollapsed} />;
  }

  // Item simples com link ou onClick
  const content = (
    <div
      className={`group relative flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl transition-colors ${itemStateClasses} ${
        isCollapsed ? 'justify-center' : ''
      }`}
    >
      {item.icon && (
        <span
          className={`grid h-5 w-5 place-items-center flex-shrink-0 transition-colors ${
            isActive ? 'text-[color:var(--sidebar-accent-foreground)]' : 'text-white/70 group-hover:text-white'
          }`}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <item.icon className="w-5 h-5" />
          </span>
        </span>
      )}
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-white/15 text-white/90">
              {item.badge}
            </span>
          )}
        </>
      )}
      {/* Tooltip no hover quando colapsado */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
          {item.label}
        </div>
      )}
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} onClick={onToggle} className="block">
        {content}
      </Link>
    );
  }

  if (item.onClick) {
    return (
      <button onClick={item.onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}
