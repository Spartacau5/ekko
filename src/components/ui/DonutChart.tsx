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

export function DonutChart({ data, size = 140, thickness = 16, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} className="block">
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
        {centerValue && (
          <text x={cx} y={cy - 2} textAnchor="middle" fontFamily="Inter" fontSize="20" fontWeight="600" fill="#111111">
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text x={cx} y={cy + 14} textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#7A756E">
            {centerLabel}
          </text>
        )}
      </svg>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {data.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[13px]">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-secondary truncate flex-1">{s.label}</span>
            <span className="text-primary font-medium">{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
