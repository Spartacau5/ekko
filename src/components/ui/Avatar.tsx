import React from 'react';
import { TeamMember } from '../../data/team';

interface AvatarProps {
  member?: TeamMember | null;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  highlight?: boolean;
}

const sizeMap = {
  xs: 'w-5 h-5 text-[10px]',
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-9 h-9 text-[13px]',
  lg: 'w-12 h-12 text-[15px]',
};

export function Avatar({ member, initials, size = 'sm', highlight = false }: AvatarProps) {
  const text = initials ?? member?.initials ?? '?';
  return (
    <div
      className={`${sizeMap[size]} rounded-full border flex items-center justify-center font-semibold flex-shrink-0
        ${highlight
          ? 'bg-accent border-border-default text-primary'
          : 'bg-accent-soft border-border-subtle text-primary'}`}
      title={member?.name}
    >
      {text}
    </div>
  );
}
