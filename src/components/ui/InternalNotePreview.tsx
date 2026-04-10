import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lock, Users } from 'lucide-react';
import { InternalNote } from '../../data/notes';
import { getTeamMember, roleMeta } from '../../data/team';
import { motionDurations, motionEasings } from '../../lib/motion';
import { Avatar } from './Avatar';

interface InternalNotePreviewProps {
  note: InternalNote;
  defaultExpanded?: boolean;
}

export function InternalNotePreview({ note, defaultExpanded = false }: InternalNotePreviewProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const author = getTeamMember(note.authorId);
  const isLong = note.content.length > 140;
  const date = new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <Avatar member={author} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
          <p className="text-[13px] font-medium text-primary">{author?.name ?? 'Unknown'}</p>
          {author && (
            <p className="text-[11px] text-muted">{roleMeta[author.role].label}</p>
          )}
          <span className="text-[11px] text-muted">·</span>
          <span className="text-[11px] text-muted">{date}</span>
          {note.visibility === 'private' && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted">
              <Lock size={10} /> Private
            </span>
          )}
          {note.visibility === 'team' && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted">
              <Users size={10} /> Team
            </span>
          )}
        </div>
        <p className={`text-[13px] text-secondary leading-relaxed ${expanded || !isLong ? '' : 'line-clamp-2'}`}>
          {note.content}
        </p>
        <AnimatePresence initial={false}>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="mt-1 inline-flex items-center gap-1 text-[12px] text-secondary hover:text-primary
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default rounded-sm"
            >
              {expanded ? 'Show less' : 'Show full note'}
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: motionDurations.panel, ease: motionEasings.out }}
                className="inline-flex"
              >
                <ChevronDown size={12} />
              </motion.span>
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
