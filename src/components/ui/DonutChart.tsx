// Phase 6 (second pass): refined DonutChart.
// Thinner ring + printed inner border + tabular legend. Center label/value
// is rendered as HTML instead of SVG text so the serif display face shows
// correctly without needing an embedded font.

import React from 'react';

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({
  data,
  size = 140,
  thickness = 14,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const total = data.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const innerRadius = radius - thickness / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  return (
    <div className="flex items-center gap-6">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="block">
          {/* Printed outer rule so the ring has a crisp edge. */}
          <circle cx={cx} cy={cy} r={radius + thickness / 2} fill="none" stroke="#D6D0C7" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={innerRadius} fill="none" stroke="#D6D0C7" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#ECE8E1" strokeWidth={thickness} />
          {data.map((s, i) => {
            const fraction = s.value / total;
            const dash = circumference * fraction;
            const gap = circumference - dash;
            const offset = -accumulated * circumference;
            accumulated += fraction;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            );
          })}
        </svg>
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {centerValue && (
              <p className="font-serif font-semibold text-primary text-[22px] leading-none tracking-tight tabular-nums">
                {centerValue}
              </p>
            )}
            {centerLabel && (
              <p className="eyebrow-plain mt-1.5">{centerLabel}</p>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {data.map((s) => {
          const pct = Math.round((s.value / total) * 100);
          return (
            <div key={s.label} className="flex items-center gap-2.5 text-[12px]">
              <div
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0 border border-border-default/30"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-secondary truncate flex-1">{s.label}</span>
              <span className="text-primary font-semibold tabular-nums">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
