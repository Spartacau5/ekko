// Phase 6 (second pass): refined SavedViewsBar.
// Tighter, more printed pill bar. Active chip now uses accent-soft +
// accent border, matching the Chip/Tabs/SubNav family. A small "Views"
// eyebrow leads the row so it doesn't look like a random strip of buttons.

import React from 'react';
import { Star, Plus, Users, Lock } from 'lucide-react';
import { SavedView } from '../../data/savedViews';

interface SavedViewsBarProps {
  views: SavedView[];
  activeViewId: string | null;
  onSelect: (id: string | null) => void;
  onSaveNew?: () => void;
}

export function SavedViewsBar({ views, activeViewId, onSelect, onSaveNew }: SavedViewsBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="eyebrow-plain mr-1">Views</span>
      <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-md p-1">
        <ViewButton
          active={activeViewId === null}
          onClick={() => onSelect(null)}
          label="All"
        />
        <div className="w-px h-4 bg-border-subtle mx-0.5" />
        {views.map((view) => (
          <ViewButton
            key={view.id}
            active={activeViewId === view.id}
            onClick={() => onSelect(view.id)}
            title={view.isShared ? `Shared with team · ${view.createdBy}` : `Private · ${view.createdBy}`}
            icon={
              <>
                {view.isDefault && <Star size={10} className="text-accent fill-accent" />}
                {view.isShared ? (
                  <Users size={10} className="text-muted" />
                ) : (
                  <Lock size={10} className="text-muted" />
                )}
              </>
            }
            label={view.name}
            count={view.resultCount}
          />
        ))}
        {onSaveNew && (
          <>
            <div className="w-px h-4 bg-border-subtle mx-0.5" />
            <button
              onClick={onSaveNew}
              className="flex items-center gap-1 px-2 py-1 text-[12px] font-medium text-muted hover:text-primary hover:bg-surface-muted/60 rounded-sm transition-colors"
            >
              <Plus size={12} /> Save view
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  icon,
  count,
  title,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded-sm transition-colors whitespace-nowrap border
        ${active
          ? 'bg-accent-soft text-primary border-accent/45 shadow-[0_1px_0_rgba(17,17,17,0.04)]'
          : 'text-secondary hover:text-primary hover:bg-surface-muted/60 border-transparent'}`}
    >
      {icon}
      {label}
      {count !== undefined && (
        <span className="text-[10px] text-muted tabular-nums">{count}</span>
      )}
    </button>
  );
}
