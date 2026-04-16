import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Sparkline } from '../ui/Sparkline';

// KPI card: label, big value, sparkline, signed percent trend, drill-through
// link. Text-only trend (no arrow icon) per the sketch.

interface KpiCardProps {
  id: string;
  label: string;
  value: string;
  delta: number;
  deltaLabel?: string;
  trend: number[];
  link?: string;
}

export function KpiCard({ label, value, delta, deltaLabel, trend, link }: KpiCardProps) {
  const positive = delta >= 0;
  const card = (
    <div className="group h-full bg-surface border border-border-subtle rounded-md p-5 flex flex-col gap-3
      transition-[border-color,background-color] duration-150 ease-out
      hover:border-border-default hover:bg-surface-muted/20">
      <div className="flex items-start justify-between">
        <p className="text-[13px] text-secondary">{label}</p>
        {link && (
          <ArrowUpRight
            size={14}
            className="text-muted opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform] duration-150"
          />
        )}
      </div>
      <p className="text-[32px] leading-none font-semibold text-primary tabular-nums tracking-tight">{value}</p>
      <div className="flex items-end justify-between gap-3 mt-auto">
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-medium tabular-nums ${positive ? 'text-success' : 'text-danger'}`}>
            {positive ? '+' : ''}{delta.toFixed(1)}%
          </p>
          <p className="text-[11px] text-muted mt-0.5">{deltaLabel || 'Compared to last month'}</p>
        </div>
        <div className="w-[110px] shrink-0">
          <Sparkline data={trend} height={30} color={positive ? '#0E7C66' : '#A14A3B'} />
        </div>
      </div>
    </div>
  );
  if (link) {
    return <Link to={link} className="no-underline block h-full">{card}</Link>;
  }
  return card;
}
