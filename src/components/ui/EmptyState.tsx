// Phase 6: refined EmptyState.
// Editorial empty state — small eyebrow + serif title + muted description.
// The icon sits inside a printed square rather than a neutral circle to
// better echo the logo mark and the rest of Ekko's border-led surfaces.

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { motionDurations, motionEasings } from '../../lib/motion';

interface EmptyStateProps {
  icon?: React.ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export function EmptyState({
  icon,
  eyebrow,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {icon && (
        <div className="w-11 h-11 rounded-sm bg-surface border border-border-default flex items-center justify-center mb-4 text-secondary shadow-[0_1px_0_rgba(17,17,17,0.06)]">
          {icon}
        </div>
      )}
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h3 className="font-serif font-semibold text-primary text-[18px] leading-[24px] tracking-tight mb-1.5">
        {title}
      </h3>
      <p className="text-[13px] text-secondary max-w-sm mb-5 leading-relaxed">{description}</p>
      {(action || secondaryAction) && (
        <div className="flex items-center gap-2">
          {secondaryAction && (
            <Button variant="ghost" size="sm" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button variant="secondary" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
