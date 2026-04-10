import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { donors, TimelineEvent as TLEvent } from '../../data/donors';
import { donorGroups } from '../../data/groups';
import { Button, Chip, SegmentedControl, useToast } from '../../components/ui';
import { motionDurations, motionEasings } from '../../lib/motion';
import {
  ArrowLeft, Mail, Phone, User, Calendar, Gift, FileText, Download,
  Sparkles, MessageCircle, Briefcase, MapPin, TrendingUp, Clock, ChevronDown,
} from 'lucide-react';

const timelineFilters = [
  { value: 'all', label: 'All' },
  { value: 'gifts', label: 'Gifts' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'meetings', label: 'Meetings' },
];

export function DonorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const toast = useToast();

  const donor = donors.find((d) => d.id === id);

  const filteredTimeline = useMemo(() => {
    if (!donor) return [];
    if (timelineFilter === 'all') return donor.timeline;
    if (timelineFilter === 'gifts') return donor.timeline.filter(e => e.type === 'gift');
    if (timelineFilter === 'engagement') return donor.timeline.filter(e => ['email', 'download', 'event'].includes(e.type));
    if (timelineFilter === 'meetings') return donor.timeline.filter(e => ['meeting', 'call', 'note'].includes(e.type));
    return donor.timeline;
  }, [donor, timelineFilter]);

  // Find which groups this donor belongs to
  const memberOfGroups = useMemo(() => {
    if (!donor) return [];
    return donorGroups.filter(g => g.memberIds.includes(donor.id));
  }, [donor]);

  if (!donor) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Donor not found.</p>
        <Link to="/people/donors" className="text-primary underline mt-2 inline-block">Back to donors</Link>
      </div>
    );
  }

  const riskVariant = donor.risk === 'High' ? 'danger' : donor.risk === 'Medium' ? 'warning' : 'success';
  const statusVariant = donor.givingStatus === 'Active' ? 'success' : donor.givingStatus === 'At risk' || donor.givingStatus === 'Inactive' ? 'danger' : 'warning';

  // Compute engagement score from timeline density (mocked but feels real)
  const recentActivity = donor.timeline.filter(e => {
    const d = new Date(e.date);
    const cutoff = new Date('2026-01-01');
    return d >= cutoff;
  }).length;
  const engagementScore = Math.min(100, recentActivity * 18 + (donor.givingStatus === 'Active' ? 30 : donor.givingStatus === 'At risk' ? 10 : 0));

  return (
    <>
      <Link to="/people/donors" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4">
        <ArrowLeft size={14} /> Back to donors
      </Link>

      {/* Header */}
      <div className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-sm bg-accent-soft border border-border-subtle flex items-center justify-center flex-shrink-0">
              <span className="text-[20px] font-semibold text-primary">
                {donor.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-[28px] leading-[36px] font-semibold font-serif text-primary">{donor.name}</h1>
              <p className="text-sm text-secondary mt-0.5">{donor.persona}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Chip label={donor.donorType} variant="default" />
                <Chip label={donor.givingStatus} variant={statusVariant} />
                <Chip label={`${donor.risk} risk`} variant={riskVariant} />
                <Chip label={donor.stage} variant="info" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary"><Mail size={14} className="mr-2" />Email</Button>
            <Button variant="secondary"><MessageCircle size={14} className="mr-2" />Note</Button>
            <Button>Log activity</Button>
          </div>
        </div>

        {/* Quick stats grid */}
        <div className="grid grid-cols-5 gap-6 pt-5 border-t border-border-subtle">
          <StatBlock label="Lifetime giving" value={donor.lifetimeGiving ? `$${donor.lifetimeGiving.toLocaleString()}` : '\u2014'} />
          <StatBlock label="Last gift" value={typeof donor.lastGift === 'number' ? `$${donor.lastGift.toLocaleString()}` : donor.lastGift || '\u2014'} />
          <StatBlock label="Engagement" value={`${engagementScore}/100`} small />
          <StatBlock label="Account owner" value={donor.accountOwner} small />
          <StatBlock label="Last engagement" value={donor.lastEngagement} small />
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: timeline */}
        <div className="col-span-8 flex flex-col gap-6">
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-primary">Activity timeline</h2>
                <p className="text-[13px] text-muted mt-0.5">Engagements, gifts, and meeting notes</p>
              </div>
              <SegmentedControl
                size="sm"
                options={timelineFilters}
                value={timelineFilter}
                onChange={(v) => { setTimelineFilter(v); setTimelineExpanded(false); }}
              />
            </div>
            <div className="px-5 py-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={timelineFilter}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
                >
                  {filteredTimeline.length === 0 ? (
                    <div className="py-10 flex flex-col items-center text-center">
                      <Calendar size={24} className="text-muted mb-2" />
                      <p className="text-sm font-medium text-primary mb-1">No {timelineFilter} activity</p>
                      <p className="text-[13px] text-muted">Try a different filter to see more events.</p>
                    </div>
                  ) : (
                    <>
                      {(timelineExpanded ? filteredTimeline : filteredTimeline.slice(0, 5)).map((event, idx, arr) => (
                        <TimelineEvent
                          key={`${event.date}-${idx}`}
                          event={event}
                          isLast={idx === arr.length - 1}
                        />
                      ))}
                      {filteredTimeline.length > 5 && (
                        <button
                          onClick={() => setTimelineExpanded((e) => !e)}
                          className="w-full flex items-center justify-center gap-1.5 py-3 mt-1 border-t border-border-subtle text-[13px] text-secondary hover:text-primary transition-colors duration-150"
                        >
                          {timelineExpanded
                            ? 'Show less'
                            : `Show ${filteredTimeline.length - 5} more ${filteredTimeline.length - 5 === 1 ? 'event' : 'events'}`}
                          <motion.span
                            animate={{ rotate: timelineExpanded ? 180 : 0 }}
                            transition={{ duration: motionDurations.panel, ease: motionEasings.out }}
                          >
                            <ChevronDown size={13} />
                          </motion.span>
                        </button>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Persona insight */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h2 className="text-[15px] font-semibold text-primary">Persona insight</h2>
              <p className="text-[13px] text-muted mt-0.5">What we know about how they engage</p>
            </div>
            <div className="p-5 grid grid-cols-2 gap-5">
              <InsightItem
                icon={<TrendingUp size={14} />}
                label="Engagement pattern"
                value={donor.givingStatus === 'Active' ? 'Consistent, increasing' : donor.givingStatus === 'At risk' ? 'Declining over 90 days' : 'Sporadic'}
              />
              <InsightItem
                icon={<Clock size={14} />}
                label="Best time to reach"
                value="Weekday mornings"
              />
              <InsightItem
                icon={<Briefcase size={14} />}
                label="Preferred channel"
                value={donor.donorType.includes('Foundation') ? 'In-person meeting' : 'Email'}
              />
              <InsightItem
                icon={<MapPin size={14} />}
                label="Geographic interest"
                value="Brooklyn, Queens"
              />
            </div>
          </div>
        </div>

        {/* Right: side panels */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Suggested next step */}
          <div className="bg-surface border border-border-subtle rounded-md overflow-hidden">
            <div className="px-5 py-4 bg-accent-soft/40 border-b border-border-subtle flex items-center gap-2">
              <Sparkles size={15} className="text-primary" />
              <h3 className="text-[14px] font-semibold text-primary">Suggested next step</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-primary leading-relaxed mb-4">{donor.suggestedNextAction}</p>
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => toast.show({
                    type: 'success',
                    title: 'Action assigned',
                    description: `${donor.accountOwner} will follow up with ${donor.name}.`,
                  })}
                >
                  Take action
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-center"
                  onClick={() => toast.show({
                    type: 'info',
                    title: 'Suggestion dismissed',
                    description: "We'll surface a new one tomorrow.",
                  })}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-3 border-b border-border-subtle">
              <h3 className="text-[14px] font-semibold text-primary">Contact</h3>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <ContactRow icon={<Mail size={14} />} label={donor.email} />
              <ContactRow icon={<Phone size={14} />} label={donor.phone} />
              <ContactRow icon={<User size={14} />} label={`Owned by ${donor.accountOwner}`} />
            </div>
          </div>

          {/* Group memberships */}
          {memberOfGroups.length > 0 && (
            <div className="bg-surface border border-border-subtle rounded-md">
              <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-primary">Member of</h3>
                <span className="text-[12px] text-muted">{memberOfGroups.length}</span>
              </div>
              <div className="p-5 flex flex-col gap-2">
                {memberOfGroups.map(g => (
                  <Link
                    key={g.id}
                    to={`/people/groups/${g.id}`}
                    className="flex items-start justify-between gap-2 text-[13px] hover:bg-surface-muted/50 -mx-2 px-2 py-1 rounded-sm transition-colors no-underline"
                  >
                    <span className="text-primary font-medium">{g.name}</span>
                    <span className="text-muted text-[12px]">{g.memberCount}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-3 border-b border-border-subtle">
              <h3 className="text-[14px] font-semibold text-primary">Mission interests</h3>
            </div>
            <div className="p-5 flex flex-wrap gap-2">
              {donor.interests.map((interest) => (
                <Chip key={interest} label={interest} variant="default" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatBlock({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className={`font-semibold text-primary ${small ? 'text-sm leading-tight' : 'text-[22px] leading-[28px]'}`}>
        {value}
      </p>
    </div>
  );
}

function ContactRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px] text-secondary">
      <span className="text-muted">{icon}</span>
      <span className="text-primary">{label}</span>
    </div>
  );
}

function InsightItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-muted">{icon}</span>
        <span className="text-[12px] font-medium text-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm text-primary">{value}</p>
    </div>
  );
}

function TimelineEvent({ event, isLast }: { event: TLEvent; isLast: boolean }) {
  const iconMap: Record<string, React.ReactNode> = {
    gift: <Gift size={13} />,
    email: <Mail size={13} />,
    event: <Calendar size={13} />,
    meeting: <User size={13} />,
    note: <FileText size={13} />,
    call: <Phone size={13} />,
    download: <Download size={13} />,
  };
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex gap-4 py-3">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-7 h-7 rounded-full border flex items-center justify-center
          ${event.type === 'gift' ? 'bg-accent-soft border-accent text-primary' : 'bg-surface-muted border-border-subtle text-secondary'}`}>
          {iconMap[event.type] || <FileText size={13} />}
        </div>
        {!isLast && <div className="flex-1 w-px bg-border-subtle min-h-4 mt-1" />}
      </div>
      <div className="flex-1 pb-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-primary">{event.title}</p>
          <span className="text-[12px] text-muted whitespace-nowrap">{formattedDate}</span>
        </div>
        {event.description && (
          <p className="text-[13px] text-secondary mt-0.5">{event.description}</p>
        )}
      </div>
    </div>
  );
}
