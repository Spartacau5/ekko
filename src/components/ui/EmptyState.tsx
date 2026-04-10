import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { motionDurations, motionEasings } from '../../lib/motion';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {icon && (
        <div className="w-12 h-12 rounded-full bg-surface-muted border border-border-subtle flex items-center justify-center mb-4 text-muted">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-primary mb-1">{title}</h3>
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
