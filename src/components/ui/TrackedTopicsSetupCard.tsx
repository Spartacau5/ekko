// Phase 4.5: Day 0 component for picking which policy topics Ekko should track.
// Stateful checklist with mission-aligned suggestions, signal volume hints,
// and a primary "Start tracking" CTA. Used on the Day 0 Policy page and as a
// dashboard module.

import React, { useState, useMemo } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { trackedTopicOptions } from '../../data/maturity';

interface TrackedTopicsSetupCardProps {
  onSubmit?: (topicIds: string[]) => void;
  compact?: boolean;
}

export function TrackedTopicsSetupCard({ onSubmit, compact }: TrackedTopicsSetupCardProps) {
  const suggestedIds = useMemo(
    () => trackedTopicOptions.filter((t) => t.matchesMission).map((t) => t.id),
    []
  );
  const [selected, setSelected] = useState<Set<string>>(new Set(suggestedIds));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalSignals = useMemo(
    () =>
      trackedTopicOptions
        .filter((t) => selected.has(t.id))
        .reduce((sum, t) => sum + t.signalCount, 0),
    [selected]
  );

  return (
    <section className="bg-surface border border-border-subtle rounded-md p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Step 1 of 2</p>
          <h2 className="text-[22px] font-serif font-semibold text-primary leading-tight mt-1">
            Choose what Ekko monitors
          </h2>
          <p className="text-[13px] text-secondary mt-1.5 max-w-lg leading-relaxed">
            Pick the topics that align with your mission. We&apos;ve pre-selected suggestions based on your
            organization profile. You can refine this any time.
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[12px] text-muted">Estimated</p>
          <p className="text-[22px] font-semibold text-primary">~{totalSignals}</p>
          <p className="text-[11px] text-muted">signals/week</p>
        </div>
      </div>

      <div className={`grid gap-2 ${compact ? 'sm:grid-cols-1' : 'sm:grid-cols-2'}`}>
        {trackedTopicOptions.map((topic) => {
          const isSelected = selected.has(topic.id);
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => toggle(topic.id)}
              className={`text-left p-3 rounded-sm border transition-colors duration-150
                ${isSelected
                  ? 'border-border-default bg-accent-soft/40'
                  : 'border-border-subtle bg-surface hover:bg-surface-muted/40'
                }`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center mt-0.5 flex-shrink-0
                  ${isSelected ? 'bg-primary border-primary' : 'border-border-default bg-surface'}`}>
                  {isSelected && <Check size={11} className="text-surface" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="text-[13px] font-semibold text-primary">{topic.label}</p>
                    {topic.matchesMission && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary bg-accent-soft border border-accent/40 rounded-sm px-1.5 py-0.5">
                        <Sparkles size={9} /> Suggested
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-secondary mt-0.5 leading-snug">{topic.description}</p>
                  <p className="text-[11px] text-muted mt-1">~{topic.signalCount} signals/week</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {onSubmit && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border-subtle">
          <p className="text-[12px] text-muted">{selected.size} topic{selected.size === 1 ? '' : 's'} selected</p>
          <button
            type="button"
            onClick={() => onSubmit(Array.from(selected))}
            disabled={selected.size === 0}
            className="inline-flex items-center gap-1.5 bg-accent text-primary border border-border-default px-4 py-2 text-[13px] font-medium rounded-sm hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Start tracking {selected.size > 0 && `${selected.size} ${selected.size === 1 ? 'topic' : 'topics'}`}
          </button>
        </div>
      )}
    </section>
  );
}
