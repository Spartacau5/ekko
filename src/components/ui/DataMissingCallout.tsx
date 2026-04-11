// Phase 4.5: inline callout for "this section is empty because X isn't connected
// yet." Used inside donor / policy / peer detail pages on Day 0 to mark the
// modules that depend on integration data, without making them feel broken.

import React from 'react';
import { Link } from 'react-router-dom';
import { CircleDashed, ArrowRight } from 'lucide-react';

interface DataMissingCalloutProps {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaTo?: string;
  onCta?: () => void;
}

export function DataMissingCallout({ title, body, ctaLabel, ctaTo, onCta }: DataMissingCalloutProps) {
  return (
    <div className="border border-dashed border-border-subtle bg-surface-muted/30 rounded-sm p-4 flex items-start gap-3">
      <CircleDashed size={15} className="text-muted mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-primary leading-snug">{title}</p>
        <p className="text-[12px] text-secondary mt-0.5 leading-snug">{body}</p>
        {ctaLabel && (ctaTo ? (
          <Link to={ctaTo} className="text-[12px] font-medium text-primary underline mt-2 inline-flex items-center gap-1 no-underline hover:underline">
            {ctaLabel} <ArrowRight size={10} />
          </Link>
        ) : (
          <button type="button" onClick={onCta} className="text-[12px] font-medium text-primary mt-2 inline-flex items-center gap-1 hover:underline">
            {ctaLabel} <ArrowRight size={10} />
          </button>
        ))}
      </div>
    </div>
  );
}
