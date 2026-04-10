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
  const padding = size === 'sm' ? 'px-3 py-1' : 'px-3 py-1.5';
  const text = size === 'sm' ? 'text-[13px]' : 'text-sm';
  // Each instance gets its own layoutId so multiple controls don't cross-animate
  const layoutId = useId();

  return (
    <div className="inline-flex items-center bg-surface-muted border border-border-subtle rounded-sm p-0.5">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`${padding} ${text} font-medium rounded-sm cursor-pointer relative
              transition-colors duration-150 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-muted focus-visible:ring-border-default
              ${active ? 'text-primary' : 'text-secondary hover:text-primary'}`}
          >
            {active && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-surface border border-border-subtle rounded-sm shadow-sm"
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
