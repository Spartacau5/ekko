import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppLayout } from './components/layout/AppLayout';
import { ToastProvider } from './components/ui';
import { TourProvider } from './lib/TourContext';
import { RoleProvider } from './lib/RoleContext';
import { MaturityProvider, useMaturity } from './lib/MaturityContext';
import { DemoFlowProvider } from './lib/DemoFlowContext';
import { ActionProvider } from './lib/ActionContext';
import { RecentProvider } from './lib/RecentContext';
import { WatchlistProvider } from './lib/WatchlistContext';
import { PolicyReadProvider } from './lib/PolicyReadContext';
import { PolicyFollowProvider } from './lib/PolicyFollowContext';
import { DonorsProvider } from './lib/DonorsContext';
import { GroupsProvider } from './lib/GroupsContext';
import { PinProvider } from './lib/PinContext';
import { motionDurations, motionEasings } from './lib/motion';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PeopleLayout } from './pages/people/PeopleLayout';
import { DonorsListPage } from './pages/people/DonorsListPage';
import { DonorDetailPage } from './pages/people/DonorDetailPage';
import { GroupsListPage } from './pages/people/GroupsListPage';
import { GroupDetailPage } from './pages/people/GroupDetailPage';
import { PolicyPage } from './pages/PolicyPage';
import { PolicyDetailPage } from './pages/PolicyDetailPage';
import { PeersPage } from './pages/PeersPage';
import { PeerDetailPage } from './pages/PeerDetailPage';
import { CampaignLibraryPage } from './pages/CampaignLibraryPage';
import { CampaignDetailPage } from './pages/CampaignDetailPage';
import { CampaignBuilderPage } from './pages/CampaignBuilderPage';
import { CampaignAnalyticsPage } from './pages/CampaignAnalyticsPage';
import { NotificationMockupPage } from './pages/NotificationMockupPage';
import { SettingsPage } from './pages/SettingsPage';

// Resets scroll on route change. Lives inside Router.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

// Phase 4.5: empty placeholder for /day-0/* and /day-x/* routes. The hydrator
// runs as a sibling and rewrites the URL away on the next render.
function MaturityPrefixCatchAll() {
  return null;
}

// Phase 4.5: support deep-link URLs like /day-0/dashboard or /day-x/people/donors.
// When such a URL is visited, set the maturity state and rewrite the URL to the
// canonical path. The switcher updates context directly without touching the URL.
function MaturityURLHydrator() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setActiveMaturity } = useMaturity();

  useEffect(() => {
    const m = location.pathname.match(/^\/(day-0|day-x)(\/.*)?$/);
    if (!m) return;
    setActiveMaturity(m[1] === 'day-0' ? 'day0' : 'dayX');
    const target = m[2] && m[2] !== '/' ? m[2] : '/dashboard';
    navigate(target, { replace: true });
  }, [location.pathname, navigate, setActiveMaturity]);

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
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: motionDurations.page, ease: motionEasings.out }}
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
       <MaturityProvider>
       <RoleProvider>
        <ActionProvider>
        <WatchlistProvider>
        <PolicyReadProvider>
        <PolicyFollowProvider>
        <DonorsProvider>
        <GroupsProvider>
        <PinProvider>
        <RecentProvider>
        <DemoFlowProvider>
        <TourProvider>
          <ScrollToTop />
          <MaturityURLHydrator />
          <Routes>
            {/* Phase 4.5: maturity prefix routes — hydrator rewrites to canonical path */}
            <Route path="/day-0/*" element={<MaturityPrefixCatchAll />} />
            <Route path="/day-x/*" element={<MaturityPrefixCatchAll />} />
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Standalone — video cold-open lock-screen mockup. Not linked
                from anywhere; reachable only via direct URL. */}
            <Route path="/notification" element={<NotificationMockupPage />} />
            <Route element={<LayoutWrapper />}>
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* People surface */}
              <Route path="/people" element={<PeopleLayout />}>
                <Route index element={<Navigate to="/people/donors" replace />} />
                <Route path="donors" element={<DonorsListPage />} />
                <Route path="donors/:id" element={<DonorDetailPage />} />
                <Route path="groups" element={<GroupsListPage />} />
                <Route path="groups/:id" element={<GroupDetailPage />} />
                <Route path="accounts" element={<Navigate to="/people/donors" replace />} />
                <Route path="accounts/:id" element={<Navigate to="/people/donors" replace />} />
              </Route>

              {/* Policy surface */}
              <Route path="/policy" element={<PolicyPage />} />
              <Route path="/policy/watchlist" element={<Navigate to="/policy" replace />} />
              <Route path="/policy/:id" element={<PolicyDetailPage />} />

              {/* Peers surface */}
              <Route path="/peers" element={<Navigate to="/peers/organizations" replace />} />
              <Route path="/peers/organizations" element={<PeersPage />} />
              <Route path="/peers/campaigns" element={<CampaignLibraryPage />} />
              <Route path="/peers/campaigns/:id" element={<CampaignDetailPage />} />
              <Route path="/peers/:id" element={<PeerDetailPage />} />

              {/* Campaign builder — reached from dashboard advocacy task */}
              <Route path="/campaigns/new" element={<CampaignBuilderPage />} />
              <Route path="/campaigns/:id/analytics" element={<CampaignAnalyticsPage />} />

              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </TourProvider>
        </DemoFlowProvider>
        </RecentProvider>
        </PinProvider>
        </GroupsProvider>
        </DonorsProvider>
        </PolicyFollowProvider>
        </PolicyReadProvider>
        </WatchlistProvider>
        </ActionProvider>
       </RoleProvider>
       </MaturityProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
