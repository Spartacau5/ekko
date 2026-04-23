// Phase 6: refined sparkline.
// A quieter, more editorial sparkline. The default fill is a soft neutral
// wash (not the yellow accent) so sparklines sit beside stats without
// competing for attention. The yellow is reserved for the end-dot, where
// it functions as a read-mark.
//
// Props stay the same as before so existing callers work unchanged.

import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  showFill?: boolean;
  endDot?: boolean;
  strokeWidth?: number;
}

export function Sparkline({
  data,
  width = 100,
  height = 28,
  color = '#262626',
  fillColor = '#D9D9E1',
  showFill = true,
  endDot = true,
  strokeWidth = 1.25,
}: SparklineProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * w;
    const y = padding + h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');
  const fillPath = `M ${padding},${height - padding} L ${points.join(' L ')} L ${width - padding},${height - padding} Z`;
  const [endX, endY] = points[points.length - 1].split(',').map(parseFloat);

  return (
    <svg
      width={width}
      height={height}
      className="block"
      role="img"
      aria-label="Trend sparkline"
    >
      {showFill && (
        <path d={fillPath} fill={fillColor} fillOpacity={0.35} />
      )}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {endDot && (
        <>
          {/* Orange accent ring + dark center — the only place the accent lives. */}
          <circle cx={endX} cy={endY} r={3} fill="#F24A14" />
          <circle cx={endX} cy={endY} r={1.5} fill={color} />
        </>
      )}
    </svg>
  );
}
