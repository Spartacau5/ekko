import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize }: PaginationProps) {
  const start = pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const end = pageSize && totalItems ? Math.min(currentPage * pageSize, totalItems) : null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      {totalItems !== undefined && start !== null && end !== null && (
        <p className="text-[13px] text-muted">
          Showing <span className="text-primary font-medium">{start}</span>–<span className="text-primary font-medium">{end}</span> of <span className="text-primary font-medium">{totalItems}</span>
        </p>
      )}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="w-8 h-8 flex items-center justify-center text-secondary rounded-sm
            transition-colors duration-150 ease-out
            hover:text-primary hover:bg-surface-muted
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-page focus-visible:ring-border-default
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) => (
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted text-[13px]">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`w-8 h-8 flex items-center justify-center text-[13px] font-medium rounded-sm
                transition-colors duration-150 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-page focus-visible:ring-border-default
                ${p === currentPage
                  ? 'bg-accent text-primary border border-border-default'
                  : 'text-secondary hover:text-primary hover:bg-surface-muted'
                }`}
            >
              {p}
            </button>
          )
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="w-8 h-8 flex items-center justify-center text-secondary rounded-sm
            transition-colors duration-150 ease-out
            hover:text-primary hover:bg-surface-muted
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-page focus-visible:ring-border-default
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
