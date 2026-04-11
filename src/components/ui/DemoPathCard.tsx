// Phase 5: a card representing one named demo flow on the dashboard.
// Click to start the flow — context updates, walkthrough strip appears, and
// the user is navigated to the flow's first step.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, Sprout, Users as UsersIcon, FileText, Building2, LineChart } from 'lucide-react';
import { DemoFlow } from '../../data/demoFlows';
import { useDemoFlow } from '../../lib/DemoFlowContext';
import { useMaturity } from '../../lib/MaturityContext';
import { useRole } from '../../lib/RoleContext';
import { roleMeta } from '../../data/team';

interface DemoPathCardProps {
  flow: DemoFlow;
  variant?: 'card' | 'compact';
}

const FLOW_ICONS: Record<DemoFlow['id'], React.ReactNode> = {
  'day0-activation': <Sprout size={14} className="text-success" />,
  'fundraising-jordan': <UsersIcon size={14} className="text-primary" />,
  'policy-rtc': <FileText size={14} className="text-primary" />,
  'peer-bronx': <Building2 size={14} className="text-primary" />,
  'executive-overview': <LineChart size={14} className="text-primary" />,
};

export function DemoPathCard({ flow, variant = 'card' }: DemoPathCardProps) {
  const navigate = useNavigate();
  const { startFlow } = useDemoFlow();
  const { setActiveMaturity, activeMaturity } = useMaturity();
  const { setActiveRole, activeRole } = useRole();

  function start() {
    // Hydrate the recommended state so the flow is shown in the right context.
    if (flow.recommendedMaturity !== activeMaturity) {
      setActiveMaturity(flow.recommendedMaturity);
    }
    if (flow.recommendedRole && flow.recommendedRole !== activeRole) {
      setActiveRole(flow.recommendedRole);
    }
    startFlow(flow.id);
    navigate(flow.steps[0].route);
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={start}
        className="w-full text-left bg-surface border border-border-subtle rounded-md p-4 hover:bg-surface-muted/40 transition-colors duration-150 group"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center flex-shrink-0">
            {FLOW_ICONS[flow.id]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-primary leading-snug">{flow.name}</p>
            <p className="text-[11px] text-muted mt-0.5">{flow.audience} · {flow.duration}</p>
          </div>
          <ArrowRight size={13} className="text-muted group-hover:text-primary transition-colors duration-150 mt-1 flex-shrink-0" />
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={start}
      className="text-left bg-surface border border-border-subtle rounded-md p-5 hover:border-border-default hover:shadow-[0_1px_0_rgba(17,17,17,0.05)] transition-all duration-150 group flex flex-col"
    >
      {/* eyebrow row — printed icon chip + flow kind */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-accent-soft border border-accent/45 flex items-center justify-center flex-shrink-0 shadow-[0_1px_0_rgba(17,17,17,0.04)]">
            {FLOW_ICONS[flow.id]}
          </div>
          <p className="eyebrow-plain">
            {flow.duration} · {flow.steps.length} steps
          </p>
        </div>
        <span className="eyebrow-plain">
          {flow.recommendedMaturity === 'day0' ? 'Day 0' : 'Day X'}
        </span>
      </div>

      <h3 className="text-[15px] font-serif font-semibold text-primary leading-tight tracking-tight">{flow.name}</h3>
      <p className="text-[12px] text-secondary mt-2 leading-relaxed flex-1">{flow.rationale}</p>

      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted truncate">
          {flow.recommendedRole ? `${roleMeta[flow.recommendedRole].label} view` : flow.audience}
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary whitespace-nowrap border-b border-transparent group-hover:border-primary/40 pb-px">
          <Play size={10} /> Start walkthrough
        </span>
      </div>
    </button>
  );
}
