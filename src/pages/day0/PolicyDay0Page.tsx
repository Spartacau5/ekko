// Day 0 Policy page.
// Mirrors the Day X layout: page header, stats strip (all zeros), and a single
// setup panel below. Instead of a policy list, the panel hosts the tracked-topic
// picker so users can pick suggestions — or paste in their own policies by URL
// or keyword — to start tracking.

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Search, Sparkles, X, Plus, Bell } from 'lucide-react';
import { trackedTopicOptions } from '../../data/maturity';
import { useToast } from '../../components/ui';
import { motionDurations, motionEasings } from '../../lib/motion';

export function PolicyDay0Page() {
  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [ownPolicies, setOwnPolicies] = useState<string[]>([]);

  const suggestedIds = useMemo(
    () => trackedTopicOptions.filter((t) => t.matchesMission).map((t) => t.id),
    [],
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

  function handleAddOwnPolicy(value: string) {
    const v = value.trim();
    if (!v) return;
    setOwnPolicies((prev) => (prev.includes(v) ? prev : [...prev, v]));
  }

  function handleRemoveOwnPolicy(value: string) {
    setOwnPolicies((prev) => prev.filter((p) => p !== value));
  }

  const totalSignals = useMemo(
    () =>
      trackedTopicOptions.filter((t) => selected.has(t.id)).reduce((sum, t) => sum + t.signalCount, 0) +
      ownPolicies.length * 3,
    [selected, ownPolicies],
  );

  const totalTrackedItems = selected.size + ownPolicies.length;

  function handleStartTracking() {
    setSubmitted(true);
    toast.show({
      type: 'success',
      title: `Tracking ${totalTrackedItems} ${totalTrackedItems === 1 ? 'item' : 'items'}`,
      description: 'Ekko will start surfacing policy signals matching your selection.',
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
    >
      <div className="mb-6">
        <h1 className="page-title">Policy</h1>
        <p className="text-[14px] text-secondary mt-1.5 max-w-2xl">
          Track legislative and regulatory changes that affect your mission.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Day0StatCard label="Tracked Policies" value="0" />
        <Day0StatCard label="Risk" value="0" />
        <Day0StatCard label="Opportunity" value="0" />
        <Day0StatCard label="Active Updates" value="0" sublabel="Last 7 days" />
      </div>

      {!submitted ? (
        <TopicPickerPanel
          selected={selected}
          ownPolicies={ownPolicies}
          totalSignals={totalSignals}
          onToggle={toggle}
          onAddOwn={handleAddOwnPolicy}
          onRemoveOwn={handleRemoveOwnPolicy}
          onSubmit={handleStartTracking}
        />
      ) : (
        <TrackingStartedPanel
          count={totalTrackedItems}
          onEdit={() => setSubmitted(false)}
        />
      )}
    </motion.div>
  );
}

function Day0StatCard({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5 opacity-70">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <p className="text-[13px] font-medium text-secondary">{label}</p>
        {sublabel && <span className="text-[11px] text-muted">{sublabel}</span>}
      </div>
      <p className="metric-display text-primary">{value}</p>
    </div>
  );
}

function TopicPickerPanel({
  selected,
  ownPolicies,
  totalSignals,
  onToggle,
  onAddOwn,
  onRemoveOwn,
  onSubmit,
}: {
  selected: Set<string>;
  ownPolicies: string[];
  totalSignals: number;
  onToggle: (id: string) => void;
  onAddOwn: (v: string) => void;
  onRemoveOwn: (v: string) => void;
  onSubmit: () => void;
}) {
  const [searchValue, setSearchValue] = useState('');
  const totalCount = selected.size + ownPolicies.length;

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchValue.trim()) return;
    onAddOwn(searchValue);
    setSearchValue('');
  }

  return (
    <section className="bg-surface border border-border-subtle rounded-md p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Step 1 of 2</p>
          <h2 className="text-[22px] font-serif font-semibold text-primary leading-tight mt-1">
            Choose what Ekko monitors
          </h2>
          <p className="text-[13px] text-secondary mt-1.5 max-w-xl leading-relaxed">
            Pick topics that align with your mission, or add specific bills by keyword or URL. We&apos;ve
            pre-selected suggestions based on your organization profile. You can refine any time.
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[12px] text-muted">Estimated</p>
          <p className="text-[22px] font-semibold text-primary">~{totalSignals}</p>
          <p className="text-[11px] text-muted">signals/week</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        {trackedTopicOptions.map((topic) => {
          const isSelected = selected.has(topic.id);
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onToggle(topic.id)}
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

      <div className="mt-5 pt-5 border-t border-border-subtle">
        <p className="text-[12px] font-semibold text-primary mb-1.5">Or track specific bills</p>
        <p className="text-[12px] text-muted mb-3 leading-snug">
          Add a bill by name, keyword, or URL and Ekko will follow its progress alongside the topics above.
        </p>
        <form onSubmit={submitSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder='e.g. "S. 1234 Housing Stability Act" or a legislative URL'
              className="w-full h-9 pl-9 pr-3 bg-surface border border-border-subtle rounded-sm text-[13px] text-primary placeholder:text-muted
                focus:outline-none focus:ring-1 focus:ring-primary/15 focus:border-border-default"
            />
          </div>
          <button
            type="submit"
            disabled={!searchValue.trim()}
            className="inline-flex items-center gap-1.5 px-3 h-9 text-[12px] font-medium bg-surface border border-border-subtle rounded-sm
              hover:border-border-default disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={12} /> Add
          </button>
        </form>

        {ownPolicies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {ownPolicies.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 px-2 h-[24px] text-[11px] bg-surface-muted/60 border border-border-subtle rounded-full text-primary"
              >
                {p.length > 40 ? `${p.slice(0, 40)}…` : p}
                <button
                  type="button"
                  onClick={() => onRemoveOwn(p)}
                  aria-label={`Remove ${p}`}
                  className="ml-0.5 hover:text-danger"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border-subtle">
        <p className="text-[12px] text-muted">
          {totalCount} {totalCount === 1 ? 'item' : 'items'} selected
          {ownPolicies.length > 0 && (
            <span className="text-secondary"> · {selected.size} topics, {ownPolicies.length} bills</span>
          )}
        </p>
        <button
          type="button"
          onClick={onSubmit}
          disabled={totalCount === 0}
          className="inline-flex items-center gap-1.5 bg-accent text-primary border border-border-default px-4 py-2 text-[13px] font-medium rounded-sm
            hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Start tracking {totalCount > 0 && `${totalCount} ${totalCount === 1 ? 'item' : 'items'}`}
        </button>
      </div>
    </section>
  );
}

function TrackingStartedPanel({ count, onEdit }: { count: number; onEdit: () => void }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-sm bg-success-soft border border-success/30 flex items-center justify-center flex-shrink-0">
          <Bell size={14} className="text-success" />
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-primary">
            Tracking started
          </p>
          <p className="text-[13px] text-secondary mt-1 leading-relaxed max-w-2xl">
            Ekko is indexing your {count} selected {count === 1 ? 'item' : 'items'}. Policy signals,
            hearings, and stakeholder movements will land here as they happen. Switch to{' '}
            <span className="font-mono text-primary">Day X</span> in the maturity switcher to preview the
            mature experience.
          </p>
          <button
            type="button"
            onClick={onEdit}
            className="mt-4 text-[13px] text-primary underline underline-offset-2"
          >
            Edit tracked topics
          </button>
        </div>
      </div>
    </div>
  );
}
