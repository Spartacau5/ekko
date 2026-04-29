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
  const baseClasses = `${sizeMap[size]} rounded-full border flex items-center justify-center font-semibold flex-shrink-0 overflow-hidden ${
    highlight ? 'bg-accent border-accent text-white' : 'bg-brand/10 border-brand/15 text-brand'
  }`;

  // When the member has a head-cropped illustration, render it anchored to
  // the bottom of the circle and scaled so the full character (head + torso)
  // is visible — leaving comfortable empty space above the hair.
  if (member?.imageUrl) {
    return (
      <div className={`${baseClasses} relative`} title={member?.name}>
        <img
          src={member.imageUrl}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[78%] w-auto max-w-none object-contain object-bottom select-none"
        />
      </div>
    );
  }

  return (
    <div className={baseClasses} title={member?.name}>
      {text}
    </div>
  );
}
