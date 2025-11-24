"use client";

import { useState, useRef, useEffect } from "react";
import type { MenuItem } from "./types";

// Ícone de seta para baixo
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

interface DropdownProps {
  item: MenuItem;
  isOpen: boolean;
  onToggle: () => void;
  level?: number;
  isCollapsed?: boolean;
}

export function Dropdown({ item, isOpen, onToggle, level = 0, isCollapsed = false }: DropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const hasChildren = item.children && item.children.length > 0;
  const paddingLeft = level * 1.5; // rem

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div ref={dropdownRef} className="w-full group relative">
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          isExpanded
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        } ${isCollapsed ? "justify-center" : ""}`}
        style={!isCollapsed ? { paddingLeft: `${paddingLeft + 1}rem` } : undefined}
        title={isCollapsed ? item.label : undefined}
      >
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
          {item.icon && <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>}
          {!isCollapsed && (
            <>
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </div>
        {hasChildren && !isCollapsed && (
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform flex-shrink-0 ${
              isExpanded ? "transform rotate-180" : ""
            }`}
          />
        )}
      </button>
      {/* Tooltip no hover quando colapsado */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
          {item.label}
        </div>
      )}

      {hasChildren && isExpanded && !isCollapsed && (
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

