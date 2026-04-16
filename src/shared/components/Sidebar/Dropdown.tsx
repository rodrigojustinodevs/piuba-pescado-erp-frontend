'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MenuItem } from './types';

// Ícone de seta para baixo
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
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

export function Dropdown({
  item,
  isOpen,
  onToggle,
  level = 0,
  isCollapsed = false,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const hasChildren = item.children && item.children.length > 0;
  const paddingLeft = level * 1.5; // rem

  const isRouteActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const hasActiveDescendant = (node: MenuItem): boolean => {
    if (node.href && isRouteActive(node.href)) return true;
    if (!node.children || node.children.length === 0) return false;
    return node.children.some(hasActiveDescendant);
  };

  const isActive = hasActiveDescendant(item);
  const isActuallyExpanded = isExpanded || (!isCollapsed && isActive);
  const itemStateClasses =
    isActuallyExpanded || isActive
      ? 'bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)]'
      : 'text-white/85 hover:bg-white/10 hover:text-white';

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  // Item "folha" (sem filhos): link / ação
  if (!hasChildren) {
    const leafActive = item.href ? isRouteActive(item.href) : false;
    const leafClasses = `group relative w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl transition-colors ${
      leafActive
        ? 'bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)]'
        : 'text-white/85 hover:bg-white/10 hover:text-white'
    }`;

    const leafContent = (
      <div
        className={leafClasses}
        style={!isCollapsed ? { paddingLeft: `${paddingLeft + 1}rem` } : undefined}
        title={isCollapsed ? item.label : undefined}
      >
        {item.icon && (
          <span
            className={`grid h-5 w-5 place-items-center flex-shrink-0 transition-colors ${
              leafActive
                ? 'text-[color:var(--sidebar-accent-foreground)]'
                : 'text-white/70 group-hover:text-white'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
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
      </div>
    );

    if (item.href) {
      return (
        <Link href={item.href} onClick={onToggle} className="block w-full">
          {leafContent}
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
          {leafContent}
        </button>
      );
    }

    return leafContent;
  }

  return (
    <div ref={dropdownRef} className="w-full group relative">
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold rounded-xl transition-colors ${itemStateClasses} ${
          isCollapsed ? 'justify-center' : ''
        }`}
        style={!isCollapsed ? { paddingLeft: `${paddingLeft + 1}rem` } : undefined}
        title={isCollapsed ? item.label : undefined}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          {item.icon && (
            <span
              className={`grid h-5 w-5 place-items-center flex-shrink-0 transition-colors ${
                isExpanded || isActive
                  ? 'text-[color:var(--sidebar-accent-foreground)]'
                  : 'text-white/70 group-hover:text-white'
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
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
        </div>
        {hasChildren && !isCollapsed && (
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

      {hasChildren && isActuallyExpanded && !isCollapsed && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
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
