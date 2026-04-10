import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { donorGroups } from '../../data/groups';
import { donors } from '../../data/donors';
import { Button, Chip, KPI } from '../../components/ui';
import { ArrowLeft, Users, Mail, Tag, Settings as SettingsIcon } from 'lucide-react';

export function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const group = donorGroups.find(g => g.id === id);

  if (!group) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Group not found.</p>
        <Link to="/people/groups" className="text-primary underline mt-2 inline-block">Back to groups</Link>
      </div>
    );
  }

  // Find members in donors data (some may not exist in mock)
  const members = donors.filter(d => group.memberIds.includes(d.id));

  // Mock trend data
  const trend = [54, 56, 58, 60, 63, 65, 68, group.memberCount > 100 ? 75 : 70, 72, group.memberCount];

  return (
    <>
      <Link to="/people/groups" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4">
        <ArrowLeft size={14} /> Back to groups
      </Link>

      {/* Header */}
      <div className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-sm bg-info-soft border border-border-subtle flex items-center justify-center flex-shrink-0">
              <Users size={24} className="text-info" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Chip label={group.type} variant="info" />
                {group.tags.map(t => <Chip key={t} label={t} variant="default" />)}
              </div>
              <h1 className="text-[28px] leading-[36px] font-semibold font-serif text-primary">{group.name}</h1>
              <p className="text-sm text-secondary mt-1 max-w-2xl">{group.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary"><Mail size={14} className="mr-2" />Email all</Button>
            <Button variant="secondary"><Tag size={14} className="mr-2" />Edit criteria</Button>
            <Button variant="secondary"><SettingsIcon size={14} /></Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 pt-5 border-t border-border-subtle">
          <Stat label="Members" value={group.memberCount.toLocaleString()} />
          <Stat label="Lifetime giving" value={`$${(group.totalLifetime / 1000).toFixed(0)}K`} />
          <Stat label="Average gift" value={`$${group.avgGift.toLocaleString()}`} />
          <Stat label="Engagement" value={`${group.engagementScore}/100`} />
        </div>
      </div>

      {/* Two column */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 flex flex-col gap-6">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <KPI
              label="Members"
              value={group.memberCount.toString()}
              delta={group.growthLast90}
              deltaLabel="last 90 days"
              trend={trend}
            />
            <KPI
              label="Lifetime"
              value={`$${(group.totalLifetime / 1000).toFixed(0)}K`}
              delta={4.2}
              deltaLabel="vs. last quarter"
              trend={[180, 184, 188, 192, 196, 198, 201, 205, 207, group.totalLifetime / 1000]}
            />
            <KPI
              label="Engagement score"
              value={`${group.engagementScore}`}
              delta={group.engagementScore >= 70 ? 3 : -2}
              deltaLabel="vs. last month"
              trend={[group.engagementScore - 5, group.engagementScore - 4, group.engagementScore - 3, group.engagementScore - 2, group.engagementScore - 3, group.engagementScore - 1, group.engagementScore - 2, group.engagementScore - 1, group.engagementScore - 1, group.engagementScore]}
            />
          </div>

          {/* Members table */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-primary">Members</h2>
                <p className="text-[13px] text-muted mt-0.5">
                  {members.length === 0 ? `${group.memberCount} total members` : `Showing ${members.length} of ${group.memberCount} members`}
                </p>
              </div>
              <Link to="/people/donors" className="text-[13px] text-secondary hover:text-primary underline">View all</Link>
            </div>
            {members.length === 0 ? (
              <div className="py-12 text-center">
                <Users size={28} className="mx-auto text-muted mb-2" />
                <p className="text-sm text-muted">No mock members in this preview</p>
                <p className="text-[12px] text-muted mt-1">{group.memberCount} donors are in this group</p>
              </div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {members.map(d => (
                  <Link
                    key={d.id}
                    to={`/people/donors/${d.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-surface-muted/30 no-underline"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-sm bg-accent-soft border border-border-subtle flex items-center justify-center flex-shrink-0">
                        <span className="text-[12px] font-semibold text-primary">{d.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-primary">{d.name}</p>
                        <p className="text-[12px] text-muted truncate">{d.persona}</p>
                      </div>
                    </div>
                    <div className="text-[13px] text-secondary">
                      {d.lifetimeGiving ? `$${d.lifetimeGiving.toLocaleString()}` : '\u2014'}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Top interests */}
          <Card title="Top interests">
            <div className="flex flex-col gap-2">
              {group.topInterests.map(interest => (
                <div key={interest} className="flex items-center justify-between text-[13px]">
                  <span className="text-primary">{interest}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Group details */}
          <Card title="Group details">
            <DetailRow label="Type" value={group.type.charAt(0).toUpperCase() + group.type.slice(1)} />
            <DetailRow label="Created" value={new Date(group.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
            <DetailRow label="Last updated" value={new Date(group.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
            <DetailRow label="Created by" value={group.createdBy} />
          </Card>

          {/* Tags */}
          <Card title="Tags">
            <div className="flex flex-wrap gap-2">
              {group.tags.map(tag => <Chip key={tag} label={tag} variant="default" />)}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className={`font-semibold text-primary ${small ? 'text-sm leading-tight' : 'text-[22px] leading-[28px]'}`}>{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md">
      <div className="px-5 py-3 border-b border-border-subtle">
        <h3 className="text-[14px] font-semibold text-primary">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border-subtle last:border-0 first:pt-0">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="text-[13px] text-primary font-medium">{value}</span>
    </div>
  );
}
