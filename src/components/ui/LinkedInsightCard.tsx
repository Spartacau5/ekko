// Phase 5: cross-feature insight pointer.
// Used on donor / policy / peer detail pages to make the relationships
// between People, Policy, and Peers visible. This is the connective tissue
// of the prototype — the thing that turns three separate modules into one
// coherent product story.
//
// Example: on Jordan Rivera's donor profile, a LinkedInsightCard points to
// the Right-to-Counsel policy ("hearing in 12 days") and to the Bronx
// Housing campaign ("messaging hook for re-engagement").

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, UserCircle, Building2, Link2, Sparkles } from 'lucide-react';
import { LinkedInsight, NARRATIVE_SPINE_IDS } from '../../data/demoFlows';

const ICON_BY_TYPE = {
  donor: <UserCircle size={13} />,
  policy: <FileText size={13} />,
  peer: <Building2 size={13} />,
};

const LABEL_BY_TYPE = {
  donor: 'Donor',
  policy: 'Policy',
  peer: 'Peer',
};

interface LinkedInsightCardProps {
  insight: LinkedInsight;
  onAction?: (insight: LinkedInsight) => void;
}

export function LinkedInsightCard({ insight, onAction }: LinkedInsightCardProps) {
  const actionLabel = insight.suggestedAction ?? `Open ${LABEL_BY_TYPE[insight.toType].toLowerCase()}`;
  return (
    <div className="block bg-surface border border-border-subtle rounded-sm p-3 hover:border-border-default transition-colors duration-150">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-sm bg-surface border border-border-default flex items-center justify-center flex-shrink-0 text-secondary shadow-[0_1px_0_rgba(17,17,17,0.04)]">
          {ICON_BY_TYPE[insight.toType]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="eyebrow-plain">{LABEL_BY_TYPE[insight.toType]}</p>
            {insight.badge && (
              <span className="inline-flex items-center text-[10px] font-semibold text-primary bg-accent-soft border border-accent/45 rounded-sm px-1.5 py-0.5 uppercase tracking-[0.12em]">
                {insight.badge}
              </span>
            )}
          </div>
          <Link
            to={insight.toRoute}
            className="text-[13px] font-semibold text-primary mt-1 tracking-tight hover:underline underline-offset-2 no-underline block"
          >
            {insight.toLabel}
          </Link>
          <p className="text-[12px] text-secondary mt-1 leading-snug">{insight.reason}</p>
          <div className="flex items-center gap-3 mt-3">
            {onAction ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onAction(insight);
                }}
                className="inline-flex items-center h-7 px-3 text-[12px] font-medium bg-surface border border-border-default rounded-sm hover:bg-surface-muted/60 text-primary transition-colors"
              >
                {actionLabel}
              </button>
            ) : null}
            <Link
              to={insight.toRoute}
              className="inline-flex items-center gap-1 text-[12px] text-secondary hover:text-primary no-underline"
            >
              Open <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NarrativeSpineBadge — a tiny marker that flags an entity as part of the
// Phase 5 "featured story" (Jordan Rivera ↔ Right-to-Counsel ↔ Bronx Housing).
// Rendered inline on list rows and dashboard columns so a reviewer scanning
// the UI can immediately see which items participate in the cross-surface
// narrative the walkthroughs pull together.
// ─────────────────────────────────────────────────────────────────────────────

interface NarrativeSpineBadgeProps {
  id?: string;
  label?: string;
  compact?: boolean;
}

export function NarrativeSpineBadge({ id, label, compact = false }: NarrativeSpineBadgeProps) {
  if (id !== undefined && !NARRATIVE_SPINE_IDS.has(id)) return null;
  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-primary bg-accent-soft border border-accent/50 rounded-sm px-1.5 py-0.5 leading-none whitespace-nowrap"
        title="Part of this week's featured story — People, Policy, and Peers connect here."
      >
        <Sparkles size={8} /> Story
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary bg-accent-soft border border-accent/50 rounded-sm px-1.5 py-0.5 leading-none whitespace-nowrap"
      title="Part of this week's featured story — People, Policy, and Peers connect here."
    >
      <Sparkles size={9} /> {label ?? 'Featured story'}
    </span>
  );
}

interface LinkedInsightSectionProps {
  title?: string;
  insights: LinkedInsight[];
  onAction?: (insight: LinkedInsight) => void;
}

// Convenience wrapper: titled section with stacked insight cards. Used in
// the right rail of detail pages. Framed as "The story continues" to signal
// that this is the connective tissue between People, Policy, and Peers —
// not just another "related items" rail.
export function LinkedInsightSection({ title, insights, onAction }: LinkedInsightSectionProps) {
  if (insights.length === 0) return null;
  return (
    <section className="relative bg-surface border border-accent/45 rounded-md overflow-hidden">
      {/* Accent left rule — Ekko's printed motif, used here to signal the
          cross-surface story at a glance. */}
      <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent" />
      <header className="px-5 py-3.5 border-b border-border-subtle bg-accent-soft/35">
        <div className="flex items-center gap-2 mb-1">
          <Link2 size={11} className="text-primary" />
          <p className="eyebrow-plain">{title ?? 'The story continues'}</p>
        </div>
        <p className="text-[12px] text-secondary leading-snug font-serif italic">
          Where this item connects across People, Policy, and Peers.
        </p>
      </header>
      <div className="p-3 space-y-2">
        {insights.map((i, idx) => (
          <LinkedInsightCard key={`${i.toType}-${i.toId}-${idx}`} insight={i} onAction={onAction} />
        ))}
      </div>
    </section>
  );
}
