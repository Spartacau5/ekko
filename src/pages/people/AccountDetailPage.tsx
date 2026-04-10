import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { accounts } from '../../data/accounts';
import { Button, Chip, BarChart } from '../../components/ui';
import {
  ArrowLeft, Building, Mail, Calendar, Globe, MapPin, User, Star,
  FileText, Gift, MessageCircle, Briefcase,
} from 'lucide-react';

export function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const account = accounts.find(a => a.id === id);

  if (!account) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Account not found.</p>
        <Link to="/people/accounts" className="text-primary underline mt-2 inline-block">Back to accounts</Link>
      </div>
    );
  }

  const stageVariant: any = {
    'Active partner': 'success',
    'Cultivation': 'warning',
    'Stewardship': 'info',
    'Lapsed': 'danger',
    'Prospect': 'default',
  };

  const giftChartData = account.giftHistory.map(g => ({
    label: g.year,
    value: g.amount,
  }));

  return (
    <>
      <Link to="/people/accounts" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4">
        <ArrowLeft size={14} /> Back to accounts
      </Link>

      {/* Header */}
      <div className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center flex-shrink-0">
              <Building size={24} className="text-secondary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Chip label={account.type} variant="info" />
                <Chip label={account.stage} variant={stageVariant[account.stage]} />
                {account.tags.slice(0, 2).map(t => <Chip key={t} label={t} variant="default" />)}
              </div>
              <h1 className="text-[28px] leading-[36px] font-semibold font-serif text-primary">{account.name}</h1>
              <p className="text-sm text-secondary mt-1">{account.primaryProgram}</p>
              <div className="flex items-center gap-4 mt-2 text-[13px] text-muted">
                <span className="flex items-center gap-1"><MapPin size={12} />{account.location}</span>
                {account.industry && <span className="flex items-center gap-1"><Briefcase size={12} />{account.industry}</span>}
                {account.website && <span className="flex items-center gap-1"><Globe size={12} />{account.website}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary"><Mail size={14} className="mr-2" />Email</Button>
            <Button variant="secondary"><FileText size={14} className="mr-2" />Add note</Button>
            <Button>Log activity</Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 pt-5 border-t border-border-subtle">
          <Stat label="Lifetime" value={`$${account.totalLifetime.toLocaleString()}`} />
          <Stat label="Last gift" value={account.lastGift > 0 ? `$${account.lastGift.toLocaleString()}` : '\u2014'} sublabel={account.lastGiftDate ? new Date(account.lastGiftDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined} />
          <Stat label="Next renewal" value={account.nextRenewal ? new Date(account.nextRenewal).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'} small />
          <Stat label="Owner" value={account.accountOwner} small />
        </div>
      </div>

      {/* Two col */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 flex flex-col gap-6">
          {/* Gift history chart */}
          {giftChartData.length > 0 && (
            <div className="bg-surface border border-border-subtle rounded-md">
              <div className="px-5 py-4 border-b border-border-subtle">
                <h2 className="text-[15px] font-semibold text-primary">Giving history</h2>
                <p className="text-[13px] text-muted mt-0.5">Annual contributions over time</p>
              </div>
              <div className="p-6">
                <BarChart data={giftChartData} height={180} format={(n) => `$${(n / 1000).toFixed(0)}K`} />
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h2 className="text-[15px] font-semibold text-primary">Activity timeline</h2>
              <p className="text-[13px] text-muted mt-0.5">Meetings, gifts, proposals, and notes</p>
            </div>
            <div className="px-5 py-2">
              {account.timeline.map((event, idx) => (
                <TimelineRow key={idx} event={event} isLast={idx === account.timeline.length - 1} />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-primary">Account notes</h2>
                <p className="text-[13px] text-muted mt-0.5">Internal context for the team</p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            <div className="p-5">
              <p className="text-sm text-primary leading-relaxed">{account.notes}</p>
            </div>
          </div>
        </div>

        {/* Side */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Contacts */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-primary">Contacts</h3>
              <span className="text-[12px] text-muted">{account.contacts.length}</span>
            </div>
            <div className="divide-y divide-border-subtle">
              {account.contacts.map(c => (
                <div key={c.email} className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent-soft border border-border-subtle flex items-center justify-center flex-shrink-0">
                      <span className="text-[12px] font-semibold text-primary">{c.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-primary truncate">{c.name}</p>
                        {c.isPrimary && <Star size={11} className="text-accent fill-accent" />}
                      </div>
                      <p className="text-[12px] text-muted truncate">{c.role}</p>
                      <p className="text-[12px] text-secondary truncate">{c.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-3 border-b border-border-subtle">
              <h3 className="text-[14px] font-semibold text-primary">Tags</h3>
            </div>
            <div className="p-5 flex flex-wrap gap-2">
              {account.tags.map(tag => <Chip key={tag} label={tag} variant="default" />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, small, sublabel }: { label: string; value: string; small?: boolean; sublabel?: string }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className={`font-semibold text-primary ${small ? 'text-sm leading-tight' : 'text-[22px] leading-[28px]'}`}>{value}</p>
      {sublabel && <p className="text-[12px] text-muted mt-0.5">{sublabel}</p>}
    </div>
  );
}

function TimelineRow({ event, isLast }: { event: any; isLast: boolean }) {
  const iconMap: any = {
    meeting: <User size={13} />,
    gift: <Gift size={13} />,
    proposal: <FileText size={13} />,
    note: <MessageCircle size={13} />,
    email: <Mail size={13} />,
    event: <Calendar size={13} />,
  };
  const date = new Date(event.date);
  return (
    <div className="flex gap-4 py-3">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-7 h-7 rounded-full border flex items-center justify-center
          ${event.type === 'gift' ? 'bg-accent-soft border-accent text-primary' : 'bg-surface-muted border-border-subtle text-secondary'}`}>
          {iconMap[event.type]}
        </div>
        {!isLast && <div className="flex-1 w-px bg-border-subtle min-h-4 mt-1" />}
      </div>
      <div className="flex-1 pb-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-primary">{event.title}</p>
          <span className="text-[12px] text-muted whitespace-nowrap">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        {event.description && <p className="text-[13px] text-secondary mt-0.5">{event.description}</p>}
      </div>
    </div>
  );
}
