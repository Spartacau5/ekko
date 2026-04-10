import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { donors, TimelineEvent as TLEvent } from '../../data/donors';
import { donorGroups } from '../../data/groups';
import { actionsForEntity, ActionItem } from '../../data/actions';
import { notesForEntity } from '../../data/notes';
import {
  Button, Chip, SegmentedControl, useToast,
  TaskCard, FollowUpComposer, ActionDrawer, InternalNotePreview, Avatar,
} from '../../components/ui';
import { useRole } from '../../lib/RoleContext';
import { motionDurations, motionEasings } from '../../lib/motion';
import {
  ArrowLeft, Mail, Phone, User, Calendar, Gift, FileText, Download,
  Sparkles, MessageCircle, Briefcase, MapPin, TrendingUp, Clock, ChevronDown, Plus, Lock,
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
  const [composerOpen, setComposerOpen] = useState(false);
  const [drawerAction, setDrawerAction] = useState<ActionItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [showNoteComposer, setShowNoteComposer] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const toast = useToast();
  const { activeMember, hasCapability } = useRole();

  const donor = donors.find((d) => d.id === id);

  const linkedActions = useMemo(() => (id ? actionsForEntity('donor', id) : []), [id]);
  const donorNotes = useMemo(() => (id ? notesForEntity('donor', id) : []), [id]);
  const canAssign = hasCapability('assignActions');

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
            <button
              type="button"
              onClick={() => {
                const next = !isFavorited;
                setIsFavorited(next);
                toast.show({
                  type: next ? 'success' : 'info',
                  title: next ? 'Favorited' : 'Removed from favorites',
                  description: donor.name,
                });
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border rounded-sm
                transition-colors duration-150 ease-out
                ${isFavorited
                  ? 'bg-accent-soft border-accent text-primary'
                  : 'bg-surface border-border-subtle text-secondary hover:border-border-default hover:text-primary'}`}
            >
              {isFavorited ? '★ Favorited' : '☆ Favorite'}
            </button>
            <Button variant="secondary"><Mail size={14} className="mr-2" />Email</Button>
            <Button
              variant="secondary"
              onClick={() => setShowNoteComposer((s) => !s)}
            >
              <MessageCircle size={14} className="mr-2" />Add note
            </Button>
            <Button onClick={() => setComposerOpen(true)} disabled={!canAssign}>
              <Plus size={14} className="mr-1.5" />New follow-up
            </Button>
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
        {/* Left: tasks + timeline + persona + notes */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* Linked tasks */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-primary" />
                <h2 className="text-[15px] font-semibold text-primary">Open follow-ups</h2>
                <Chip
                  label={`${linkedActions.filter(a => a.status !== 'completed').length} active`}
                  variant={linkedActions.some(a => a.priority === 'urgent') ? 'danger' : 'default'}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setComposerOpen(true)}
                disabled={!canAssign}
              >
                <Plus size={13} className="mr-1" /> New
              </Button>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {linkedActions.length === 0 ? (
                <div className="px-2 py-6 text-center">
                  <p className="text-[13px] text-secondary">
                    No follow-ups assigned for {donor.name} yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => setComposerOpen(true)}
                    className="text-[13px] text-primary underline mt-1"
                    disabled={!canAssign}
                  >
                    Create the first follow-up
                  </button>
                </div>
              ) : (
                linkedActions.map((a) => (
                  <TaskCard
                    key={a.id}
                    action={a}
                    canEdit={canAssign}
                    onStatusChange={(actionId, next) => {
                      toast.show({
                        type: next === 'completed' ? 'success' : 'info',
                        title:
                          next === 'completed' ? 'Task completed' :
                          next === 'in_progress' ? 'Task started' : 'Task reopened',
                      });
                    }}
                    onOwnerChange={() => {
                      toast.show({ type: 'success', title: 'Task reassigned' });
                    }}
                    onOpenDrawer={(action) => {
                      setDrawerAction(action);
                      setDrawerOpen(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>

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
                      {filteredTimeline.slice(0, 5).map((event, idx, arr) => (
                        <TimelineEvent
                          key={`base-${event.date}-${idx}`}
                          event={event}
                          isLast={idx === arr.length - 1 && !timelineExpanded}
                        />
                      ))}
                      <AnimatePresence initial={false}>
                        {timelineExpanded &&
                          filteredTimeline.slice(5).map((event, idx, arr) => (
                            <motion.div
                              key={`extra-${event.date}-${idx}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{
                                duration: motionDurations.panel,
                                ease: motionEasings.out,
                                delay: idx * 0.04,
                              }}
                              style={{ overflow: 'hidden' }}
                            >
                              <TimelineEvent
                                event={event}
                                isLast={idx === arr.length - 1}
                              />
                            </motion.div>
                          ))}
                      </AnimatePresence>
                      {filteredTimeline.length > 5 && (
                        <button
                          onClick={() => setTimelineExpanded((e) => !e)}
                          className="w-full flex items-center justify-center gap-1.5 py-3 mt-1 border-t border-border-subtle text-[13px] text-secondary hover:text-primary transition-colors duration-150
                            focus-visible:outline-none focus-visible:bg-surface-muted/50 rounded-sm"
                        >
                          {timelineExpanded
                            ? 'Show less'
                            : `Show ${filteredTimeline.length - 5} more ${filteredTimeline.length - 5 === 1 ? 'event' : 'events'}`}
                          <motion.span
                            animate={{ rotate: timelineExpanded ? 180 : 0 }}
                            transition={{ duration: motionDurations.panel, ease: motionEasings.out }}
                            className="inline-flex"
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

          {/* Internal notes */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={15} className="text-primary" />
                <h2 className="text-[15px] font-semibold text-primary">Internal notes</h2>
                <span className="text-[12px] text-muted">{donorNotes.length}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowNoteComposer((s) => !s)}>
                <Plus size={13} className="mr-1" /> Note
              </Button>
            </div>
            <AnimatePresence initial={false}>
              {showNoteComposer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: motionDurations.panel, ease: motionEasings.out }}
                  style={{ overflow: 'hidden' }}
                  className="border-b border-border-subtle"
                >
                  <div className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <Avatar member={activeMember} size="sm" />
                      <div className="flex-1">
                        <textarea
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          rows={3}
                          placeholder="Add context for the team — what should the next person know?"
                          className="w-full px-3 py-2 text-[13px] bg-surface border border-border-subtle rounded-sm outline-none
                            placeholder:text-muted/80
                            hover:border-border-default/60 focus-visible:border-border-default focus-visible:ring-2 focus-visible:ring-border-default/40 focus-visible:ring-offset-1 focus-visible:ring-offset-surface"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-[11px] text-muted flex items-center gap-1">
                            <Lock size={11} /> Visible to your team only
                          </p>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => { setShowNoteComposer(false); setNoteDraft(''); }}>
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              disabled={!noteDraft.trim()}
                              onClick={() => {
                                toast.show({
                                  type: 'success',
                                  title: 'Note added',
                                  description: 'Your team will see it on this donor.',
                                });
                                setNoteDraft('');
                                setShowNoteComposer(false);
                              }}
                            >
                              Post note
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="px-5 divide-y divide-border-subtle">
              {donorNotes.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-[13px] text-secondary">No internal notes on {donor.name} yet.</p>
                </div>
              ) : (
                donorNotes.map((n) => <InternalNotePreview key={n.id} note={n} />)
              )}
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
                  onClick={() => setComposerOpen(true)}
                  disabled={!canAssign}
                >
                  Create follow-up
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

      <FollowUpComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultEntity={{ type: 'donor', id: donor.id, label: donor.name, link: `/people/donors/${donor.id}` }}
        defaultTitle={`Follow up with ${donor.name}`}
        defaultContext={donor.suggestedNextAction}
        onCreate={(payload) => {
          toast.show({
            type: 'success',
            title: 'Follow-up created',
            description: payload.title,
          });
        }}
      />
      <ActionDrawer
        action={drawerAction}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        canEdit={canAssign}
      />
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
