import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HelpCircle, Settings, User } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'People', path: '/people' },
  { label: 'Policy', path: '/policy' },
  { label: 'Peers', path: '/peers' },
  { label: 'Settings', path: '/settings' },
];

export function TopNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="h-14 bg-surface border-b border-border-subtle flex items-center px-6 sticky top-0 z-40">
      <Link to="/dashboard" className="flex items-center gap-2 mr-10 no-underline">
        <div className="w-7 h-7 bg-accent rounded-sm flex items-center justify-center">
          <span className="text-[15px] font-bold text-primary leading-none">E</span>
        </div>
        <span className="text-[18px] font-semibold font-serif text-primary tracking-tight">Ekko</span>
      </Link>

      <nav className="flex items-center gap-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors no-underline
              ${isActive(item.path)
                ? 'text-primary bg-surface-muted'
                : 'text-secondary hover:text-primary hover:bg-surface-muted/50'
              }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <button className="p-2 text-muted hover:text-primary transition-colors rounded-sm hover:bg-surface-muted">
          <HelpCircle size={18} />
        </button>
        <Link to="/settings" className="p-2 text-muted hover:text-primary transition-colors rounded-sm hover:bg-surface-muted">
          <Settings size={18} />
        </Link>
        <div className="ml-2 w-8 h-8 rounded-full bg-accent-soft border border-border-subtle flex items-center justify-center">
          <User size={16} className="text-secondary" />
        </div>
      </div>
    </header>
  );
}
