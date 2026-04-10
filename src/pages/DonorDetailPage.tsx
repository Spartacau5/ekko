import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { donors } from '../data/donors';
import { Button, Chip } from '../components/ui';
import { ArrowLeft, Mail, Phone, User, Calendar, Gift, FileText, Download, Sparkles } from 'lucide-react';

export function DonorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const donor = donors.find((d) => d.id === id);

  if (!donor) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Donor not found.</p>
        <Link to="/people" className="text-primary underline mt-2 inline-block">Back to people</Link>
      </div>
    );
  }

  const riskVariant = donor.risk === 'High' ? 'danger' : donor.risk === 'Medium' ? 'warning' : 'success';
  const statusVariant = donor.givingStatus === 'Active' ? 'success' : donor.givingStatus === 'At risk' || donor.givingStatus === 'Inactive' ? 'danger' : 'warning';

  return (
    <>
      <Link to="/people" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4">
        <ArrowLeft size={14} /> Back to people
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
              <div className="flex items-center gap-2 mt-3">
                <Chip label={donor.donorType} variant="default" />
                <Chip label={donor.givingStatus} variant={statusVariant} />
                <Chip label={`${donor.risk} risk`} variant={riskVariant} />
                <Chip label={donor.stage} variant="info" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary"><Mail size={14} className="mr-2" />Email</Button>
            <Button>Log activity</Button>
          </div>
        </div>

        {/* Quick stats grid */}
        <div className="grid grid-cols-4 gap-6 pt-5 border-t border-border-subtle">
          <StatBlock label="Lifetime giving" value={donor.lifetimeGiving ? `$${donor.lifetimeGiving.toLocaleString()}` : '\u2014'} />
          <StatBlock label="Last gift" value={typeof donor.lastGift === 'number' ? `$${donor.lastGift.toLocaleString()}` : donor.lastGift || '\u2014'} />
          <StatBlock label="Account owner" value={donor.accountOwner} />
          <StatBlock label="Last engagement" value={donor.lastEngagement} small />
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: timeline */}
        <div className="col-span-8">
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h2 className="text-[15px] font-semibold text-primary">Activity timeline</h2>
              <p className="text-[13px] text-muted mt-0.5">Engagements, gifts, and meeting notes</p>
            </div>
            <div className="px-5 py-2">
              {donor.timeline.map((event, idx) => (
                <TimelineEvent
                  key={idx}
                  event={event}
                  isLast={idx === donor.timeline.length - 1}
                />
              ))}
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
                <Button size="sm" className="w-full justify-center">Take action</Button>
                <Button size="sm" variant="ghost" className="w-full justify-center">Dismiss</Button>
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

function TimelineEvent({ event, isLast }: { event: any; isLast: boolean }) {
  const iconMap: any = {
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
        <div className="w-7 h-7 rounded-full bg-surface-muted border border-border-subtle flex items-center justify-center text-secondary">
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
