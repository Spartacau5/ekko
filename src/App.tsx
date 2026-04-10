import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppLayout } from './components/layout/AppLayout';
import { ToastProvider } from './components/ui';
import { TourProvider } from './lib/TourContext';
import { motionDurations, motionEasings } from './lib/motion';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PeopleLayout } from './pages/people/PeopleLayout';
import { DonorsListPage } from './pages/people/DonorsListPage';
import { DonorDetailPage } from './pages/people/DonorDetailPage';
import { GroupsListPage } from './pages/people/GroupsListPage';
import { GroupDetailPage } from './pages/people/GroupDetailPage';
import { AccountsListPage } from './pages/people/AccountsListPage';
import { AccountDetailPage } from './pages/people/AccountDetailPage';
import { PolicyPage } from './pages/PolicyPage';
import { PolicyDetailPage } from './pages/PolicyDetailPage';
import { PolicyWatchlistPage } from './pages/PolicyWatchlistPage';
import { PeersPage } from './pages/PeersPage';
import { PeerDetailPage } from './pages/PeerDetailPage';
import { CampaignLibraryPage } from './pages/CampaignLibraryPage';
import { SettingsPage } from './pages/SettingsPage';

// Resets scroll on route change. Lives inside Router.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

// Compute a transition key from the pathname. People list pages share a single
// key so the sub-nav stays mounted while the inner content fades — that fade
// is handled inside PeopleLayout itself.
function getTransitionKey(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'people' && parts.length === 2) {
    return '/people/list';
  }
  return pathname;
}

function LayoutWrapper() {
  const location = useLocation();
  const key = getTransitionKey(location.pathname);
  return (
    <AppLayout>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <TourProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route element={<LayoutWrapper />}>
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* People surface */}
              <Route path="/people" element={<PeopleLayout />}>
                <Route index element={<Navigate to="/people/donors" replace />} />
                <Route path="donors" element={<DonorsListPage />} />
                <Route path="donors/:id" element={<DonorDetailPage />} />
                <Route path="groups" element={<GroupsListPage />} />
                <Route path="groups/:id" element={<GroupDetailPage />} />
                <Route path="accounts" element={<AccountsListPage />} />
                <Route path="accounts/:id" element={<AccountDetailPage />} />
              </Route>

              {/* Policy surface */}
              <Route path="/policy" element={<PolicyPage />} />
              <Route path="/policy/watchlist" element={<PolicyWatchlistPage />} />
              <Route path="/policy/:id" element={<PolicyDetailPage />} />

              {/* Peers surface */}
              <Route path="/peers" element={<PeersPage />} />
              <Route path="/peers/campaigns" element={<CampaignLibraryPage />} />
              <Route path="/peers/:id" element={<PeerDetailPage />} />

              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </TourProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
