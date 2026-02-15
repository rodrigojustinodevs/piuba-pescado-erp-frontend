'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
} from './AppIcons';

export function Pagination({
  page,
  limit,
  total,
  itemLabelPlural,
  onPageChange,
}: {
  page: number;
  limit: number;
  total: number;
  itemLabelPlural: string;
  onPageChange: (nextPage: number) => void;
}) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const visiblePages = Math.min(3, totalPages);

  return (
    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
      <div className="text-sm text-slate-600">
        Mostrando {start}-{end} de {total} {itemLabelPlural}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Primeira página"
        >
          <DoubleChevronLeftIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {Array.from({ length: visiblePages }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                page === pageNum ? 'bg-[#0EA5A4] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page * limit >= total}
          className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Próxima página"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page * limit >= total}
          className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Última página"
        >
          <DoubleChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
