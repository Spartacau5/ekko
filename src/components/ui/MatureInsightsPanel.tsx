// Phase 4.5: a wrapper used on Day X surfaces to group "intelligence-driven"
// content (cross-feature insights, trends, recommendations). Visually a real
// content card, not a teaser — Day X is the established workspace.

import React from 'react';
import { Sparkles } from 'lucide-react';

interface MatureInsightsPanelProps {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function MatureInsightsPanel({
  eyebrow = 'Ekko intelligence',
  title,
  description,
  meta,
  children,
  icon,
}: MatureInsightsPanelProps) {
  return (
    <section className="bg-surface border border-border-subtle rounded-md overflow-hidden">
      <header className="px-5 py-4 border-b border-border-subtle bg-surface-muted/30 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-sm bg-accent-soft border border-accent/40 flex items-center justify-center text-primary">
              {icon ?? <Sparkles size={11} />}
            </div>
            <span className="text-[10px] font-medium text-muted uppercase tracking-wider">{eyebrow}</span>
          </div>
          <h3 className="text-[15px] font-semibold text-primary leading-tight">{title}</h3>
          {description && <p className="text-[12px] text-secondary mt-1 leading-snug">{description}</p>}
        </div>
        {meta && <div className="flex-shrink-0 text-right">{meta}</div>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
