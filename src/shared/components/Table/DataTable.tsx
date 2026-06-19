'use client';

import { useMemo, useState, ReactNode } from 'react';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { Card, CardContent } from '@/shared/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/Table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/DropdownMenu/dropdown-menu';
import { Button } from '@/shared/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';

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
  showPagination?: boolean;
  initialPerPage?: number;
  perPageOptions?: number[];
};

const PER_PAGE_OPTIONS = [10, 25, 50];

const ALIGN_CLASS: Record<DataTableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function DataTable<T>({
  data,
  columns,
  getRowId,
  rowActions,
  emptyState,
  showPagination = false,
  initialPerPage = 25,
  perPageOptions = PER_PAGE_OPTIONS,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const hasActionsColumn = Boolean(rowActions);
  const totalColumns = columns.length + (hasActionsColumn ? 1 : 0);

  const totalPages = useMemo(() => {
    if (!showPagination) return 1;
    return Math.max(1, Math.ceil(data.length / perPage));
  }, [showPagination, data.length, perPage]);
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    if (!showPagination) return data;
    return data.slice((safeCurrentPage - 1) * perPage, safeCurrentPage * perPage);
  }, [showPagination, data, safeCurrentPage, perPage]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
        {emptyState ?? <p>Nenhum registro encontrado.</p>}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.id}
                className={`${ALIGN_CLASS[col.align ?? 'left']} ${col.headerClassName ?? ''}`}
              >
                {col.header}
              </TableHead>
            ))}
            {hasActionsColumn && <TableHead className="w-[50px]"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={totalColumns} className="h-24 text-center text-muted-foreground">
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((row) => (
              <TableRow key={getRowId(row)} className="group">
                {columns.map((col) => (
                  <TableCell
                    key={`${getRowId(row)}-${col.id}`}
                    className={`${ALIGN_CLASS[col.align ?? 'left']} ${col.cellClassName ?? ''}`}
                  >
                    {col.cell(row)}
                  </TableCell>
                ))}
                {hasActionsColumn && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {rowActions?.(row).map((action, index) => {
                          const key = action.id ?? `${action.label}-${index}`;
                          const className = `gap-2 ${
                            action.variant === 'danger' ? 'text-destructive' : ''
                          }`;

                          if (action.href) {
                            return (
                              <DropdownMenuItem
                                key={key}
                                className={className}
                                onClick={() => action.onClick?.()}

                              >
                                {action.icon}
                                {action.label}
                              </DropdownMenuItem>
                            );
                          }

                          return (
                            <DropdownMenuItem
                              key={key}
                              className={className}
                              disabled={action.disabled}
                              onClick={action.onClick}
                            >
                              {action.icon}
                              {action.label}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {showPagination && (
        <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-3 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Exibir</span>
            <Select
              value={String(perPage)}
              onValueChange={(value) => {
                setPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>
              de {data.length} {data.length === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {safeCurrentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
