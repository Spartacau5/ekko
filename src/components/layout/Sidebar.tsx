import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutGrid,
  Newspaper,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { motionDurations, motionEasings } from '../../lib/motion';

// Global left-rail navigation. Dark surface, primary icon + label rows, with
// an expandable People group that mirrors the /people/* sub-routes. Footer
// rows (Settings, Help, Logout) sit pinned at the bottom.

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: Array<{ label: string; path: string }>;
  /**
   * Force the child list to stay expanded (and hide the chevron). Used for
   * groups like People where the sub-pages are always-on and shouldn't need
   * an extra click to surface.
   */
  alwaysExpanded?: boolean;
}

const NAV: NavItem[] = [
  { label: 'Home',   path: '/dashboard', icon: <LayoutGrid size={18} strokeWidth={1.8} /> },
  { label: 'Policy', path: '/policy',    icon: <Newspaper size={18} strokeWidth={1.8} /> },
  {
    label: 'People',
    path: '/people',
    icon: <Users size={18} strokeWidth={1.8} />,
    alwaysExpanded: true,
    children: [
      { label: 'Donors', path: '/people/donors' },
      { label: 'Groups', path: '/people/groups' },
    ],
  },
  {
    label: 'Peers',
    path: '/peers',
    icon: <BarChart3 size={18} strokeWidth={1.8} />,
    alwaysExpanded: true,
    children: [
      { label: 'Organizations', path: '/peers/organizations' },
      { label: 'Campaigns', path: '/peers/campaigns' },
    ],
  },
];

type HelpAction = 'tour' | 'docs' | 'support';

interface SidebarProps {
  onHelpAction: (action: HelpAction) => void;
}

export function Sidebar({ onHelpAction }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [helpOpen, setHelpOpen] = useState(false);

  // Auto-expand a parent group whose path matches the current route so the
  // child rows stay visible as the user navigates through them.
  useEffect(() => {
    const next: Record<string, boolean> = { ...expanded };
    NAV.forEach((item) => {
      if (item.children && location.pathname.startsWith(item.path)) {
        next[item.path] = true;
      }
    });
    setExpanded(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggle = (path: string) => setExpanded((p) => ({ ...p, [path]: !p[path] }));

  return (
    <aside className="w-[240px] shrink-0 bg-[#1a1a1a] text-[#e8e6e1] flex flex-col h-screen">
      <div className="px-5 pt-5 pb-8">
        <Link to="/dashboard" className="flex items-center gap-2.5 no-underline" aria-label="Ekko">
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center shadow-[inset_0_-1px_0_rgba(17,17,17,0.08)]">
            <span className="font-serif font-semibold text-primary text-[17px] leading-none -mt-px">E</span>
          </div>
          <span className="font-serif font-semibold text-[22px] tracking-tight leading-none text-white">
            Ekko
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = item.children
            ? isActive(item.path) && location.pathname === item.path
            : isActive(item.path, item.path === '/dashboard');
          const groupActive = !!item.children && isActive(item.path);
          const childrenVisible = !!item.children && (item.alwaysExpanded || !!expanded[item.path]);
          const showChevron = !!item.children && !item.alwaysExpanded;

          return (
            <div key={item.path} className="flex flex-col">
              <button
                onClick={() => {
                  if (item.children && !item.alwaysExpanded) {
                    // Expand + navigate to parent route so content matches the sidebar
                    toggle(item.path);
                    if (!isActive(item.path)) navigate(item.path);
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] leading-[20px] font-medium cursor-pointer
                  transition-[background-color,color] duration-150 ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                  ${active || (item.children && groupActive && !childrenVisible)
                    ? 'bg-page text-primary'
                    : 'text-[#d9d7d2] hover:bg-white/5 hover:text-white'}`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {showChevron && (
                  <motion.span
                    animate={{ rotate: expanded[item.path] ? 180 : 0 }}
                    transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
                  >
                    <ChevronDown size={14} />
                  </motion.span>
                )}
              </button>

              <AnimatePresence initial={false}>
                {item.children && childrenVisible && (
                  <motion.div
                    initial={item.alwaysExpanded ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-0.5 pt-0.5">
                      {item.children.map((child) => {
                        const childActive = isActive(child.path);
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`flex items-center pl-12 pr-3 py-2 rounded-md text-[14px] leading-[20px] no-underline
                              transition-[background-color,color] duration-150 ease-out
                              ${childActive
                                ? 'bg-page text-primary font-medium'
                                : 'text-[#c4c2bd] hover:bg-white/5 hover:text-white'}`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="px-3 pb-5 pt-4 flex flex-col gap-0.5 border-t border-white/5">
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] leading-[20px] font-medium no-underline
            transition-[background-color,color] duration-150 ease-out
            ${isActive('/settings')
              ? 'bg-page text-primary'
              : 'text-[#d9d7d2] hover:bg-white/5 hover:text-white'}`}
        >
          <SettingsIcon size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setHelpOpen((o) => !o)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] leading-[20px] font-medium cursor-pointer
              transition-[background-color,color] duration-150 ease-out
              ${helpOpen ? 'bg-white/5 text-white' : 'text-[#d9d7d2] hover:bg-white/5 hover:text-white'}`}
          >
            <HelpCircle size={18} strokeWidth={1.8} />
            <span>Help</span>
          </button>
          <AnimatePresence>
            {helpOpen && (
              <motion.div
                initial={{ opacity: 0, x: -4, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -4, scale: 0.98 }}
                transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
                className="absolute left-full bottom-0 ml-2 w-64 bg-surface border border-border-subtle rounded-md shadow-lg overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-border-subtle">
                  <p className="text-[13px] font-semibold text-primary">Help & resources</p>
                  <p className="text-[12px] text-muted">Get back up to speed</p>
                </div>
                <div className="py-1">
                  {[
                    { a: 'tour'    as HelpAction, label: 'Restart product tour', desc: '4-step walkthrough' },
                    { a: 'docs'    as HelpAction, label: 'Documentation',         desc: 'User guides and tutorials' },
                    { a: 'support' as HelpAction, label: 'Contact support',       desc: 'Reach the Ekko team' },
                  ].map((it) => (
                    <button
                      key={it.a}
                      onClick={() => { setHelpOpen(false); onHelpAction(it.a); }}
                      className="w-full flex flex-col items-start gap-0.5 px-4 py-2.5 text-left hover:bg-surface-muted/60 transition-colors duration-150 cursor-pointer"
                    >
                      <span className="text-[13px] font-medium text-primary">{it.label}</span>
                      <span className="text-[12px] text-muted">{it.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] leading-[20px] font-medium text-[#d9d7d2] hover:bg-white/5 hover:text-white cursor-pointer transition-[background-color,color] duration-150 ease-out"
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
