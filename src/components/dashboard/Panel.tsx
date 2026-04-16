import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

// Reusable dashboard panel. Fixed-height variants scroll internally so the
// dashboard stays rhythmically aligned regardless of how many rows a panel
// holds. The optional `viewAllLink` renders a small arrow-button in the
// header per the sketch.

interface PanelProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  viewAllLink?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  /**
   * Fixed inner body height. When set, body content scrolls if taller.
   * Leave undefined for natural-height panels.
   */
  bodyHeight?: number | string;
  /**
   * Remove the default body padding (for panels that render a divided list
   * edge-to-edge, like activity feeds).
   */
  flushBody?: boolean;
  className?: string;
}

export function Panel({
  title,
  subtitle,
  eyebrow,
  viewAllLink,
  headerRight,
  children,
  bodyHeight,
  flushBody = false,
  className = '',
}: PanelProps) {
  return (
    <div
      className={`bg-surface border border-border-subtle rounded-md overflow-hidden flex flex-col ${className}`}
    >
      <div className="px-5 py-4 border-b border-border-subtle flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
          <h3 className="text-[15px] font-semibold text-primary leading-tight tracking-tight">
            {title}
          </h3>
          {subtitle && <p className="text-[12px] text-muted mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {headerRight}
          {viewAllLink && (
            <Link
              to={viewAllLink}
              aria-label={`View all ${title.toLowerCase()}`}
              className="w-7 h-7 flex items-center justify-center rounded-sm border border-border-subtle text-muted hover:text-primary hover:border-border-default hover:bg-surface-muted/60 transition-[background-color,border-color,color] duration-150 no-underline"
            >
              <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
      </div>
      <div
        className={`${flushBody ? '' : 'p-3'} ${bodyHeight !== undefined ? 'overflow-y-auto' : ''}`}
        style={bodyHeight !== undefined ? { height: typeof bodyHeight === 'number' ? `${bodyHeight}px` : bodyHeight } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
