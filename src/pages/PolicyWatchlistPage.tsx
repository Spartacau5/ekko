import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { watchlist, policyAlerts, PolicyAlert } from '../data/watchlist';
import { policies } from '../data/policies';
import { PageHeader, Chip, Button, SegmentedControl, EmptyState } from '../components/ui';
import {
  Bell, AlertCircle, Info, CalendarClock,
  MessageSquare, ExternalLink, ArrowLeft, Settings as SettingsIcon, ArrowUpRight,
} from 'lucide-react';

const filterOptions = [
  { value: 'all', label: 'All alerts' },
  { value: 'unread', label: 'Unread' },
  { value: 'urgent', label: 'Urgent' },
];

export function PolicyWatchlistPage() {
  const [filter, setFilter] = useState('all');

  const filteredAlerts = useMemo(() => {
    if (filter === 'unread') return policyAlerts.filter(a => a.isUnread);
    if (filter === 'urgent') return policyAlerts.filter(a => a.severity === 'urgent');
    return policyAlerts;
  }, [filter]);

  const unreadCount = policyAlerts.filter(a => a.isUnread).length;
  const urgentCount = policyAlerts.filter(a => a.severity === 'urgent').length;
  const totalWatched = watchlist.length;
  const activityThisWeek = policyAlerts.filter(a => {
    const d = new Date(a.date);
    const now = new Date('2026-04-10');
    const days = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return days <= 7;
  }).length;

  return (
    <>
      <Link to="/policy" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4">
        <ArrowLeft size={14} /> Back to all policies
      </Link>

      <PageHeader
        title="Policy watchlist"
        subtitle="Tracked policies and recent alerts across your watchlist"
        serif
        actions={
          <Button variant="secondary"><SettingsIcon size={14} className="mr-2" />Manage alerts</Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <WatchKPI
          label="Watchlist"
          value={totalWatched.toString()}
          sublabel={`${totalWatched === 1 ? 'policy tracked' : 'policies tracked'}`}
        />
        <WatchKPI
          label="Unread alerts"
          value={unreadCount.toString()}
          sublabel="last 30 days"
          accent={unreadCount > 0}
        />
        <WatchKPI
          label="Urgent"
          value={urgentCount.toString()}
          sublabel={urgentCount > 0 ? 'needs action' : 'all clear'}
          danger={urgentCount > 0}
        />
        <WatchKPI
          label="Activity this week"
          value={activityThisWeek.toString()}
          sublabel="alerts received"
        />
      </div>

      {/* Two col */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: alerts */}
        <div className="col-span-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-semibold text-primary">Recent alerts</h2>
              <p className="text-[13px] text-muted mt-0.5">
                {filter === 'all' && `${filteredAlerts.length} alerts`}
                {filter === 'unread' && `${filteredAlerts.length} unread`}
                {filter === 'urgent' && `${filteredAlerts.length} urgent`}
              </p>
            </div>
            <SegmentedControl options={filterOptions} value={filter} onChange={setFilter} size="sm" />
          </div>
          <div className="bg-surface border border-border-subtle rounded-md overflow-hidden">
            {filteredAlerts.length === 0 ? (
              <EmptyState
                icon={<Bell size={28} />}
                title="No alerts to show"
                description={filter === 'unread' ? "You're all caught up on unread alerts." : 'No alerts match this filter.'}
              />
            ) : (
              <div className="divide-y divide-border-subtle">
                {filteredAlerts.map(alert => <AlertRow key={alert.id} alert={alert} />)}
              </div>
            )}
          </div>
        </div>

        {/* Right: tracked policies */}
        <div className="col-span-4">
          <h2 className="text-[15px] font-semibold text-primary mb-3">Tracked policies</h2>
          <div className="bg-surface border border-border-subtle rounded-md overflow-hidden">
            <div className="divide-y divide-border-subtle">
              {watchlist.map(item => {
                const policy = policies.find(p => p.id === item.policyId);
                if (!policy) return null;
                const isOpp = policy.impactLevel.includes('opportunity');
                return (
                  <Link
                    key={item.policyId}
                    to={`/policy/${item.policyId}`}
                    className="group block p-4 hover:bg-surface-muted/30 no-underline transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-[13px] font-medium text-primary line-clamp-2 flex-1 leading-tight">{policy.title}</p>
                      <ArrowUpRight size={12} className="text-muted group-hover:text-primary flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Chip
                        label={policy.impactLevel}
                        variant={isOpp ? 'success' : policy.impactLevel.includes('risk') ? 'danger' : 'warning'}
                      />
                      <span className="text-[11px] text-muted">{policy.jurisdiction}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted pt-2 border-t border-border-subtle">
                      <span className="flex items-center gap-1">
                        <Bell size={10} />
                        {item.alertCount} {item.alertCount === 1 ? 'alert' : 'alerts'}
                      </span>
                      {item.lastAlertDate && (
                        <span>
                          Last {new Date(item.lastAlertDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function WatchKPI({ label, value, sublabel, accent, danger }: { label: string; value: string; sublabel: string; accent?: boolean; danger?: boolean }) {
  return (
    <div className={`bg-surface border rounded-md p-5 ${(accent || danger) ? 'border-border-default' : 'border-border-subtle'}`}>
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-[32px] leading-[36px] font-semibold ${danger ? 'text-danger' : 'text-primary'}`}>{value}</p>
      <p className="text-[13px] text-muted mt-1">{sublabel}</p>
    </div>
  );
}

function AlertRow({ alert }: { alert: PolicyAlert }) {
  const iconMap: Record<string, React.ReactNode> = {
    status_change: <CalendarClock size={14} />,
    hearing_scheduled: <CalendarClock size={14} />,
    amendment: <MessageSquare size={14} />,
    new_stakeholder: <Info size={14} />,
    media_mention: <ExternalLink size={14} />,
    committee_action: <CalendarClock size={14} />,
    effective_date_set: <AlertCircle size={14} />,
  };
  const severityBg = {
    urgent: 'bg-danger-soft border-danger text-danger',
    warning: 'bg-warning-soft border-warning text-warning',
    info: 'bg-info-soft border-info text-info',
  }[alert.severity];

  return (
    <Link
      to={`/policy/${alert.policyId}`}
      className={`group block p-4 hover:bg-surface-muted/30 no-underline transition-colors relative ${alert.isUnread ? 'bg-accent-soft/15' : ''}`}
    >
      {/* Unread accent line on the left edge */}
      {alert.isUnread && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent" />
      )}

      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-sm border flex items-center justify-center flex-shrink-0 ${severityBg}`}>
          {iconMap[alert.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 mb-0.5">
            <p className="text-sm font-medium text-primary">{alert.title}</p>
            <span className="text-[12px] text-muted whitespace-nowrap">
              {new Date(alert.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <p className="text-[13px] text-secondary line-clamp-2 mb-1.5">{alert.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-muted">{alert.policyTitle}</span>
            {alert.isUnread && (
              <span className="text-[11px] font-medium text-primary">• New</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
