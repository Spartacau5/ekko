// Phase 6 (second pass): refined SegmentedControl.
// A crisper, more printed segmented control. The active thumb has a real
// 1px border and a subtle printed shadow rather than a floaty rounded pill.

import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { motionDurations, motionEasings } from '../../lib/motion';

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
}

export function SegmentedControl({ options, value, onChange, size = 'md' }: SegmentedControlProps) {
  const padding = size === 'sm' ? 'px-2.5 py-[3px]' : 'px-3 py-1.5';
  const text = size === 'sm' ? 'text-[12px]' : 'text-[13px]';
  const layoutId = useId();

  return (
    <div className="inline-flex items-center bg-surface-muted/80 border border-border-subtle rounded-sm p-0.5">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`${padding} ${text} font-medium rounded-sm cursor-pointer relative tracking-tight
              transition-colors duration-150 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-muted focus-visible:ring-border-default
              ${active ? 'text-primary' : 'text-muted hover:text-primary'}`}
          >
            {active && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-surface border border-border-default rounded-sm shadow-[0_1px_0_rgba(17,17,17,0.06)]"
                transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
              />
            )}
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
