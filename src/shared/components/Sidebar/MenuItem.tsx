"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MenuItem as MenuItemType } from "./types";
import { Dropdown } from "./Dropdown";

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

  // Se está colapsado e tem filhos, não mostra dropdown
  if (isCollapsed && item.children && item.children.length > 0) {
    return (
      <div
        className="group relative"
        title={item.label}
      >
        <div
          className={`flex items-center justify-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          {item.icon && <span className="w-5 h-5">{item.icon}</span>}
        </div>
        {/* Tooltip no hover quando colapsado */}
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
          {item.label}
        </div>
      </div>
    );
  }

  // Se tem filhos, renderiza como dropdown
  if (item.children && item.children.length > 0) {
    return (
      <Dropdown
        item={item}
        isOpen={isOpen}
        onToggle={onToggle}
        isCollapsed={isCollapsed}
      />
    );
  }

  // Item simples com link ou onClick
  const content = (
    <div
      className={`group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      } ${isCollapsed ? "justify-center" : ""}`}
    >
      {item.icon && (
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl flex-shrink-0 transition-colors ${
            isActive
              ? "bg-emerald-100/70 text-emerald-700"
              : "bg-slate-100 text-slate-600 group-hover:bg-slate-200/70 group-hover:text-slate-800"
          }`}
        >
          <span className="w-5 h-5">{item.icon}</span>
        </span>
      )}
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
              {item.badge}
            </span>
          )}
        </>
      )}
      {/* Tooltip no hover quando colapsado */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
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

