// Phase 6: refined BarChart.
// Restrained, editorial bar chart. A printed baseline rule, narrow bars with
// a soft fill, an optional dashed target line, and tight tabular number
// labels underneath. Designed to sit calmly inside a card — not to dominate.

import React from 'react';

interface BarChartDataPoint {
  label: string;
  value: number;
  target?: number;
}

interface BarChartProps {
  data: BarChartDataPoint[];
  height?: number;
  format?: (n: number) => string;
  showTargetLegend?: boolean;
}

export function BarChart({ data, height = 160, format, showTargetLegend = true }: BarChartProps) {
  const fmt = format || ((n: number) => n.toLocaleString());
  const hasTarget = data.some((d) => d.target !== undefined);
  const max = Math.max(...data.map((d) => Math.max(d.value, d.target || 0))) * 1.18;

  return (
    <figure className="w-full">
      <div
        className="relative flex items-end gap-2.5 px-1 border-b border-border-subtle"
        style={{ height }}
      >
        {/* Subtle horizontal grid lines — 3 neutral rules at 25 / 50 / 75 %. */}
        {[0.25, 0.5, 0.75].map((ratio) => (
          <div
            key={ratio}
            className="absolute inset-x-0 border-t border-dashed border-border-subtle/70 pointer-events-none"
            style={{ bottom: `${ratio * 100}%` }}
          />
        ))}
        {data.map((d, i) => {
          const valuePct = Math.max(0, (d.value / max) * 100);
          const targetPct = d.target ? (d.target / max) * 100 : 0;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end relative group"
              style={{ height: '100%' }}
            >
              {d.target !== undefined && (
                <div
                  className="absolute left-[-2px] right-[-2px] border-t-[1.5px] border-dashed border-primary/70"
                  style={{ bottom: `${targetPct}%` }}
                  title={`Target: ${fmt(d.target)}`}
                />
              )}
              <div
                className="w-full bg-accent-soft border border-accent/60 group-hover:bg-accent transition-colors duration-150 ease-out rounded-t-[2px]"
                style={{ height: `${valuePct}%`, minHeight: 3 }}
                title={fmt(d.value)}
              />
            </div>
          );
        })}
      </div>
      <figcaption className="flex items-start gap-2.5 px-1 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <p className="text-[11px] font-medium text-secondary leading-tight">{d.label}</p>
            <p className="text-[11px] text-muted tabular-nums leading-tight mt-0.5">{fmt(d.value)}</p>
          </div>
        ))}
      </figcaption>
      {hasTarget && showTargetLegend && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border-subtle text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-[8px] bg-accent-soft border border-accent/60" /> Actual
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-4 border-t-[1.5px] border-dashed border-primary/70" /> Target
          </span>
        </div>
      )}
    </figure>
  );
}
