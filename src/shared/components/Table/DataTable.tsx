"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export type DataTableAlign = "left" | "right";

export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  align?: DataTableAlign;
  headerClassName?: string;
  cellClassName?: string;
  cell: (row: T) => React.ReactNode;
};

export type DataTableAction = {
  id?: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
  disabled?: boolean;
};

type MenuPosition =
  | null
  | {
      right: number;
      top?: number;
      bottom?: number;
    };

export type DataTableProps<T> = {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  getRowId: (row: T) => string;
  rowActions?: (row: T) => DataTableAction[];
  actionsHeader?: React.ReactNode;
  emptyState?: React.ReactNode;
};

function KebabIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      />
    </svg>
  );
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  rowActions,
  actionsHeader = "Ações",
  emptyState,
}: DataTableProps<T>) {
  const hasActions = Boolean(rowActions);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>(null);

  useEffect(() => {
    if (!openMenuId) return;

    const handle = () => {
      setOpenMenuId(null);
      setMenuPosition(null);
    };

    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle, true);
      window.removeEventListener("resize", handle);
    };
  }, [openMenuId]);

  const resolvedColumns = useMemo(() => {
    const cols = [...columns];
    if (hasActions) {
      cols.push({
        id: "__actions__",
        header: actionsHeader,
        align: "right",
        headerClassName:
          "px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider",
        cellClassName: "px-6 py-4 whitespace-nowrap text-right",
        cell: () => null,
      } satisfies DataTableColumn<T>);
    }
    return cols;
  }, [actionsHeader, columns, hasActions]);

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        {emptyState ?? "Nenhum registro encontrado."}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {resolvedColumns.map((col) => (
              <th
                key={col.id}
                className={
                  col.headerClassName ??
                  `px-6 py-3 text-${col.align === "right" ? "right" : "left"} text-xs font-semibold text-slate-500 uppercase tracking-wider`
                }
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.map((row) => {
            const rowId = getRowId(row);
            const actions = rowActions?.(row) ?? [];

            return (
              <tr key={rowId} className="hover:bg-slate-50 transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={
                      col.cellClassName ??
                      `px-6 py-4 whitespace-nowrap text-${col.align === "right" ? "right" : "left"}`
                    }
                  >
                    {col.cell(row)}
                  </td>
                ))}

                {hasActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          const nextId = openMenuId === rowId ? null : rowId;
                          setOpenMenuId(nextId);

                          if (!nextId) {
                            setMenuPosition(null);
                            return;
                          }

                          const rect = (
                            e.currentTarget as HTMLButtonElement
                          ).getBoundingClientRect();
                          const spaceBelow = window.innerHeight - rect.bottom;
                          const shouldOpenUp = spaceBelow < 220;
                          const right = Math.max(8, window.innerWidth - rect.right);

                          setMenuPosition(
                            shouldOpenUp
                              ? { right, bottom: window.innerHeight - rect.top + 8 }
                              : { right, top: rect.bottom + 8 }
                          );
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Ações"
                      >
                        <KebabIcon />
                      </button>

                      {openMenuId === rowId && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => {
                              setOpenMenuId(null);
                              setMenuPosition(null);
                            }}
                          />
                          <div
                            className="fixed z-20 w-48 rounded-lg border border-slate-200 bg-white shadow-lg"
                            style={menuPosition ?? { right: 8, top: 8 }}
                          >
                            <div className="py-1">
                              {actions.map((action, idx) => {
                                const key = action.id ?? `${rowId}-${idx}-${action.label}`;
                                const baseClass =
                                  action.variant === "danger"
                                    ? "text-red-600 hover:bg-red-50"
                                    : "text-slate-700 hover:bg-slate-50";
                                const common =
                                  "flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed";

                                if (action.href) {
                                  return (
                                    <Link
                                      key={key}
                                      href={action.href}
                                      className={`${common} ${baseClass}`}
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        setMenuPosition(null);
                                      }}
                                    >
                                      {action.icon}
                                      {action.label}
                                    </Link>
                                  );
                                }

                                return (
                                  <button
                                    key={key}
                                    type="button"
                                    className={`${common} ${baseClass} w-full`}
                                    disabled={action.disabled}
                                    onClick={() => {
                                      action.onClick?.();
                                      setOpenMenuId(null);
                                      setMenuPosition(null);
                                    }}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

