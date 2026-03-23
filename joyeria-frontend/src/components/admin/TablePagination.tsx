import React from 'react';

/** Maximum rows per table page (admin requirement). */
export const ADMIN_TABLE_PAGE_SIZE = 10;

export interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  /** Singular noun for the summary line, e.g. "product" / "order" */
  itemNoun?: string;
}

/**
 * Footer controls for admin data tables: shows range summary + prev/next + page numbers.
 */
export default function TablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  itemNoun = 'row',
}: TablePaginationProps) {
  if (totalItems === 0) return null;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, totalItems);

  const plural = totalItems === 1 ? itemNoun : `${itemNoun}s`;

  const go = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    if (next !== safePage) onPageChange(next);
  };

  const maxButtons = 5;
  let startPage = Math.max(1, safePage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-3 border-t border-gold-200/60 dark:border-gold-500/20 bg-gold-50/30 dark:bg-night-700/40 text-sm text-gray-700 dark:text-gray-300">
      <p className="tabular-nums">
        Showing <span className="font-semibold text-marrGold">{from}</span>–
        <span className="font-semibold text-marrGold">{to}</span> of{' '}
        <span className="font-semibold text-marrGold">{totalItems}</span> {plural}
      </p>
      <nav className="flex flex-wrap items-center justify-end gap-2" aria-label="Table pagination">
        <button
          type="button"
          onClick={() => go(safePage - 1)}
          disabled={safePage <= 1}
          className="px-3 py-1.5 rounded-lg border border-gold-200 dark:border-gold-500/30 text-gold-800 dark:text-gold-300 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-night-600 transition-colors"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {pageNumbers.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => go(n)}
              className={`min-w-[2.25rem] py-1.5 rounded-lg text-sm font-medium transition-colors ${
                n === safePage
                  ? 'bg-gold-500 text-white'
                  : 'border border-gold-200 dark:border-gold-500/30 text-gold-800 dark:text-gold-300 hover:bg-white dark:hover:bg-night-600'
              }`}
              aria-current={n === safePage ? 'page' : undefined}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(safePage + 1)}
          disabled={safePage >= totalPages}
          className="px-3 py-1.5 rounded-lg border border-gold-200 dark:border-gold-500/30 text-gold-800 dark:text-gold-300 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-night-600 transition-colors"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
