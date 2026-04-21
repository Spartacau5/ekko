import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTour } from '../../lib/TourContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

// App shell: left sidebar (global nav) + top bar (search, dev switchers,
// notifications, avatar) + main content column. The sidebar is sticky so it
// stays in view while the main content scrolls independently.

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { startTour } = useTour();

  const handleHelpAction = (action: 'tour' | 'docs' | 'support') => {
    if (action === 'tour') {
      if (location.pathname !== '/dashboard') {
        navigate('/dashboard');
        setTimeout(() => startTour(), 80);
      } else {
        startTour();
      }
    }
    // 'docs' and 'support' are placeholders until real links exist.
  };

  return (
    <div className="h-screen bg-page flex overflow-hidden">
      <Sidebar onHelpAction={handleHelpAction} />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] w-full mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
