'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';

export type DataTableAlign = 'left' | 'right' | 'center';

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  align?: DataTableAlign;
  headerClassName?: string;
  cellClassName?: string;
  cell: (row: T) => ReactNode;
};

export type DataTableAction = {
  id?: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: 'default' | 'danger';
  disabled?: boolean;
};

export type DataTableProps<T> = {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  getRowId: (row: T) => string;
  rowActions?: (row: T) => DataTableAction[];
  emptyState?: ReactNode;
};

const KebabIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
    />
  </svg>
);

interface ActionMenuProps {
  actions: DataTableAction[];
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  onClose: () => void;
}

function ActionMenu({ actions, triggerRef, isOpen, onClose }: ActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const MENU_WIDTH = 192;

      let left = rect.left + rect.width - MENU_WIDTH;
      if (left < 10) left = 10;

      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow < 200 ? rect.top - 10 : rect.bottom + 5;

      setTimeout(() => {
        setPosition({ top: top + window.scrollY, left: left + window.scrollX });
      }, 0);
    }
  }, [isOpen, triggerRef]);

  // Click Outside & Esc
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      className="fixed z-50 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-xl animate-in fade-in zoom-in-95 duration-100"
      style={{ top: position.top, left: position.left }}
    >
      {actions.map((action, idx) => {
        const key = action.id ?? `action-${idx}`;
        const className = `
          flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors
          ${action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50'}
          ${action.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        `;

        if (action.href) {
          return (
            <Link
              key={key}
              href={action.href}
              className={className}
              role="menuitem"
              onClick={onClose}
            >
              {action.icon && <span className="w-4 h-4">{action.icon}</span>}
              {action.label}
            </Link>
          );
        }

        return (
          <button
            key={key}
            onClick={() => {
              action.onClick?.();
              onClose();
            }}
            disabled={action.disabled}
            className={className}
            role="menuitem"
          >
            {action.icon && <span className="w-4 h-4">{action.icon}</span>}
            {action.label}
          </button>
        );
      })}
    </div>,
    document.body,
  );
}

function ActionCell({ actions }: { actions: DataTableAction[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  if (!actions.length) return <td className="px-6 py-4" />;

  return (
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-lg transition-colors ${
          isOpen
            ? 'bg-slate-100 text-slate-600'
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
        }`}
        aria-label="Opções"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <KebabIcon />
      </button>

      {isOpen && (
        <ActionMenu
          actions={actions}
          triggerRef={triggerRef}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </td>
  );
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  rowActions,
  emptyState,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
        {emptyState ?? <p>Nenhum registro encontrado.</p>}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  className={
                    col.headerClassName ??
                    `px-6 py-3 font-medium uppercase tracking-wider text-${col.align ?? 'left'}`
                  }
                >
                  {col.header}
                </th>
              ))}
              {rowActions && (
                <th scope="col" className="px-6 py-3 w-[1%] whitespace-nowrap">
                  <span className="sr-only">Ações</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {data.map((row) => {
              const rowId = getRowId(row);
              return (
                <tr key={rowId} className="hover:bg-slate-50/80 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className={
                        col.cellClassName ??
                        `px-6 py-4 whitespace-nowrap text-${col.align ?? 'left'} text-slate-700`
                      }
                    >
                      {col.cell(row)}
                    </td>
                  ))}

                  {rowActions && <ActionCell actions={rowActions(row)} />}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
