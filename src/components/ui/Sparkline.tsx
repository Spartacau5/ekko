// Phase 6: refined sparkline.
// A quieter, more editorial sparkline. The default fill is a soft neutral
// wash (not the yellow accent) so sparklines sit beside stats without
// competing for attention. The yellow is reserved for the end-dot, where
// it functions as a read-mark.
//
// Props stay the same as before so existing callers work unchanged.

import React, { useEffect, useId, useRef, useState } from 'react';

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
  // Hooks must run on every render, before any early returns.
  const lineRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const clipId = useId();

  // Compute the geometry. We tolerate empty data here so the hooks above stay
  // unconditional; the early return below skips rendering when there's nothing
  // to draw.
  const min = data && data.length ? Math.min(...data) : 0;
  const max = data && data.length ? Math.max(...data) : 1;
  const range = max - min || 1;
  const padding = 2;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const points = (data ?? []).map((v, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * w;
    const y = padding + h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');
  const linePath = points.length ? `M ${points.join(' L ')}` : '';
  const fillPath = points.length
    ? `M ${padding},${height - padding} L ${points.join(' L ')} L ${width - padding},${height - padding} Z`
    : '';
  const [endX, endY] = points.length
    ? points[points.length - 1].split(',').map(parseFloat)
    : [0, 0];

  // Kick off the draw-in animation once the path is in the DOM. Re-runs when
  // the data shape changes.
  useEffect(() => {
    if (!polyline) return;
    if (lineRef.current) {
      const len = lineRef.current.getTotalLength();
      setPathLen(len);
      const id = requestAnimationFrame(() => setDrawn(true));
      return () => cancelAnimationFrame(id);
    }
  }, [polyline]);

  if (!data || data.length === 0) return null;

  return (
    <svg
      width={width}
      height={height}
      className="block"
      role="img"
      aria-label="Trend sparkline"
    >
      {/* Reveal the soft fill in sync with the stroke by clipping it to a
          rectangle whose width is animated 0 → full. */}
      {showFill && (
        <>
          <defs>
            <clipPath id={clipId}>
              <rect
                x={0}
                y={0}
                width={drawn ? width : 0}
                height={height}
                style={{ transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </clipPath>
          </defs>
          <path d={fillPath} fill={fillColor} fillOpacity={0.35} clipPath={`url(#${clipId})`} />
        </>
      )}
      <path
        ref={lineRef}
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={pathLen || undefined}
        strokeDashoffset={pathLen ? (drawn ? 0 : pathLen) : undefined}
        style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
      {/* Keep polyline available for screen readers / fallbacks but visually identical. */}
      <polyline points={polyline} fill="none" stroke="none" />
      {endDot && (
        <g style={{ opacity: drawn ? 1 : 0, transition: 'opacity 200ms ease-out 480ms' }}>
          {/* Orange accent ring + dark center — the only place the accent lives. */}
          <circle cx={endX} cy={endY} r={3} fill="#F24A14" />
          <circle cx={endX} cy={endY} r={1.5} fill={color} />
        </g>
      )}
    </svg>
  );
}
