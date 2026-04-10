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
}

export function BarChart({ data, height = 160, format }: BarChartProps) {
  const fmt = format || ((n: number) => n.toLocaleString());
  const max = Math.max(...data.map(d => Math.max(d.value, d.target || 0))) * 1.15;

  return (
    <div className="w-full">
      <div className="flex items-end gap-3 px-2" style={{ height }}>
        {data.map((d, i) => {
          const valuePct = (d.value / max) * 100;
          const targetPct = d.target ? (d.target / max) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end relative" style={{ height: '100%' }}>
              {d.target && (
                <div
                  className="absolute left-0 right-0 border-t border-dashed border-secondary opacity-60"
                  style={{ bottom: `${targetPct}%` }}
                />
              )}
              <div
                className="w-full bg-accent border border-border-default rounded-t-sm"
                style={{ height: `${valuePct}%`, minHeight: 4 }}
                title={fmt(d.value)}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-start gap-3 px-2 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <p className="text-[12px] font-medium text-secondary">{d.label}</p>
            <p className="text-[11px] text-muted">{fmt(d.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
