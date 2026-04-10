import React from 'react';
import { Sparkline } from './Sparkline';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPIProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  trend?: number[];
  className?: string;
}

export function KPI({ label, value, delta, deltaLabel, trend, className = '' }: KPIProps) {
  const isPositive = delta !== undefined && delta >= 0;
  return (
    <div className={`bg-surface border border-border-subtle rounded-md p-5 ${className}`}>
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-end justify-between gap-3 mb-2">
        <p className="text-[32px] leading-[36px] font-semibold text-primary">{value}</p>
        {trend && <Sparkline data={trend} width={88} height={28} />}
      </div>
      {delta !== undefined && (
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp size={13} className="text-success" />
          ) : (
            <TrendingDown size={13} className="text-danger" />
          )}
          <span className={`text-[13px] font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? '+' : ''}{delta.toFixed(1)}%
          </span>
          {deltaLabel && <span className="text-[13px] text-muted">{deltaLabel}</span>}
        </div>
      )}
    </div>
  );
}
