// Campaign Builder. Reached from the Communications dashboard's "Create
// advocacy campaign" task. Translates a linked policy into compelling content
// across formats — Poster, Post, RSVP, Donation Page, and Policy Brief —
// with a live preview and AI-assisted drafting.

import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Eye,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Calendar,
  Clock,
  ChevronDown,
  Check,
  Plus,
  Lightbulb,
  Globe,
  Pencil,
  Image as ImageIcon,
  MessageSquare,
  CalendarCheck,
  Heart as HeartIcon,
  FileText,
  MapPin,
  Users,
  Quote,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { motionDurations, motionEasings } from '../lib/motion';
import { Button, useToast } from '../components/ui';
import { policies } from '../data/policies';
import { teamMembers } from '../data/team';
import { Avatar } from '../components/ui/Avatar';

type ContentType = 'poster' | 'post' | 'rsvp' | 'donation' | 'brief';
type Tone = 'friendly' | 'informal' | 'serious' | 'urgent';
type Length = 'short' | 'medium' | 'long';

const CONTENT_TYPES: Array<{
  id: ContentType;
  label: string;
  short: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  isNew?: boolean;
}> = [
  { id: 'poster',   label: 'Poster',        short: 'Poster',  icon: ImageIcon },
  { id: 'post',     label: 'Post',          short: 'Post',    icon: MessageSquare },
  { id: 'rsvp',     label: 'RSVP',          short: 'RSVP',    icon: CalendarCheck },
  { id: 'donation', label: 'Donation Page', short: 'Donate',  icon: HeartIcon },
  { id: 'brief',    label: 'Policy Brief',  short: 'Brief',   icon: FileText, isNew: true },
];

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook',  label: 'Facebook' },
  { value: 'linkedin',  label: 'LinkedIn' },
  { value: 'x',         label: 'X' },
];

const TONES: Array<{ id: Tone; label: string }> = [
  { id: 'friendly', label: 'Friendly' },
  { id: 'informal', label: 'Informal' },
  { id: 'serious',  label: 'Serious' },
  { id: 'urgent',   label: 'Urgent' },
];

const LENGTHS: Array<{ id: Length; label: string }> = [
  { id: 'short',  label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'long',   label: 'Long' },
];

const DEFAULT_CAPTION = `Big news for food justice in NYC.

The NYC Food Expansion Act is heading to a City Council vote on June 10 — and if it passes, 85,000 more New Yorkers in Brooklyn, Queens, and the Bronx will gain access to emergency food assistance.

At Provide Food NYC, we've been serving these communities through our kitchen partnerships in Brownsville and East New York. This bill would mean we can reach even more families who need support.

Here's how you can help:
— Share this post to spread the word
— Submit written testimony at council.nyc.gov/testimony
— Attend the public hearing: June 10, City Hall

Every voice matters. Let's make sure no New Yorker goes hungry because of where they live.

#FoodJusticeNYC #NYCFoodExpansionAct #ProvideFoodNYC #FoodAccess #CommunityAction`;

const TALKING_POINTS = [
  '85,000 more New Yorkers would gain access to emergency food assistance.',
  'Expansion covers Brownsville, East New York, and South Bronx — communities we already serve.',
  'Floor vote: June 10 — public testimony is open.',
];

