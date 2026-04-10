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
    <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-md p-1">
      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-sm transition-colors
          ${activeViewId === null ? 'bg-surface-muted text-primary' : 'text-secondary hover:text-primary hover:bg-surface-muted/50'}`}
      >
        All
      </button>
      <div className="w-px h-5 bg-border-subtle mx-1" />
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onSelect(view.id)}
          title={view.isShared ? `Shared with team · ${view.createdBy}` : `Private · ${view.createdBy}`}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-sm transition-colors whitespace-nowrap
            ${activeViewId === view.id ? 'bg-surface-muted text-primary' : 'text-secondary hover:text-primary hover:bg-surface-muted/50'}`}
        >
          {view.isDefault && <Star size={11} className="text-accent fill-accent" />}
          {view.isShared
            ? <Users size={11} className="text-muted" />
            : <Lock size={11} className="text-muted" />}
          {view.name}
          <span className="text-[12px] text-muted">{view.resultCount}</span>
        </button>
      ))}
      {onSaveNew && (
        <>
          <div className="w-px h-5 bg-border-subtle mx-1" />
          <button
            onClick={onSaveNew}
            className="flex items-center gap-1 px-2 py-1.5 text-[13px] text-secondary hover:text-primary hover:bg-surface-muted/50 rounded-sm transition-colors"
          >
            <Plus size={13} /> Save view
          </button>
        </>
      )}
    </div>
  );
}
