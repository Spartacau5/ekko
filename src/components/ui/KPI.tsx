// Phase 6: refined KPI card.
// Tighter typographic rhythm — eyebrow label, large tabular number, trend
// sparkline, delta line. Sparklines are now neutral so the value reads first.
// The card has a 1px border and no shadow, matching the overall printed,
// editorial surface treatment used across the product.

import React from 'react';
import { Sparkline } from './Sparkline';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPIProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  trend?: number[];
  className?: string;
}

export function KPI({ label, value, delta, deltaLabel, trend, className = '' }: KPIProps) {
  const hasDelta = delta !== undefined && !Number.isNaN(delta);
  const isPositive = hasDelta && (delta as number) > 0;
  const isNegative = hasDelta && (delta as number) < 0;

  const deltaColor = isPositive
    ? 'text-success'
    : isNegative
      ? 'text-danger'
      : 'text-muted';

  const DeltaIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <div className={`bg-surface border border-border-subtle rounded-md p-5 ${className}`}>
      <p className="eyebrow-plain mb-3">{label}</p>
      <div className="flex items-end justify-between gap-3 mb-2.5">
        <p className="metric-display">{value}</p>
        {trend && (
          <div className="pb-1">
            <Sparkline data={trend} width={84} height={26} />
          </div>
        )}
      </div>
      {hasDelta ? (
        <div className="flex items-center gap-1.5 pt-2 border-t border-border-subtle">
          <DeltaIcon size={13} className={deltaColor} />
          <span className={`text-[13px] font-medium tabular-nums ${deltaColor}`}>
            {isPositive ? '+' : ''}{(delta as number).toFixed(1)}%
          </span>
          {deltaLabel && <span className="text-[13px] text-muted">{deltaLabel}</span>}
        </div>
      ) : deltaLabel ? (
        <div className="pt-2 border-t border-border-subtle">
          <span className="text-[13px] text-muted">{deltaLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
