import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SubNavItem {
  label: string;
  path: string;
  count?: number;
  icon?: React.ReactNode;
}

interface SubNavProps {
  items: SubNavItem[];
}

export function SubNav({ items }: SubNavProps) {
  const location = useLocation();
  const isActive = (path: string) => {
    if (location.pathname === path) return true;
    // Match subpaths under the same root, but not too greedily
    return location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex border-b border-border-subtle mb-6">
      {items.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors no-underline
              ${active ? 'text-primary' : 'text-muted hover:text-secondary'}`}
          >
            {item.icon && <span className="text-secondary">{item.icon}</span>}
            {item.label}
            {item.count !== undefined && (
              <span className="text-[12px] text-muted">{item.count}</span>
            )}
            {active && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
