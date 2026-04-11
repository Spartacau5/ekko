// Phase 4.5: teaser benchmark for the Day 0 Peers page. Shows a single sample
// metric with a blurred/locked treatment. The point is to communicate "this is
// what comparing yourself to peers feels like" before opt-in.

import React from 'react';
import { Lock, TrendingUp } from 'lucide-react';

interface BenchmarkPreviewCardProps {
  label: string;
  yourValue: string;
  peerAverage: string;
  topQuartile: string;
  unit?: string;
}

export function BenchmarkPreviewCard({
  label,
  yourValue,
  peerAverage,
  topQuartile,
  unit = '',
}: BenchmarkPreviewCardProps) {
  return (
    <div className="bg-surface border border-dashed border-border-subtle rounded-md p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-surface-muted/40 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-medium text-muted uppercase tracking-wider">{label}</p>
          <Lock size={11} className="text-muted" />
        </div>

        <Row name="Your org" value={yourValue} unit={unit} highlight />
        <Row name="Peer average" value={peerAverage} unit={unit} obfuscated />
        <Row name="Top quartile" value={topQuartile} unit={unit} obfuscated />

        <div className="mt-3 pt-3 border-t border-border-subtle flex items-center gap-1.5 text-[11px] text-muted">
          <TrendingUp size={10} />
          <span>Real comparisons unlock once you opt in</span>
        </div>
      </div>
    </div>
  );
}

function Row({
  name,
  value,
  unit,
  highlight,
  obfuscated,
}: {
  name: string;
  value: string;
  unit: string;
  highlight?: boolean;
  obfuscated?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className={`text-[12px] ${highlight ? 'text-primary font-medium' : 'text-secondary'}`}>{name}</span>
      <span
        className={`text-[14px] font-semibold ${highlight ? 'text-primary' : 'text-secondary'} ${
          obfuscated ? 'blur-[3px] select-none' : ''
        }`}
      >
        {value}
        {unit}
      </span>
    </div>
  );
}
