// Phase 4.5: a richer empty state used on Day 0 surfaces. Unlike the bare
// EmptyState, this one is structured: title, value-prop body, a list of "what
// you'll see once X is set up" bullets, and a primary CTA. Used when an entire
// surface (e.g., Policy with no tracked topics) needs to feel intentionally
// designed for the first-week state, not broken or empty.

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motionDurations, motionEasings } from '../../lib/motion';

interface EducationalEmptyStateProps {
  eyebrow?: string;
  title: string;
  description: string;
  bullets?: string[];
  primary?: { label: string; to?: string; onClick?: () => void };
  secondary?: { label: string; to?: string; onClick?: () => void };
  icon?: React.ReactNode;
  illustration?: React.ReactNode;
}

export function EducationalEmptyState({
  eyebrow,
  title,
  description,
  bullets = [],
  primary,
  secondary,
  icon,
  illustration,
}: EducationalEmptyStateProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
      className="bg-surface border border-border-subtle rounded-md p-8 md:p-10"
    >
      <div className="grid md:grid-cols-[minmax(0,1fr)_auto] gap-8 items-start">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-sm bg-accent-soft text-primary flex items-center justify-center">
              {icon ?? <Sparkles size={15} />}
            </div>
            {eyebrow && (
              <span className="text-[11px] font-medium text-muted uppercase tracking-wider">{eyebrow}</span>
            )}
          </div>
          <h2 className="text-[26px] font-serif font-semibold text-primary leading-tight">{title}</h2>
          <p className="text-[14px] text-secondary mt-2 leading-relaxed">{description}</p>

          {bullets.length > 0 && (
            <ul className="mt-5 space-y-2">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span className="leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          )}

          {(primary || secondary) && (
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              {primary && <CTAButton {...primary} variant="primary" />}
              {secondary && <CTAButton {...secondary} variant="secondary" />}
            </div>
          )}
        </div>

        {illustration && (
          <div className="hidden md:block w-[280px] flex-shrink-0">{illustration}</div>
        )}
      </div>
    </motion.section>
  );
}

function CTAButton({
  label,
  to,
  onClick,
  variant,
}: {
  label: string;
  to?: string;
  onClick?: () => void;
  variant: 'primary' | 'secondary';
}) {
  const className =
    variant === 'primary'
      ? 'inline-flex items-center gap-1.5 bg-accent text-primary border border-border-default px-4 py-2 text-[13px] font-medium rounded-sm hover:bg-accent-hover transition-colors duration-150 no-underline'
      : 'inline-flex items-center gap-1.5 bg-surface text-primary border border-border-default px-4 py-2 text-[13px] font-medium rounded-sm hover:bg-surface-muted transition-colors duration-150 no-underline';

  if (to) {
    return (
      <Link to={to} className={className}>
        {label} <ArrowRight size={12} />
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {label} <ArrowRight size={12} />
    </button>
  );
}
