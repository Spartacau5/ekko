import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, MessageSquare } from 'lucide-react';
import { Drawer } from './Drawer';
import { Button } from './Button';
import { StatusBadge } from './StatusBadge';
import { DueDateBadge } from './DueDateBadge';
import { AssignOwnerControl } from './AssignOwnerControl';
import { Chip } from './Chip';
import { Avatar } from './Avatar';
import { ActionItem, ActionStatus } from '../../data/actions';
import { getTeamMember, roleMeta } from '../../data/team';

interface ActionDrawerProps {
  action: ActionItem | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, next: ActionStatus) => void;
  onOwnerChange?: (id: string, ownerId: string) => void;
  canEdit?: boolean;
}

export function ActionDrawer({
  action,
  open,
  onClose,
  onStatusChange,
  onOwnerChange,
  canEdit = true,
}: ActionDrawerProps) {
  const [status, setStatus] = useState<ActionStatus>('open');
  const [ownerId, setOwnerId] = useState<string>('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (action) {
      setStatus(action.status);
      setOwnerId(action.ownerId);
      setComment('');
    }
  }, [action]);

  if (!action) {
    return <Drawer open={open} onClose={onClose} title="Task details">{null}</Drawer>;
  }

  const owner = getTeamMember(ownerId);
  const creator = getTeamMember(action.createdBy) || null;

  const cycleStatus = () => {
    const next: ActionStatus =
      status === 'open' ? 'in_progress' :
      status === 'in_progress' ? 'completed' :
      'open';
    setStatus(next);
    onStatusChange?.(action.id, next);
  };

  const handleOwnerChange = (id: string) => {
    setOwnerId(id);
    onOwnerChange?.(action.id, id);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={action.title}
      subtitle={`Source: ${action.source}`}
      width={520}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          {canEdit && (
            <Button onClick={cycleStatus}>
              {status === 'open' ? 'Mark in progress' : status === 'in_progress' ? 'Mark complete' : 'Reopen'}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Status row */}
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={status} />
          <DueDateBadge dueDate={action.dueDate} status={status} />
          <Chip
            label={action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}
            variant={action.priority === 'urgent' ? 'danger' : action.priority === 'high' ? 'warning' : 'default'}
          />
        </div>

        {/* Context */}
        <div>
          <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-1">Context</p>
          <p className="text-sm text-secondary leading-relaxed">{action.context}</p>
        </div>

        {/* Owner */}
        <div>
          <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">Owner</p>
          {canEdit ? (
            <AssignOwnerControl ownerId={ownerId} onChange={handleOwnerChange} />
          ) : (
            owner && (
              <div className="flex items-center gap-2.5">
                <Avatar member={owner} size="sm" />
                <div>
                  <p className="text-sm text-primary font-medium">{owner.name}</p>
                  <p className="text-[12px] text-muted">{roleMeta[owner.role].label}</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Linked entity */}
        {action.entity && (
          <div>
            <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">Linked to</p>
            <Link
              to={action.entity.link}
              onClick={onClose}
              className="flex items-center justify-between p-3 bg-surface-muted/40 border border-border-subtle rounded-sm
                hover:border-border-default hover:bg-surface-muted/60 transition-colors no-underline"
            >
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider mb-0.5">{action.entity.type}</p>
                <p className="text-sm font-medium text-primary">{action.entity.label}</p>
              </div>
              <ArrowUpRight size={14} className="text-muted" />
            </Link>
          </div>
        )}

        {/* Suggested next step */}
        <div className="bg-accent-soft/40 border border-border-subtle rounded-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-primary" />
            <p className="text-[12px] font-medium text-primary uppercase tracking-wider">Recommended next step</p>
          </div>
          <p className="text-sm text-primary mb-3">{action.cta}</p>
          <Button size="sm" variant="primary" className="w-full justify-center">{action.cta}</Button>
        </div>

        {/* Activity log (mocked) */}
        <div>
          <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">Activity</p>
          <div className="border border-border-subtle rounded-sm divide-y divide-border-subtle">
            <ActivityLine label={`Created by ${creator?.name ?? 'Ekko'}`} date={action.createdAt} />
            {status === 'in_progress' && <ActivityLine label="Status changed to in progress" date="2026-04-09" />}
            {owner && <ActivityLine label={`Assigned to ${owner.name}`} date={action.createdAt} />}
          </div>
        </div>

        {/* Comment composer */}
        {canEdit && (
          <div>
            <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare size={12} /> Leave a note
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Add a note for the owner or other watchers..."
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-sm outline-none
                placeholder:text-muted/80
                hover:border-border-default/60 focus-visible:border-border-default focus-visible:ring-2 focus-visible:ring-border-default/40 focus-visible:ring-offset-1 focus-visible:ring-offset-surface"
            />
          </div>
        )}
      </div>
    </Drawer>
  );
}

function ActivityLine({ label, date }: { label: string; date: string }) {
  const formatted = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return (
    <div className="flex items-center justify-between px-3 py-2 text-[12px]">
      <span className="text-secondary">{label}</span>
      <span className="text-muted">{formatted}</span>
    </div>
  );
}
