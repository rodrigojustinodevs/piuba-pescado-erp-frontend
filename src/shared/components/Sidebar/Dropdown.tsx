'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MenuItem } from './types';

// Ícone de seta para baixo
const ChevronDownIcon = ({ className }: Readonly<{ className?: string }>) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

interface DropdownProps {
  item: MenuItem;
  isOpen: boolean;
  onToggle: () => void;
  level?: number;
  isCollapsed?: boolean;
}

const ACTIVE_CLASSES =
  'bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)]';
const INACTIVE_CLASSES = 'text-white/85 hover:bg-white/10 hover:text-white';

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function hasActiveDescendant(node: MenuItem, pathname: string): boolean {
  if (node.href && isRouteActive(pathname, node.href)) return true;
  return node.children?.some((child) => hasActiveDescendant(child, pathname)) ?? false;
}

interface ItemContentProps {
  item: MenuItem;
  highlighted: boolean;
  isCollapsed: boolean;
}

function ItemContent({ item, highlighted, isCollapsed }: Readonly<ItemContentProps>) {
  return (
    <>
      {item.icon && (
        <span
          className={`grid h-5 w-5 place-items-center flex-shrink-0 transition-colors ${
            highlighted
              ? 'text-[color:var(--sidebar-accent-foreground)]'
              : 'text-white/70 group-hover:text-white'
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
    </>
  );
}

interface LeafItemProps {
  item: MenuItem;
  active: boolean;
  isCollapsed: boolean;
  paddingLeft: number;
  onToggle: () => void;
}

function LeafItem({ item, active, isCollapsed, paddingLeft, onToggle }: Readonly<LeafItemProps>) {
  const content = (
    <div
      className={`group relative w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl transition-colors ${
        active ? ACTIVE_CLASSES : INACTIVE_CLASSES
      }`}
      style={isCollapsed ? undefined : { paddingLeft: `${paddingLeft + 1}rem` }}
      title={isCollapsed ? item.label : undefined}
    >
      <ItemContent item={item} highlighted={active} isCollapsed={isCollapsed} />
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} onClick={onToggle} className="block w-full">
        {content}
      </Link>
    );
  }

  if (item.onClick) {
    return (
      <button
        onClick={() => {
          item.onClick?.();
          onToggle();
        }}
        className="w-full text-left"
      >
        {content}
      </button>
    );
  }

  return content;
}

export function Dropdown({
  item,
  isOpen,
  onToggle,
  level = 0,
  isCollapsed = false,
}: Readonly<DropdownProps>) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  const children = item.children ?? [];
  const paddingLeft = level * 1.5; // rem

  // Item "folha" (sem filhos): link / ação
  if (children.length === 0) {
    const leafActive = item.href ? isRouteActive(pathname, item.href) : false;
    return (
      <LeafItem
        item={item}
        active={leafActive}
        isCollapsed={isCollapsed}
        paddingLeft={paddingLeft}
        onToggle={onToggle}
      />
    );
  }

  const isActive = hasActiveDescendant(item, pathname);
  const isActuallyExpanded = isExpanded || (!isCollapsed && isActive);

  return (
    <div ref={dropdownRef} className="w-full group relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold rounded-xl transition-colors ${
          isActuallyExpanded || isActive ? ACTIVE_CLASSES : INACTIVE_CLASSES
        } ${isCollapsed ? 'justify-center' : ''}`}
        style={isCollapsed ? undefined : { paddingLeft: `${paddingLeft + 1}rem` }}
        title={isCollapsed ? item.label : undefined}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <ItemContent item={item} highlighted={isExpanded || isActive} isCollapsed={isCollapsed} />
        </div>
        {!isCollapsed && (
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform flex-shrink-0 ${
              isActuallyExpanded ? 'transform rotate-180' : ''
            }`}
          />
        )}
      </button>
      {/* Tooltip no hover quando colapsado */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
          {item.label}
        </div>
      )}

      {isActuallyExpanded && !isCollapsed && (
        <div className="mt-1 space-y-1">
          {children.map((child) => (
            <Dropdown
              key={child.id}
              item={child}
              isOpen={isOpen}
              onToggle={onToggle}
              level={level + 1}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
