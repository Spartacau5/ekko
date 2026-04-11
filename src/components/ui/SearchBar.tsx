// Phase 6 (second pass): refined SearchBar.
// Tighter input, printed border, subtle shadow on focus. Part of the
// single-family treatment across form controls.

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md';
}

export function SearchBar({ value, onChange, placeholder = 'Search…', size = 'md' }: SearchBarProps) {
  const pad = size === 'sm' ? 'py-1.5 text-[12.5px]' : 'py-2 text-[13px]';
  return (
    <div className="relative">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-8 pr-3 ${pad} bg-surface border border-border-subtle rounded-sm outline-none
          placeholder:text-muted/80
          transition-[border-color,box-shadow] duration-150 ease-out
          hover:border-border-default/60
          focus-visible:border-border-default focus-visible:ring-2 focus-visible:ring-border-default/30 focus-visible:ring-offset-1 focus-visible:ring-offset-surface`}
      />
    </div>
  );
}
