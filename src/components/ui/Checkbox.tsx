import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { motionDurations, motionEasings } from '../../lib/motion';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function Checkbox({ label, checked, onChange, description }: CheckboxProps) {
  const toggle = () => onChange(!checked);
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggle();
        }
      }}
      className="flex items-start gap-3 cursor-pointer group select-none rounded-sm
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-page focus-visible:ring-border-default"
    >
      <div
        aria-hidden="true"
        className={`mt-0.5 w-[18px] h-[18px] rounded-sm border flex items-center justify-center flex-shrink-0
          transition-[background-color,border-color] duration-150 ease-out
          ${checked
            ? 'bg-accent border-border-default'
            : 'bg-surface border-border-subtle group-hover:border-border-default'}`}
      >
        <motion.span
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
          className="flex items-center justify-center"
        >
          <Check size={13} strokeWidth={2.5} />
        </motion.span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-primary">{label}</span>
        {description && <span className="text-[13px] text-muted">{description}</span>}
      </div>
    </div>
  );
}
