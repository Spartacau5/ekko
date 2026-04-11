// Phase 6 (second pass): refined SubNav.
// Echoes the TopNav treatment — uppercase-ish labels, count chips, accent
// underline. Printed count chips match the Tabs count style for a single
// navigation family across the product.

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motionDurations, motionEasings } from '../../lib/motion';

interface SubNavItem {
  label: string;
  path: string;
  count?: number;
  icon?: React.ReactNode;
}

interface SubNavProps {
  items: SubNavItem[];
  layoutId?: string;
}

export function SubNav({ items, layoutId = 'subnav-indicator' }: SubNavProps) {
  const location = useLocation();
  const isActive = (path: string) => {
    if (location.pathname === path) return true;
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
            className={`relative flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold tracking-tight no-underline
              transition-colors duration-150 ease-out
              ${active ? 'text-primary' : 'text-muted hover:text-secondary'}`}
          >
            {item.icon && <span className={active ? 'text-primary' : 'text-muted'}>{item.icon}</span>}
            {item.label}
            {item.count !== undefined && (
              <span
                className={`tabular-nums text-[10px] font-semibold px-1.5 py-0.5 rounded-sm border
                  ${active
                    ? 'bg-accent-soft text-primary border-accent/40'
                    : 'bg-surface-muted/70 text-muted border-border-subtle'}`}
              >
                {item.count}
              </span>
            )}
            {active && (
              <motion.div
                layoutId={layoutId}
                className="absolute -bottom-[1px] left-3 right-3 h-[2px] bg-accent"
                transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
