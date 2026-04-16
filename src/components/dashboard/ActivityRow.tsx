import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Users as UsersIcon, Mail, FileText, Megaphone, TrendingUp } from 'lucide-react';

// Activity feed row. Icon reflects activity type; title is the headline;
// meta shows source + time ago.

const ICONS: Record<string, React.ReactNode> = {
  gift:    <Gift size={14} />,
  meeting: <UsersIcon size={14} />,
  email:   <Mail size={14} />,
  policy:  <FileText size={14} />,
  peer:    <Megaphone size={14} />,
  team:    <TrendingUp size={14} />,
};

const NOW = new Date('2026-04-12T10:00:00');
const timeAgo = (iso: string) => {
  const d = new Date(iso);
  const h = Math.round((NOW.getTime() - d.getTime()) / (1000 * 60 * 60));
  return h < 1 ? 'just now' : h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
};

export interface ActivityItem {
  id: string;
  type: 'gift' | 'meeting' | 'email' | 'policy' | 'peer' | 'team';
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  link?: string;
}

interface ActivityRowProps {
  item: ActivityItem;
}

export function ActivityRow({ item }: ActivityRowProps) {
  const content = (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-surface-muted/40 transition-colors duration-150 cursor-pointer">
      <div className="w-7 h-7 rounded-full bg-surface-muted text-secondary flex items-center justify-center shrink-0">
        {ICONS[item.type]}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <p className="text-[14px] leading-[20px] font-medium text-primary line-clamp-1">{item.title}</p>
        <p className="text-[12px] leading-[16px] text-muted">
          Via {item.actor} · {timeAgo(item.timestamp)}
        </p>
      </div>
    </div>
  );
  if (item.link) {
    return <Link to={item.link} className="no-underline">{content}</Link>;
  }
  return content;
}
