import React from 'react';

interface BarComparisonProps {
  label: string;
  yourValue: number;
  peerValue: number;
  topValue?: number;
  suffix?: string;
  format?: (n: number) => string;
}

export function BarComparison({ label, yourValue, peerValue, topValue, suffix = '', format }: BarComparisonProps) {
  const fmt = format || ((n: number) => `${n}${suffix}`);
  const max = Math.max(yourValue, peerValue, topValue || 0) * 1.1;
  const youPct = (yourValue / max) * 100;
  const peerPct = (peerValue / max) * 100;
  const topPct = topValue !== undefined ? (topValue / max) * 100 : 0;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-primary">{label}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <BarRow label="You" value={fmt(yourValue)} pct={youPct} fillClass="bg-accent" labelStrong />
        <BarRow label="Peer avg" value={fmt(peerValue)} pct={peerPct} fillClass="bg-border-subtle" />
        {topValue !== undefined && <BarRow label="Top quartile" value={fmt(topValue)} pct={topPct} fillClass="bg-border-subtle" />}
      </div>
    </div>
  );
}

function BarRow({ label, value, pct, fillClass, labelStrong }: { label: string; value: string; pct: number; fillClass: string; labelStrong?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-[12px] w-20 ${labelStrong ? 'text-primary font-medium' : 'text-muted'}`}>{label}</span>
      <div className="flex-1 h-2 bg-surface-muted rounded-sm overflow-hidden">
        <div className={`h-full rounded-sm ${fillClass}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[12px] w-16 text-right ${labelStrong ? 'text-primary font-medium' : 'text-secondary'}`}>{value}</span>
    </div>
  );
}
