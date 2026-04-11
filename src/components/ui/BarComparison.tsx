// Phase 6: refined BarComparison.
// A three-row comparison (You / Peer avg / Top quartile) with printed ticks.
// The "You" row reads strongest in the Ekko accent, the peer and top rows
// sit on muted fills so the eye anchors to your number.

import React from 'react';

interface BarComparisonProps {
  label: string;
  yourValue: number;
  peerValue: number;
  topValue?: number;
  suffix?: string;
  format?: (n: number) => string;
}

export function BarComparison({
  label,
  yourValue,
  peerValue,
  topValue,
  suffix = '',
  format,
}: BarComparisonProps) {
  const fmt = format || ((n: number) => `${n}${suffix}`);
  const max = Math.max(yourValue, peerValue, topValue || 0) * 1.12;
  const youPct = (yourValue / max) * 100;
  const peerPct = (peerValue / max) * 100;
  const topPct = topValue !== undefined ? (topValue / max) * 100 : 0;

  const diff = yourValue - peerValue;
  const ahead = diff >= 0;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-medium text-primary">{label}</span>
        <span className={`text-[11px] font-medium tabular-nums ${ahead ? 'text-success' : 'text-danger'}`}>
          {ahead ? '+' : ''}{diff.toFixed(1)}{suffix} vs peers
        </span>
      </div>
      <div className="flex flex-col gap-[5px]">
        <BarRow label="You" value={fmt(yourValue)} pct={youPct} tone="strong" />
        <BarRow label="Peer avg" value={fmt(peerValue)} pct={peerPct} tone="muted" />
        {topValue !== undefined && (
          <BarRow label="Top quartile" value={fmt(topValue)} pct={topPct} tone="muted" dashed />
        )}
      </div>
    </div>
  );
}

function BarRow({
  label,
  value,
  pct,
  tone,
  dashed,
}: {
  label: string;
  value: string;
  pct: number;
  tone: 'strong' | 'muted';
  dashed?: boolean;
}) {
  const labelCls = tone === 'strong' ? 'text-primary font-medium' : 'text-muted';
  const valueCls = tone === 'strong' ? 'text-primary font-medium' : 'text-secondary';
  return (
    <div className="flex items-center gap-3">
      <span className={`text-[11px] w-[74px] tracking-wide ${labelCls}`}>{label}</span>
      <div className="flex-1 h-[7px] bg-surface-muted/70 rounded-sm overflow-hidden border border-border-subtle/60 relative">
        {dashed ? (
          <div
            className="absolute inset-y-0 left-0 border-r-[1.5px] border-dashed border-primary/60"
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        ) : (
          <div
            className={`h-full ${tone === 'strong' ? 'bg-accent' : 'bg-border-subtle'}`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      <span className={`text-[11px] w-16 text-right tabular-nums ${valueCls}`}>{value}</span>
    </div>
  );
}