export function CampaignBuilderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const policyId = searchParams.get('policy') ?? 'nyc-food-expansion';
  const linkedPolicy = policies.find((p) => p.id === policyId) ?? policies.find((p) => p.id === 'nyc-food-expansion');
  const author = teamMembers.find((m) => m.id === 'hannah-win');
  const toast = useToast();

  const [contentType, setContentType] = useState<ContentType>('post');
  const [campaignName, setCampaignName] = useState('Voices for Food Access: NYC Expansion Act');
  const [platform, setPlatform] = useState<string>('instagram');
  const [title, setTitle] = useState("Your zip code shouldn't decide if you eat tonight.");
  const [caption, setCaption] = useState(DEFAULT_CAPTION);
  const [location, setLocation] = useState('New York City');

  const [aiMode, setAiMode] = useState<'ai' | 'regular'>('ai');
  const [tone, setTone] = useState<Tone>('friendly');
  const [length, setLength] = useState<Length>('medium');

  const [scheduleMode, setScheduleMode] = useState<'now' | 'scheduled'>('scheduled');
  const [scheduleDate, setScheduleDate] = useState('2026-04-30');
  const [scheduleTime, setScheduleTime] = useState('19:00');

  const [shareFacebook, setShareFacebook] = useState(true);
  const [shareLinkedin, setShareLinkedin] = useState(false);
  const [shareX, setShareX] = useState(false);

  const platformLabel = useMemo(
    () => PLATFORMS.find((p) => p.value === platform)?.label ?? 'Instagram',
    [platform],
  );

  const handleInsertTalkingPoint = (point: string) => {
    setCaption((prev) => `${point}\n\n${prev}`.trim());
    toast.show({ type: 'info', title: 'Inserted into caption', description: point });
  };

  const handleRegenerate = () => {
    toast.show({
      type: 'info',
      title: 'Regenerated draft',
      description: `Tone: ${tone} · Length: ${length}`,
    });
  };

  const handleSaveDraft = () => {
    toast.show({ type: 'success', title: 'Draft saved', description: campaignName });
  };

  const handleSchedule = () => {
    if (scheduleMode === 'scheduled' && (!scheduleDate || !scheduleTime)) {
      toast.show({
        type: 'warning',
        title: 'Pick a date and time',
        description: 'Set when this campaign should go live.',
      });
      return;
    }
    toast.show({
      type: 'success',
      title: scheduleMode === 'now' ? 'Sent' : 'Scheduled',
      description:
        scheduleMode === 'now'
          ? `${campaignName} is live on ${platformLabel}.`
          : `${campaignName} will publish ${scheduleDate} at ${scheduleTime}.`,
    });
    navigate('/campaigns/voices-food-access/analytics');
  };

  return (
    <>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-primary mb-4 no-underline"
      >
        <ArrowLeft size={14} /> Back to home
      </Link>

      {/* Header */}
      <header className="mb-6 pb-5 border-b border-border-subtle">
        <p className="eyebrow mb-2.5">Campaign builder</p>
        <h1 className="page-title mb-1.5">Create campaign</h1>
        <p className="text-[14px] leading-[22px] text-secondary max-w-2xl">
          Translate <span className="text-primary font-medium">{linkedPolicy?.title}</span> into a campaign that moves
          your community to act. Pick a format, draft the messaging, and preview as you go.
        </p>
      </header>

      {/* Two-column layout — right column matches left's height */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-6 items-stretch">
        {/* LEFT — Builder form */}
        <div className="bg-surface border border-border-subtle rounded-lg shadow-card overflow-hidden">
          {/* Inline campaign-name header — single line, edit-in-place feel */}
          <div className="px-6 pt-5 pb-4 border-b border-border-subtle">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted mb-1">
              Campaign name
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="flex-1 min-w-0 text-[18px] font-semibold text-primary bg-transparent border-none outline-none p-0 placeholder:text-muted/70"
              />
              <Pencil size={13} className="text-muted shrink-0" aria-hidden="true" />
            </div>
          </div>

          {/* Policy context — slim band with click-to-insert chips */}
          {linkedPolicy && (
            <div className="px-6 py-4 bg-brand/[0.04] border-b border-brand/15">
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles size={13} className="text-accent shrink-0" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">
                    Policy
                  </span>
                  <span className="text-[11px] text-muted">·</span>
                  <Link
                    to={`/policy/${linkedPolicy.id}`}
                    className="text-[13px] font-semibold text-primary hover:text-brand no-underline truncate"
                  >
                    {linkedPolicy.title}
                  </Link>
                </div>
                <span className="inline-flex items-center px-2 h-[20px] text-[10px] font-semibold leading-none rounded-full bg-danger-soft text-danger shrink-0 tracking-[0.04em]">
                  Floor vote · June 10
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Lightbulb size={12} className="text-muted mt-[5px] shrink-0" />
                <div className="flex flex-wrap gap-1.5 min-w-0">
                  {TALKING_POINTS.map((point, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInsertTalkingPoint(point)}
                      title="Insert into caption"
                      className="group inline-flex items-start gap-1.5 max-w-full px-2 py-1 rounded-sm bg-surface border border-border-subtle text-[11.5px] text-primary text-left leading-snug hover:border-brand hover:bg-brand-soft/40 transition-colors"
                    >
                      <span className="mt-px inline-flex items-center justify-center w-[14px] h-[14px] rounded-full bg-brand text-white text-[9px] font-semibold tabular-nums shrink-0 group-hover:bg-brand-hover">
                        {idx + 1}
                      </span>
                      <span className="truncate">{point}</span>
                      <Plus size={10} className="text-muted group-hover:text-brand mt-[3px] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Body sections */}
          <div className="px-6 py-5 space-y-6">
            {/* Section 1 — Messaging */}
            <FormSection
              icon={<MessageCircle size={13} />}
              eyebrow="Messaging"
              hint="Where it posts and what it says"
            >
              {/* Platform + title row */}
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3">
                <CompactField label="Platform">
                  <div className="relative">
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 text-[13px] bg-surface border border-border-subtle rounded-sm outline-none appearance-none cursor-pointer focus:border-border-default"
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  </div>
                </CompactField>
                <CompactField label="Title">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="A short, attention-grabbing headline"
                    className="w-full px-3 py-2 text-[13px] bg-surface border border-border-subtle rounded-sm outline-none transition-colors focus:border-border-default placeholder:text-muted/80"
                  />
                </CompactField>
              </div>

              {/* Caption editor with embedded toolbar */}
              <CompactField label="Caption">
                <div
                  className={`rounded-sm border bg-surface overflow-hidden transition-colors
                    ${aiMode === 'ai' ? 'border-accent/40' : 'border-border-subtle'}`}
                >
                  {/* Slim toolbar */}
                  <div className={`flex items-center justify-between gap-2 px-2.5 py-1.5 border-b text-[11.5px]
                    ${aiMode === 'ai' ? 'bg-accent-soft/40 border-accent/25' : 'bg-surface-muted/40 border-border-subtle'}`}>
                    <AIModeToggle value={aiMode} onChange={setAiMode} />
                    <span className="text-[10.5px] tabular-nums text-muted">
                      {caption.length} chars
                    </span>
                  </div>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2.5 text-[13px] leading-[1.55] bg-transparent border-none outline-none resize-none placeholder:text-muted/80"
                  />
                  {/* Inline AI controls */}
                  {aiMode === 'ai' && (
                    <div className="px-2.5 py-2 border-t border-accent/25 bg-accent-soft/30 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">Tone</span>
                      <ChipPills
                        options={TONES}
                        value={tone}
                        onChange={(v) => setTone(v as Tone)}
                      />
                      <span className="w-px h-4 bg-accent/30 mx-1" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">Length</span>
                      <ChipPills
                        options={LENGTHS}
                        value={length}
                        onChange={(v) => setLength(v as Length)}
                      />
                      <button
                        type="button"
                        onClick={handleRegenerate}
                        className="ml-auto inline-flex items-center gap-1 h-7 px-2.5 rounded-sm bg-accent text-white text-[11.5px] font-semibold hover:bg-accent-hover transition-colors"
                      >
                        <RefreshCw size={11} /> Regenerate
                      </button>
                    </div>
                  )}
                </div>
              </CompactField>
            </FormSection>

            {/* Section 2 — Distribution */}
            <FormSection
              icon={<Globe size={13} />}
              eyebrow="Distribution"
              hint="Where, when, and which channels"
            >
              {/* Location + schedule mode in one row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CompactField label="Location">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York City"
                    className="w-full px-3 py-2 text-[13px] bg-surface border border-border-subtle rounded-sm outline-none focus:border-border-default placeholder:text-muted/80"
                  />
                </CompactField>
                <CompactField label="Publish">
                  <SegmentedToggle
                    options={[
                      { id: 'now',       label: 'Send now' },
                      { id: 'scheduled', label: 'Schedule' },
                    ]}
                    value={scheduleMode}
                    onChange={(v) => setScheduleMode(v as 'now' | 'scheduled')}
                  />
                </CompactField>
              </div>

              {/* Date+time inline (only when scheduled) */}
              {scheduleMode === 'scheduled' && (
                <div className="grid grid-cols-[1fr_140px] gap-2">
                  <DateTimeInput
                    icon={<Calendar size={13} />}
                    type="date"
                    value={scheduleDate}
                    onChange={setScheduleDate}
                    placeholder="Date"
                  />
                  <DateTimeInput
                    icon={<Clock size={13} />}
                    type="time"
                    value={scheduleTime}
                    onChange={setScheduleTime}
                    placeholder="Time"
                  />
                </div>
              )}

              {/* Cross-post toggles as inline chips */}
              <CompactField label="Cross-post">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <CrossPostChip
                    label="Facebook"
                    logo={<FacebookLogo />}
                    checked={shareFacebook}
                    onChange={setShareFacebook}
                  />
                  <CrossPostChip
                    label="LinkedIn"
                    logo={<LinkedInLogo />}
                    checked={shareLinkedin}
                    onChange={setShareLinkedin}
                  />
                  <CrossPostChip
                    label=""
                    logo={<XLogo />}
                    checked={shareX}
                    onChange={setShareX}
                  />
                </div>
              </CompactField>
            </FormSection>
          </div>

          {/* Sticky action bar */}
          <div className="sticky bottom-0 px-6 py-3.5 bg-surface/95 backdrop-blur border-t border-border-subtle flex items-center justify-between gap-3">
            <p className="text-[11.5px] text-muted">
              {scheduleMode === 'now'
                ? 'Will publish immediately on save.'
                : scheduleDate && scheduleTime
                  ? `Scheduled for ${scheduleDate} · ${scheduleTime}`
                  : 'Pick a date and time to schedule.'}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="md" onClick={handleSaveDraft}>Save Draft</Button>
              <button
                type="button"
                onClick={handleSchedule}
                className="inline-flex items-center gap-1.5 h-9 px-5 rounded-sm bg-brand text-white text-[13px] font-semibold hover:bg-brand-hover transition-colors"
              >
                {scheduleMode === 'now' ? 'Send now' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Live preview (matches left's height) */}
        <div className="bg-surface border border-border-subtle rounded-lg shadow-card overflow-hidden flex flex-col h-full">
          {/* Format switcher — fixed */}
          <div className="shrink-0 px-4 pt-4 pb-3 border-b border-border-subtle">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Format</p>
              <span className="text-[10.5px] text-muted">
                {CONTENT_TYPES.findIndex((c) => c.id === contentType) + 1} of {CONTENT_TYPES.length}
              </span>
            </div>
            <FormatSwitcher
              options={CONTENT_TYPES}
              value={contentType}
              onChange={(v) => setContentType(v as ContentType)}
            />
          </div>

          {/* Preview header — fixed */}
          <div className="shrink-0 px-5 pt-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Eye size={13} className="text-muted" />
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Live preview</p>
            </div>
            <span className="text-[11px] text-muted">{previewSurfaceLabel(contentType, platformLabel)}</span>
          </div>

          {/* Preview canvas — flexes to fill, scrolls if needed.
              Subtle dot-grid background gives the empty space a "design canvas" feel
              when the preview is shorter than the column. */}
          <div
            className="flex-1 min-h-0 overflow-y-auto border-t border-border-subtle bg-surface-muted/30"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(2, 0, 53, 0.06) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            <div className="min-h-full flex items-center justify-center p-5">
              <div className="w-full">
                <FormatPreview
                  contentType={contentType}
                  title={title}
                  caption={caption}
                  location={location}
                  author={author}
                />
              </div>
            </div>
          </div>

          {/* Footer hint — fixed */}
          <div className="shrink-0 px-5 py-2 border-t border-border-subtle bg-surface text-[10.5px] text-muted text-center">
            Updates live as you edit
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────────────

function FormatSwitcher({
  options,
  value,
  onChange,
}: {
  options: typeof CONTENT_TYPES;
  value: ContentType;
  onChange: (v: ContentType) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-0.5 bg-surface-muted/80 border border-border-subtle rounded-md p-1">
      {options.map((opt) => {
        const active = value === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            title={opt.label}
            className={`relative flex flex-col items-center justify-center gap-1 h-[58px] rounded-sm cursor-pointer
              transition-colors duration-150 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-muted focus-visible:ring-brand/40
              ${active ? 'text-white' : 'text-muted hover:text-primary'}`}
          >
            {active && (
              <motion.div
                layoutId="format-switcher-thumb"
                className="absolute inset-0 bg-brand rounded-sm shadow-[0_1px_2px_rgba(2,0,53,0.18)]"
                transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
              />
            )}
            <span className="relative">
              <Icon size={15} strokeWidth={1.75} />
            </span>
            <span className="relative text-[10.5px] font-semibold tracking-tight leading-none">
              {opt.short}
            </span>
            {opt.isNew && (
              <span
                aria-hidden="true"
                className={`absolute top-1 right-1 inline-flex items-center justify-center w-1.5 h-1.5 rounded-full
                  ${active ? 'bg-accent-soft' : 'bg-accent'}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function CompactField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">{label}</label>
      {children}
    </div>
  );
}

function FormSection({
  icon,
  eyebrow,
  hint,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-sm bg-brand/10 text-brand">
          {icon}
        </span>
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</h3>
        {hint && <span className="text-[11.5px] text-muted">— {hint}</span>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ChipPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ id: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`h-6 px-2 rounded-sm text-[11px] font-medium border transition-colors
              ${active
                ? 'bg-brand text-white border-brand'
                : 'bg-surface text-primary border-border-subtle hover:border-border-default/60'}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function SegmentedToggle({
  options,
  value,
  onChange,
}: {
  options: Array<{ id: string; label: string }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex items-center bg-surface-muted/80 border border-border-subtle rounded-sm p-0.5 w-fit">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            className={`h-7 px-3 text-[12px] font-medium rounded-sm transition-colors
              ${active
                ? 'bg-surface text-primary border border-border-default shadow-[0_1px_0_rgba(17,17,17,0.06)]'
                : 'text-muted hover:text-primary border border-transparent'}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function CrossPostChip({
  label,
  logo,
  checked,
  onChange,
}: {
  label: string;
  logo: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`inline-flex items-center gap-1.5 h-7 pl-1.5 pr-2 rounded-sm border text-[12px] font-medium transition-colors
        ${checked
          ? 'bg-brand-soft text-brand border-brand/40'
          : 'bg-surface text-secondary border-border-subtle hover:border-border-default/60'}`}
    >
      <span className="flex items-center justify-center w-4 h-4 shrink-0" aria-label={label}>{logo}</span>
      {label && <span>{label}</span>}
      {checked && (
        <Check size={11} strokeWidth={3} className="text-brand -mr-0.5" aria-hidden="true" />
      )}
    </button>
  );
}

// ─── Brand logos (inline SVG) ───────────────────────────────────────────────

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.017 1.792-4.683 4.533-4.683 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="#0A66C2"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      <path
        fill="#0F1419"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
      />
    </svg>
  );
}

function AIModeToggle({
  value,
  onChange,
}: {
  value: 'ai' | 'regular';
  onChange: (v: 'ai' | 'regular') => void;
}) {
  return (
    <div className="inline-flex items-center bg-surface-muted/80 border border-border-subtle rounded-sm p-0.5">
      <button
        type="button"
        onClick={() => onChange('ai')}
        className={`inline-flex items-center gap-1.5 px-3 py-[5px] text-[12px] font-medium rounded-sm transition-colors
          ${value === 'ai'
            ? 'bg-surface text-primary border border-accent/40 shadow-[0_1px_0_rgba(17,17,17,0.06)]'
            : 'text-muted hover:text-primary border border-transparent'}`}
      >
        <Sparkles size={12} className={value === 'ai' ? 'text-accent' : ''} />
        Rework with AI
      </button>
      <button
        type="button"
        onClick={() => onChange('regular')}
        className={`px-3 py-[5px] text-[12px] font-medium rounded-sm transition-colors
          ${value === 'regular'
            ? 'bg-surface text-primary border border-border-default shadow-[0_1px_0_rgba(17,17,17,0.06)]'
            : 'text-muted hover:text-primary border border-transparent'}`}
      >
        Regular text
      </button>
    </div>
  );
}

function DateTimeInput({
  icon,
  type,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  type: 'date' | 'time';
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
        className="w-full pl-9 pr-3 py-2.5 text-[14px] bg-surface border border-border-subtle rounded-sm outline-none transition-colors focus:border-border-default text-primary"
      />
    </div>
  );
}

// ─── Format preview dispatcher ──────────────────────────────────────────────

const ORG_NAME = 'Provide Food NYC';
const POSTER_IMAGE = 'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=800&fit=crop&q=80';
const POLICY_LABEL = 'NYC Food Expansion Act';
const VOTE_DATE = 'June 10';

function previewSurfaceLabel(contentType: ContentType, platformLabel: string): string {
  switch (contentType) {
    case 'post':     return platformLabel;
    case 'poster':   return 'Print · 11×17';
    case 'rsvp':     return 'Event page';
    case 'donation': return 'Donation page';
    case 'brief':    return 'PDF · 1-pager';
  }
}

interface PreviewProps {
  contentType: ContentType;
  title: string;
  caption: string;
  location: string;
  author?: ReturnType<typeof teamMembers.find>;
}

function FormatPreview({ contentType, title, caption, location, author }: PreviewProps) {
  switch (contentType) {
    case 'post':
      return (
        <InstagramPreview
          orgName={ORG_NAME}
          location={location || 'New York, US'}
          title={title}
          caption={caption}
          author={author}
        />
      );
    case 'poster':
      return <PosterPreview title={title} location={location} />;
    case 'rsvp':
      return <RsvpPreview title={title} location={location} />;
    case 'donation':
      return <DonationPreview title={title} caption={caption} />;
    case 'brief':
      return <PolicyBriefPreview title={title} caption={caption} />;
  }
}

// ─── Live Instagram preview ─────────────────────────────────────────────────

function InstagramPreview({
  orgName,
  location,
  title,
  caption,
  author,
}: {
  orgName: string;
  location: string;
  title: string;
  caption: string;
  author?: ReturnType<typeof teamMembers.find>;
}) {
  const formatted = useMemo(() => formatCaption(caption), [caption]);
  return (
    <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-subtle">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar member={author ?? null} size="sm" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-primary leading-tight truncate">{orgName}</p>
            <p className="text-[11px] text-muted leading-tight truncate">{location}</p>
          </div>
        </div>
        <MoreHorizontal size={16} className="text-muted shrink-0" />
      </div>
      {/* Campaign poster image */}
      <div className="aspect-square relative overflow-hidden bg-brand">
        <img
          src={POSTER_IMAGE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/75" />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-white/90 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-primary">
            {orgName}
          </span>
        </div>
        <div className="absolute top-3 right-3 inline-flex items-center px-2 py-1 rounded-sm bg-accent text-white text-[9px] font-semibold uppercase tracking-[0.1em]">
          Vote · {VOTE_DATE}
        </div>
        <div className="absolute left-4 right-4 bottom-4 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent mb-1.5">
            {POLICY_LABEL}
          </p>
          <p className="font-display text-[18px] leading-[1.1] tracking-tight mb-2">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[22px] font-bold tabular-nums leading-none">85,000</span>
            <span className="text-[10px] uppercase tracking-[0.12em] text-white/85">
              more New Yorkers fed
            </span>
          </div>
        </div>
      </div>
      {/* Action row */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-3 text-primary">
          <Heart size={20} strokeWidth={1.5} />
          <MessageCircle size={20} strokeWidth={1.5} />
          <Send size={20} strokeWidth={1.5} />
        </div>
        <Bookmark size={20} strokeWidth={1.5} className="text-primary" />
      </div>
      {/* Caption */}
      <div className="px-3 pb-3 text-[12.5px] leading-relaxed text-primary whitespace-pre-wrap">
        <span className="font-semibold mr-1.5">{orgName.toLowerCase().replace(/\s+/g, '')}</span>
        {formatted}
      </div>
    </div>
  );
}

// ─── Poster preview ─────────────────────────────────────────────────────────

function PosterPreview({ title, location }: { title: string; location: string }) {
  return (
    <div className="rounded-sm border border-border-subtle bg-page p-4 flex justify-center">
      {/* Sheet with paper-like shadow */}
      <div className="w-full max-w-[280px] aspect-[11/17] relative overflow-hidden bg-brand text-white shadow-[0_8px_24px_rgba(2,0,53,0.18),0_2px_4px_rgba(2,0,53,0.12)]">
        <img
          src={POSTER_IMAGE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand/85 via-brand/35 to-brand/95" />

        {/* Top brand bar */}
        <div className="absolute top-0 left-0 right-0 px-4 py-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[8.5px] font-semibold uppercase tracking-[0.18em]">{ORG_NAME}</span>
          </div>
          <span className="text-[8.5px] font-semibold uppercase tracking-[0.16em] text-white/70">2026</span>
        </div>

        {/* Headline */}
        <div className="absolute left-4 right-4 top-[28%]">
          <div className="w-8 h-[2px] bg-accent mb-2.5" />
          <p className="text-[8.5px] font-semibold uppercase tracking-[0.2em] text-accent mb-2">
            {POLICY_LABEL}
          </p>
          <p className="font-display text-[19px] leading-[1.05] tracking-tight">
            {title}
          </p>
        </div>

        {/* Stat block */}
        <div className="absolute left-4 right-4 top-[58%]">
          <div className="border-t border-white/30 pt-2.5">
            <p className="text-[28px] font-bold tabular-nums leading-none">85,000</p>
            <p className="text-[9px] uppercase tracking-[0.14em] text-white/85 mt-1">
              more New Yorkers fed
            </p>
          </div>
        </div>

        {/* Footer details */}
        <div className="absolute left-4 right-4 bottom-3 space-y-1.5 text-[9.5px] leading-snug">
          <div className="flex items-center gap-1.5 border-t border-white/30 pt-2">
            <Calendar size={10} className="text-accent" />
            <span><span className="font-semibold">Floor vote · {VOTE_DATE}</span> · NYC City Hall</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={10} className="text-accent" />
            <span>{location || 'New York City'}</span>
          </div>
          <div className="pt-1.5 mt-1 border-t border-white/30">
            <p className="text-[8px] uppercase tracking-[0.16em] text-white/70">Submit testimony</p>
            <p className="text-[10px] font-semibold mt-0.5">council.nyc.gov/testimony</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RSVP preview ───────────────────────────────────────────────────────────

function RsvpPreview({ title, location }: { title: string; location: string }) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
      {/* Hero band */}
      <div className="relative h-[110px] bg-brand overflow-hidden">
        <img
          src={POSTER_IMAGE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand/85 to-brand/40" />
        <div className="relative px-4 py-3 h-full flex flex-col justify-between">
          <span className="self-start inline-flex items-center px-2 py-0.5 rounded-sm bg-accent text-white text-[9px] font-semibold uppercase tracking-[0.1em]">
            Public hearing
          </span>
          <p className="font-display text-white text-[15px] leading-[1.15] line-clamp-2">
            {title}
          </p>
        </div>
      </div>

      {/* Date block + details */}
      <div className="px-4 py-4 grid grid-cols-[64px_1fr] gap-3 items-start border-b border-border-subtle">
        <div className="rounded-sm border border-border-subtle overflow-hidden text-center">
          <div className="bg-accent text-white text-[9px] font-semibold uppercase tracking-[0.14em] py-0.5">
            June
          </div>
          <div className="py-1.5">
            <p className="font-display text-[24px] leading-none text-primary">10</p>
            <p className="text-[9px] uppercase tracking-[0.1em] text-muted mt-1">2026 · Wed</p>
          </div>
        </div>
        <div className="space-y-2 text-[12px] text-primary">
          <div className="flex items-start gap-1.5">
            <Clock size={12} className="text-muted mt-[2px] shrink-0" />
            <span><span className="font-semibold">10:00 AM – 12:00 PM</span> EST</span>
          </div>
          <div className="flex items-start gap-1.5">
            <MapPin size={12} className="text-muted mt-[2px] shrink-0" />
            <div>
              <p className="font-semibold">NYC City Hall</p>
              <p className="text-muted text-[11px]">{location || 'New York, NY'}</p>
            </div>
          </div>
          <div className="flex items-start gap-1.5">
            <Users size={12} className="text-muted mt-[2px] shrink-0" />
            <span className="text-muted">
              <span className="font-semibold text-primary tabular-nums">142</span> attending ·
              <span className="font-semibold text-primary tabular-nums"> 38</span> from your network
            </span>
          </div>
        </div>
      </div>

      {/* Question + RSVP buttons */}
      <div className="px-4 py-4">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">
          Will you attend?
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          <button type="button" className="h-8 rounded-sm bg-brand text-white text-[12px] font-semibold">
            Yes
          </button>
          <button type="button" className="h-8 rounded-sm bg-surface border border-border-subtle text-primary text-[12px] font-semibold hover:border-border-default">
            Maybe
          </button>
          <button type="button" className="h-8 rounded-sm bg-surface border border-border-subtle text-primary text-[12px] font-semibold hover:border-border-default">
            No
          </button>
        </div>
        <p className="text-[10.5px] text-muted mt-3 leading-snug">
          Submit written testimony at <span className="text-brand font-medium">council.nyc.gov/testimony</span>
        </p>
      </div>
    </div>
  );
}

// ─── Donation page preview ──────────────────────────────────────────────────

function DonationPreview({ title, caption }: { title: string; caption: string }) {
  const raised = 42_180;
  const goal = 75_000;
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  const summary = useMemo(
    () => caption.split(/\n+/).find((l) => l.trim().length > 0) ?? '',
    [caption],
  );
  const amounts = [25, 50, 100, 250];

  return (
    <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
      {/* Hero */}
      <div className="relative h-[120px] bg-brand overflow-hidden">
        <img
          src={POSTER_IMAGE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute left-3 bottom-3 right-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-accent mb-1">
            {POLICY_LABEL}
          </p>
          <p className="font-display text-white text-[15px] leading-[1.15] line-clamp-2">
            {title}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-baseline justify-between mb-1.5">
          <p className="text-[18px] font-semibold tabular-nums text-primary">
            ${raised.toLocaleString()}
          </p>
          <p className="text-[11px] text-muted">
            raised of <span className="font-semibold text-primary tabular-nums">${goal.toLocaleString()}</span>
          </p>
        </div>
        <div className="h-1.5 rounded-full bg-surface-muted overflow-hidden">
          <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center justify-between text-[10.5px] text-muted mt-1.5">
          <span><span className="font-semibold text-primary tabular-nums">412</span> donors</span>
          <span className="tabular-nums">{pct}% to goal</span>
        </div>
      </div>

      {/* Story */}
      {summary && (
        <div className="px-4 pb-3 text-[12px] leading-relaxed text-secondary line-clamp-3">
          {summary}
        </div>
      )}

      {/* Suggested amounts */}
      <div className="px-4 py-3 border-t border-border-subtle">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">
          Choose an amount
        </p>
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {amounts.map((a, i) => (
            <button
              key={a}
              type="button"
              className={`h-9 rounded-sm border text-[12px] font-semibold tabular-nums transition-colors
                ${i === 1
                  ? 'bg-brand-soft border-brand text-brand'
                  : 'bg-surface border-border-subtle text-primary hover:border-border-default'}`}
            >
              ${a}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="w-full h-10 rounded-sm bg-accent text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-accent-hover transition-colors"
        >
          <HeartIcon size={13} strokeWidth={2} /> Donate now
        </button>
      </div>
    </div>
  );
}

// ─── Policy brief preview ───────────────────────────────────────────────────

function PolicyBriefPreview({ title, caption }: { title: string; caption: string }) {
  // First two non-empty lines as the brief intro / pull-quote.
  const lines = useMemo(() => caption.split(/\n+/).filter((l) => l.trim().length > 0), [caption]);
  const intro = lines[0] ?? '';
  const pull = lines[1] ?? '';
  return (
    <div className="rounded-sm border border-border-subtle bg-page p-4">
      {/* Letterhead */}
      <div className="bg-surface border border-border-subtle shadow-[0_4px_12px_rgba(2,0,53,0.06)]">
        <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-primary">
                {ORG_NAME}
              </span>
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
              Policy Brief · 2026
            </span>
          </div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-accent mb-1.5">
            {POLICY_LABEL}
          </p>
          <p className="font-display text-[16px] leading-[1.15] text-primary">
            {title}
          </p>
        </div>

        {/* Body sections */}
        <div className="px-5 py-4 space-y-3">
          <Section heading="Executive summary">
            <p className="text-[11.5px] leading-relaxed text-primary line-clamp-3">{intro}</p>
          </Section>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2 py-2">
            <BriefStat value="85K" label="more New Yorkers fed" />
            <BriefStat value="3" label="boroughs covered" />
            <BriefStat value={VOTE_DATE} label="floor vote" />
          </div>

          {/* Pull quote */}
          {pull && (
            <div className="border-l-2 border-accent pl-3 py-1">
              <Quote size={10} className="text-accent mb-1" />
              <p className="text-[11px] italic leading-snug text-primary line-clamp-3">{pull}</p>
            </div>
          )}

          <Section heading="Why this matters">
            <ul className="space-y-1 text-[11px] leading-snug text-secondary">
              <li className="flex gap-1.5"><span className="text-accent shrink-0">·</span>Expansion covers Brownsville, East New York, and South Bronx.</li>
              <li className="flex gap-1.5"><span className="text-accent shrink-0">·</span>Aligns with our existing kitchen partnerships.</li>
              <li className="flex gap-1.5"><span className="text-accent shrink-0">·</span>Public testimony is open through {VOTE_DATE}.</li>
            </ul>
          </Section>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-border-subtle flex items-center justify-between text-[9.5px] text-muted">
          <span>{ORG_NAME.toLowerCase().replace(/\s+/g, '')}.org</span>
          <span>p. 1 of 1</span>
        </div>
      </div>
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted mb-1">{heading}</p>
      {children}
    </div>
  );
}

function BriefStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-sm border border-border-subtle bg-brand-soft/40 px-2 py-1.5 text-center">
      <p className="font-display text-[16px] leading-none text-brand">{value}</p>
      <p className="text-[8.5px] uppercase tracking-[0.08em] text-muted mt-1 leading-tight">{label}</p>
    </div>
  );
}

// Highlight hashtags in the caption preview by giving them brand color.
function formatCaption(caption: string): React.ReactNode {
  const parts = caption.split(/(\s+)/);
  return parts.map((p, i) =>
    p.startsWith('#') ? (
      <span key={i} className="text-brand">{p}</span>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    ),
  );
}
