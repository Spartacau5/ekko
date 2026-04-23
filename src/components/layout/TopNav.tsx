import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle, Settings, BookOpen, MessageCircle, Sparkles } from 'lucide-react';
import { useTour } from '../../lib/TourContext';
import { motionDurations, motionEasings } from '../../lib/motion';
import { RoleSwitcher } from './RoleSwitcher';
import { MaturityStateSwitcher } from './MaturityStateSwitcher';
import { WalkthroughLauncher } from './WalkthroughLauncher';
import { useRole } from '../../lib/RoleContext';
import { Avatar } from '../ui/Avatar';
import { EkkoWordmark } from '../onboarding/BrandMarks';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'People', path: '/people' },
  { label: 'Policy', path: '/policy' },
  { label: 'Peers', path: '/peers' },
];

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { startTour } = useTour();
  const { activeMember } = useRole();
  const [helpOpen, setHelpOpen] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!helpOpen) return;
    function onClick(e: MouseEvent) {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setHelpOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [helpOpen]);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleStartTour = () => {
    setHelpOpen(false);
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
      // Defer until route has rendered so the spotlight targets exist
      setTimeout(() => startTour(), 80);
    } else {
      startTour();
    }
  };

  return (
    <header className="h-14 bg-surface border-b border-border-subtle flex items-center px-8 sticky top-0 z-40">
      <Link
        to="/dashboard"
        className="flex items-center gap-2.5 mr-12 no-underline group"
        aria-label="Ekko — go to dashboard"
      >
        <span className="text-brand">
          <EkkoWordmark size={22} />
        </span>
      </Link>

      <nav className="flex items-center gap-0.5 flex-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-3 py-1.5 text-[13px] font-medium rounded-sm no-underline
                transition-colors duration-150 ease-out
                ${active
                  ? 'text-primary'
                  : 'text-secondary hover:text-primary'
                }`}
            >
              {item.label}
              {/* Active-state rule — a 2px yellow bar under the active item,
                  echoing the eyebrow motif. Subtle, printed, ownable. */}
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute left-3 right-3 -bottom-[17px] h-[2px] bg-accent"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <WalkthroughLauncher />
        <div className="w-px h-5 bg-border-subtle mx-1" />
        <MaturityStateSwitcher />
        <div className="w-px h-5 bg-border-subtle mx-1" />
        <RoleSwitcher />
        <div className="w-px h-5 bg-border-subtle mx-1" />
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => setHelpOpen((o) => !o)}
            aria-label="Help"
            aria-expanded={helpOpen}
            className={`p-2 rounded-sm transition-colors duration-150
              ${helpOpen
                ? 'text-primary bg-surface-muted'
                : 'text-muted hover:text-primary hover:bg-surface-muted'}`}
          >
            <HelpCircle size={18} />
          </button>
          <AnimatePresence>
            {helpOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
                className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border-subtle rounded-md shadow-lg overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-border-subtle">
                  <p className="text-[13px] font-semibold text-primary">Help &amp; resources</p>
                  <p className="text-[12px] text-muted">Get back up to speed</p>
                </div>
                <div className="py-1">
                  <HelpItem
                    icon={<Sparkles size={14} />}
                    label="Restart product tour"
                    description="4-step walkthrough"
                    onClick={handleStartTour}
                  />
                  <HelpItem
                    icon={<BookOpen size={14} />}
                    label="Documentation"
                    description="User guides and tutorials"
                    onClick={() => setHelpOpen(false)}
                  />
                  <HelpItem
                    icon={<MessageCircle size={14} />}
                    label="Contact support"
                    description="Reach the Ekko team"
                    onClick={() => setHelpOpen(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Link
          to="/settings"
          className="p-2 text-muted hover:text-primary transition-colors duration-150 rounded-sm hover:bg-surface-muted"
          aria-label="Settings"
        >
          <Settings size={18} />
        </Link>
        <div className="ml-1">
          <Avatar member={activeMember} size="md" />
        </div>
      </div>
    </header>
  );
}

function HelpItem({ icon, label, description, onClick }: { icon: React.ReactNode; label: string; description: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-surface-muted/60 transition-colors duration-150"
    >
      <span className="text-secondary mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-primary">{label}</p>
        <p className="text-[12px] text-muted">{description}</p>
      </div>
    </button>
  );
}
