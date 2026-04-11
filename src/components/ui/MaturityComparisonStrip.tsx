// Phase 5 polish: side-by-side Day 0 → Day X comparison strip.
// A single reusable component that shows the same set of workspace metrics in
// both maturity states at once. Placed at the top of both dashboards so a
// reviewer can see, in one glance, how connected data, tracked topics, and
// active usage change as the product matures.
//
// The component also exposes a one-click switcher so a presenter can jump
// between states without leaving the strip.

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sprout, Sparkles, Plug, Users as UsersIcon, FileText, Building2, Target } from 'lucide-react';
import { useMaturity, Maturity } from '../../lib/MaturityContext';
import { maturityProfiles } from '../../data/maturity';
import { motionDurations, motionEasings } from '../../lib/motion';

interface ComparisonMetric {
  label: string;
  icon: React.ReactNode;
  day0: string;
  dayX: string;
}

function buildMetrics(): ComparisonMetric[] {
  const d0 = maturityProfiles.day0;
  const dX = maturityProfiles.dayX;
  return [
    {
      label: 'Data sources',
      icon: <Plug size={12} />,
      day0: `${d0.connectedSourcesCount} of ${d0.totalSourcesCount}`,
      dayX: `${dX.connectedSourcesCount} of ${dX.totalSourcesCount}`,
    },
    {
      label: 'Donors loaded',
      icon: <UsersIcon size={12} />,
      day0: d0.donorsLoaded.toLocaleString(),
      dayX: dX.donorsLoaded.toLocaleString(),
    },
    {
      label: 'Policies tracked',
      icon: <FileText size={12} />,
      day0: d0.policiesTracked.toString(),
      dayX: dX.policiesTracked.toString(),
    },
    {
      label: 'Peers tracked',
      icon: <Building2 size={12} />,
      day0: d0.peersTracked.toString(),
      dayX: dX.peersTracked.toString(),
    },
    {
      label: 'Setup',
      icon: <Target size={12} />,
      day0: `${d0.setupCompletion}%`,
      dayX: `${dX.setupCompletion}%`,
    },
  ];
}

export function MaturityComparisonStrip() {
  const { activeMaturity, setActiveMaturity } = useMaturity();
  const metrics = buildMetrics();
  const isDay0 = activeMaturity === 'day0';

  return (
    <motion.section
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
      className="bg-surface border border-border-subtle rounded-md overflow-hidden mb-6"
      aria-label="Day 0 to Day X comparison"
    >
      {/* Header row — eyebrow + tagline + state switcher */}
      <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-border-subtle bg-surface-muted/30">
        <div className="flex items-center gap-3 min-w-0">
          <p className="eyebrow whitespace-nowrap">Day 0 → Day X</p>
          <p className="text-[12px] text-secondary truncate italic font-serif">
            Same Ekko, two states — each column is the same metric at setup vs. six months in.
          </p>
        </div>
        <StateToggle
          activeMaturity={activeMaturity}
          onChange={setActiveMaturity}
        />
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map((m, i) => (
          <MetricCell
            key={m.label}
            metric={m}
            last={i === metrics.length - 1}
            highlight={isDay0 ? 'day0' : 'dayX'}
          />
        ))}
      </div>
    </motion.section>
  );
}

function MetricCell({
  metric,
  last,
  highlight,
}: {
  metric: ComparisonMetric;
  last: boolean;
  highlight: Maturity;
}) {
  return (
    <div className={`px-5 py-4 ${last ? '' : 'border-r border-border-subtle'} border-b last:border-b-0 lg:border-b-0 border-border-subtle`}>
      <div className="flex items-center gap-1.5 text-muted mb-2.5">
        <span className="text-secondary">{metric.icon}</span>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">{metric.label}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-[19px] font-semibold leading-none tabular-nums tracking-tight ${
            highlight === 'day0' ? 'text-primary' : 'text-muted'
          }`}
        >
          {metric.day0}
        </span>
        <ArrowRight size={11} className="text-muted flex-shrink-0" strokeWidth={1.5} />
        <span
          className={`text-[19px] font-semibold leading-none tabular-nums tracking-tight ${
            highlight === 'dayX' ? 'text-primary' : 'text-muted'
          }`}
        >
          {metric.dayX}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-2.5 text-[9px] uppercase tracking-[0.12em]">
        <span className={`inline-flex items-center gap-1 ${highlight === 'day0' ? 'text-success font-semibold' : 'text-muted'}`}>
          <Sprout size={9} /> Day 0
        </span>
        <span className="text-border-subtle">·</span>
        <span className={`inline-flex items-center gap-1 ${highlight === 'dayX' ? 'text-primary font-semibold' : 'text-muted'}`}>
          <Sparkles size={9} /> Day X
        </span>
      </div>
    </div>
  );
}

function StateToggle({
  activeMaturity,
  onChange,
}: {
  activeMaturity: Maturity;
  onChange: (m: Maturity) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Switch maturity state"
      className="inline-flex items-center bg-surface border border-border-subtle rounded-sm p-0.5 flex-shrink-0"
    >
      <ToggleButton
        active={activeMaturity === 'day0'}
        onClick={() => onChange('day0')}
        tone="success"
        icon={<Sprout size={10} />}
        label="Day 0"
      />
      <ToggleButton
        active={activeMaturity === 'dayX'}
        onClick={() => onChange('dayX')}
        tone="accent"
        icon={<Sparkles size={10} />}
        label="Day X"
      />
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  tone: 'success' | 'accent';
}) {
  const activeClass =
    tone === 'success'
      ? 'bg-success-soft border-success/40 text-success'
      : 'bg-accent-soft border-accent/50 text-primary';
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-wider border transition-colors duration-150 ${
        active ? activeClass : 'bg-transparent border-transparent text-muted hover:text-primary'
      }`}
    >
      {icon} {label}
    </button>
  );
}
