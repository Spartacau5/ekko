import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface WatchlistToggleProps {
  watching: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export function WatchlistToggle({ watching, onToggle, size = 'md' }: WatchlistToggleProps) {
  const padding = size === 'sm' ? 'px-2.5 py-1' : 'px-3 py-1.5';
  const textSize = size === 'sm' ? 'text-[12px]' : 'text-[13px]';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 ${padding} ${textSize} font-medium border rounded-sm transition-colors cursor-pointer
        ${watching
          ? 'bg-accent-soft border-accent text-primary'
          : 'bg-surface border-border-subtle text-secondary hover:border-border-default hover:text-primary'
        }`}
    >
      {watching ? <Eye size={iconSize} /> : <EyeOff size={iconSize} />}
      {watching ? 'Watching' : 'Watch'}
    </button>
  );
}
