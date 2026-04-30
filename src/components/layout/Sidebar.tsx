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
import { ConsultBanner } from './ConsultBanner';

// Global left-rail navigation. White surface with Midnight Blue text and a
// Dark Royalty active pill. The "Still human" Consult card sits above the
// pinned Settings / Help / Logout footer.

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: Array<{ label: string; path: string }>;
  alwaysExpanded?: boolean;
  /** Additional path prefixes that should also count as "active" for this
   *  nav item. e.g. Campaigns lives at /peers/campaigns AND /campaigns/*. */
  alsoActiveOn?: string[];
}

const NAV: NavItem[] = [
  { label: 'Home',   path: '/dashboard', icon: <LayoutGrid size={18} strokeWidth={1.8} /> },
  { label: 'Policy', path: '/policy',    icon: <Newspaper size={18} strokeWidth={1.8} /> },
  { label: 'People', path: '/people', icon: <Users size={18} strokeWidth={1.8} /> },
  {
    label: 'Campaigns',
    path: '/peers/campaigns',
    icon: <BarChart3 size={18} strokeWidth={1.8} />,
    alsoActiveOn: ['/campaigns'],
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

  const isActive = (path: string, exact = false, alsoActiveOn?: string[]) => {
    if (exact) return location.pathname === path;
    if (location.pathname === path || location.pathname.startsWith(path + '/')) return true;
    return (alsoActiveOn ?? []).some(
      (p) => location.pathname === p || location.pathname.startsWith(p + '/'),
    );
  };

  const toggle = (path: string) => setExpanded((p) => ({ ...p, [path]: !p[path] }));

  const baseRow =
    'flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] leading-[20px] font-medium cursor-pointer transition-[background-color,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40';

  return (
    <aside className="w-[240px] shrink-0 bg-surface text-primary flex flex-col h-screen border-r border-border-subtle">
      <div className="px-5 pt-5 pb-5">
        <Link to="/dashboard" className="flex items-center no-underline" aria-label="Ekko">
          <img src="/images/ekko-logo.svg" alt="Ekko" className="h-6 w-auto" />
        </Link>
      </div>

      <nav className="px-3 flex flex-col gap-2">
        {NAV.map((item) => {
          const active = item.children
            ? isActive(item.path) && location.pathname === item.path
            : isActive(item.path, item.path === '/dashboard', item.alsoActiveOn);
          const groupActive = !!item.children && isActive(item.path);
          const childrenVisible = !!item.children && (item.alwaysExpanded || !!expanded[item.path]);
          const showChevron = !!item.children && !item.alwaysExpanded;
          const isPillActive = active || (item.children && groupActive && !childrenVisible);

          return (
            <div key={item.path} className="flex flex-col">
              <button
                onClick={() => {
                  if (item.children && !item.alwaysExpanded) {
                    toggle(item.path);
                    if (!isActive(item.path)) navigate(item.path);
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`${baseRow} ${
                  isPillActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-primary/80 hover:bg-page hover:text-primary'
                }`}
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
                                ? 'bg-brand/10 text-brand font-medium'
                                : 'text-primary/70 hover:bg-page hover:text-primary'}`}
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

      {/* Consult banner — AI assistant entry point. Pinned to the bottom of
          the sidebar (mt-auto), sitting just above the Settings/Help/Logout
          footer at its natural aspect ratio. */}
      <div className="mt-auto px-3 pt-3 pb-2">
        <ConsultBanner />
      </div>

      <div className="px-3 pb-4 pt-2 flex flex-col gap-2">
        <Link
          to="/settings"
          className={`${baseRow} no-underline ${
            isActive('/settings')
              ? 'bg-brand/10 text-brand'
              : 'text-primary/80 hover:bg-page hover:text-primary'
          }`}
        >
          <SettingsIcon size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setHelpOpen((o) => !o)}
            className={`w-full ${baseRow} ${
              helpOpen ? 'bg-page text-primary' : 'text-primary/80 hover:bg-page hover:text-primary'
            }`}
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
                className="absolute left-full bottom-0 ml-2 w-64 bg-surface border border-border-subtle rounded-md shadow-elevated overflow-hidden z-50"
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
                      className="w-full flex flex-col items-start gap-0.5 px-4 py-2.5 text-left hover:bg-page transition-colors duration-150 cursor-pointer"
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
          className={`${baseRow} text-primary/80 hover:bg-page hover:text-primary`}
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
