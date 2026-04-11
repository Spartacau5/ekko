import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, Sparkles, Users, FileText, Megaphone, Settings as SettingsIcon,
  Eye, Shield, Zap, Wrench,
} from 'lucide-react';
import { ActionItem, ActionStatus, ActionEntityType } from '../../data/actions';
import { teamMembers } from '../../data/team';
import { motionDurations, motionEasings } from '../../lib/motion';
import { StatusBadge } from './StatusBadge';
import { DueDateBadge } from './DueDateBadge';
import { AssignOwnerControl } from './AssignOwnerControl';
import { Avatar } from './Avatar';

interface TaskCardProps {
  action: ActionItem;
  variant?: 'default' | 'compact';
  // Status and owner are read straight from the action prop. The parent owns
  // the data — we just signal events. This keeps lists in sync after edits.
  onStatusChange?: (id: string, next: ActionStatus) => void;
  onOwnerChange?: (id: string, ownerId: string) => void;
  onOpenDrawer?: (action: ActionItem) => void;
  canEdit?: boolean;
}

const entityIcon: Record<ActionEntityType, React.ReactNode> = {
  donor: <Users size={11} />,
  policy: <FileText size={11} />,
  peer: <Megaphone size={11} />,
  campaign: <Megaphone size={11} />,
  alert: <Sparkles size={11} />,
  system: <SettingsIcon size={11} />,
};

// Map source strings → small icon so the recommendation origin is scannable
// at a glance instead of buried in metadata.
function sourceIcon(source: string): React.ReactNode {
  if (source.toLowerCase().includes('engagement') || source.toLowerCase().includes('donor signals')) {
    return <Eye size={11} />;
  }
  if (source.toLowerCase().includes('policy') || source.toLowerCase().includes('compliance')) {
    return <Shield size={11} />;
  }
  if (source.toLowerCase().includes('peer')) {
    return <Megaphone size={11} />;
  }
  if (source.toLowerCase().includes('program')) {
    return <Wrench size={11} />;
  }
  if (source.toLowerCase().includes('setup')) {
    return <SettingsIcon size={11} />;
  }
  return <Zap size={11} />;
}

const priorityDot: Record<ActionItem['priority'], string> = {
  urgent: 'bg-danger',
  high: 'bg-warning',
  medium: 'bg-info',
  low: 'bg-muted',
};

const priorityRing: Record<ActionItem['priority'], string> = {
  urgent: 'ring-danger/40',
  high: 'ring-warning/40',
  medium: 'ring-info/40',
  low: 'ring-muted/40',
};

export function TaskCard({
  action,
  variant = 'default',
  onStatusChange,
  onOwnerChange,
  onOpenDrawer,
  canEdit = true,
}: TaskCardProps) {
  const owner = teamMembers.find((m) => m.id === action.ownerId);
  const isCompact = variant === 'compact';
  const isCompleted = action.status === 'completed';

  const handleAdvance = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const next: ActionStatus =
      action.status === 'open' ? 'in_progress' :
      action.status === 'in_progress' ? 'completed' :
      'open';
    onStatusChange?.(action.id, next);
  };

  return (
    <motion.div
      layout
      initial={false}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
      className={`group relative bg-surface border border-border-subtle rounded-md
        transition-[border-color,background-color,box-shadow] duration-150 ease-out
        hover:border-border-default hover:shadow-[0_1px_0_rgba(17,17,17,0.04)]
        ${isCompact ? 'p-3' : 'p-4'}
        ${isCompleted ? 'opacity-65' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className={`mt-[7px] w-[7px] h-[7px] rounded-full flex-shrink-0 ring-2 ${priorityDot[action.priority]} ${priorityRing[action.priority]}`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <p
              className={`text-[13.5px] font-semibold text-primary leading-snug tracking-tight
                ${isCompleted ? 'line-through text-muted' : ''}`}
            >
              {action.title}
            </p>
            <DueDateBadge dueDate={action.dueDate} status={action.status} size={isCompact ? 'sm' : 'md'} />
          </div>

          <p className="text-[12.5px] text-secondary line-clamp-2 mb-2.5 leading-relaxed">{action.context}</p>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Left cluster: status + linked entity + source */}
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <StatusBadge status={action.status} size="sm" />
              {action.entity && (
                <Link
                  to={action.entity.link}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium text-secondary
                    border border-border-subtle rounded-sm bg-surface-muted/40
                    hover:border-border-default hover:text-primary transition-colors no-underline max-w-[180px]"
                  title={action.entity.label}
                >
                  <span className="text-muted">{entityIcon[action.entity.type]}</span>
                  <span className="truncate">{action.entity.label}</span>
                </Link>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] text-muted" title={`Source: ${action.source}`}>
                <span className="text-muted/80">{sourceIcon(action.source)}</span>
                {action.source}
              </span>
            </div>

            {/* Right cluster: owner + actions */}
            <div className="flex items-center gap-2">
              {canEdit && onOwnerChange ? (
                <AssignOwnerControl
                  ownerId={action.ownerId}
                  onChange={(id) => onOwnerChange(action.id, id)}
                  size="sm"
                />
              ) : (
                owner && (
                  <div className="flex items-center gap-1.5 text-[12px]" title={owner.name}>
                    <Avatar member={owner} size="xs" />
                    <span className="text-secondary">{owner.name.split(' ')[0]}</span>
                  </div>
                )
              )}
              {onStatusChange && canEdit && !isCompleted && (
                <button
                  type="button"
                  onClick={handleAdvance}
                  className="text-[12px] font-medium text-secondary hover:text-primary underline whitespace-nowrap
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default rounded-sm"
                >
                  {action.status === 'open' ? 'Start' : 'Mark done'}
                </button>
              )}
              {onOpenDrawer && (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenDrawer(action); }}
                  className="p-1 -m-1 text-muted hover:text-primary transition-colors rounded-sm
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
                  aria-label="Open task details"
                >
                  <ArrowUpRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
