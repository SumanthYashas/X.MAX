import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { HeroKeychain } from './components/HeroKeychain';
import { MarqueeTicker } from './components/MarqueeTicker';
import { TimelineStatement } from './components/TimelineStatement';
import { StudioProductionShowcase } from './components/StudioProductionShowcase';
import { HowWeWork } from './components/HowWeWork';
import { HomeDirectoryStrip } from './components/HomeDirectoryStrip';
import { ServiceRateCard } from './components/ServiceRateCard';
import { BundledPackages } from './components/BundledPackages';
import { TermsAndCharges } from './components/TermsAndCharges';
import { QuoteBuilder } from './components/QuoteBuilder';
import { Footer } from './components/Footer';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { WorkflowAppDemos } from './components/WorkflowAppDemos';
import {
  sendWatchHeartbeat,
  trackClick,
  trackPageView,
} from './lib/analytics';
import {
  PageRoute,
  ROUTE_PATHS,
  ROUTE_TITLES,
  resolveRouteFromPath,
} from './types/routing';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() =>
    resolveRouteFromPath(window.location.pathname)
  );
  const [ready3D, setReady3D] = useState(false);
  const [entranceStarted, setEntranceStarted] = useState(false);

  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.title = ROUTE_TITLES[currentRoute];
    trackPageView(ROUTE_PATHS[currentRoute], ROUTE_TITLES[currentRoute]);
  }, [currentRoute]);

  // Real foreground watch-time tracker (flushes every 5s and on pagehide/route switch)
  useEffect(() => {
    const activeRoutePath = ROUTE_PATHS[currentRoute];
    let pendingSeconds = 0;

    const tick = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        pendingSeconds += 1;
        if (pendingSeconds >= 5) {
          const toSend = pendingSeconds;
          pendingSeconds = 0;
          sendWatchHeartbeat(activeRoutePath, toSend);
        }
      }
    }, 1000);

    const flush = (useBeacon: boolean) => {
      if (pendingSeconds > 0) {
        const toSend = pendingSeconds;
        pendingSeconds = 0;
        sendWatchHeartbeat(activeRoutePath, toSend, useBeacon);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush(true);
    };
    const onPageHide = () => flush(true);

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      window.clearInterval(tick);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
      flush(true);
    };
  }, [currentRoute]);

  // Global delegated click attribution across buttons, links, tabs & menus
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('button, a, [role="tab"], [role="menuitem"]') as HTMLElement | null;
      if (!interactive) return;
      const rawLabel =
        interactive.getAttribute('aria-label') ||
        interactive.getAttribute('title') ||
        interactive.textContent ||
        '';
      const cleaned = rawLabel.replace(/\s+/g, ' ').trim();
      if (!cleaned) return;
      const elemType = interactive.tagName.toLowerCase() === 'a' ? 'link' : interactive.getAttribute('role') || 'button';
      trackClick(cleaned, elemType, ROUTE_PATHS[currentRoute]);
    };

    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, [currentRoute]);

  useEffect(() => {
    const onPopState = () => {
      setCurrentRoute(resolveRouteFromPath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = useCallback(
    (route: PageRoute) => {
      if (route === currentRoute) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const nextPath = ROUTE_PATHS[route];
      if (window.location.pathname !== nextPath) {
        window.history.pushState({ route }, '', nextPath);
      }
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [currentRoute]
  );

  const handleReady3D = useCallback(() => {
    setReady3D(true);
  }, []);

  const handleStartExit = useCallback(() => {
    setEntranceStarted(true);
  }, []);

  const handleUpdateServiceQty = useCallback((serviceId: string, delta: number) => {
    setSelectedServices((prev) => {
      const nextQty = (prev[serviceId] || 0) + delta;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[serviceId];
        return copy;
      }
      return { ...prev, [serviceId]: nextQty };
    });
  }, []);

  const handleSelectPackage = useCallback((packageId: string | null) => {
    setSelectedPackageId((prev) => (prev === packageId ? null : packageId));
  }, []);

  const handleToggleAddon = useCallback((addonId: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: !prev[addonId],
    }));
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedPackageId(null);
    setSelectedServices({});
    setSelectedAddons({});
  }, []);

  const quoteCount =
    (selectedPackageId ? 1 : 0) +
    Object.values(selectedServices).reduce((a, b) => a + b, 0) +
    Object.values(selectedAddons).filter(Boolean).length;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen flex flex-col bg-[#f4f7fb] text-[#111418]">
        <Loader
          ready3D={ready3D}
          skip3DWait={currentRoute !== 'home'}
          onStartExit={handleStartExit}
        />

        <Header
          entranceStarted={entranceStarted}
          currentRoute={currentRoute}
          quoteCount={quoteCount}
          onNavigate={navigateTo}
        />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {currentRoute === 'home' && (
              <motion.div
                key="page-home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <HeroKeychain
                  entranceStarted={entranceStarted}
                  onReady3D={handleReady3D}
                  onExploreClick={() => navigateTo('pricing')}
                />
                <MarqueeTicker />
                <TimelineStatement />
                <StudioProductionShowcase onNavigate={navigateTo} />
                <HowWeWork onNavigate={navigateTo} />
                <HomeDirectoryStrip onNavigate={navigateTo} />
              </motion.div>
            )}

            {currentRoute === 'pricing' && (
              <motion.div
                key="page-pricing"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <ServiceRateCard
                  selectedServices={selectedServices}
                  onUpdateServiceQty={handleUpdateServiceQty}
                  onJumpToQuote={() => navigateTo('quote')}
                  onNavigate={navigateTo}
                />
              </motion.div>
            )}

            {currentRoute === 'packages' && (
              <motion.div
                key="page-packages"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <BundledPackages
                  selectedPackageId={selectedPackageId}
                  onSelectPackage={handleSelectPackage}
                  onNavigate={navigateTo}
                />
              </motion.div>
            )}

            {currentRoute === 'terms' && (
              <motion.div
                key="page-terms"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <TermsAndCharges
                  selectedAddons={selectedAddons}
                  onToggleAddon={handleToggleAddon}
                  onNavigate={navigateTo}
                />
              </motion.div>
            )}

            {currentRoute === 'quote' && (
              <motion.div
                key="page-quote"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <QuoteBuilder
                  selectedPackageId={selectedPackageId}
                  selectedServices={selectedServices}
                  selectedAddons={selectedAddons}
                  onSelectPackage={setSelectedPackageId}
                  onUpdateServiceQty={handleUpdateServiceQty}
                  onToggleAddon={handleToggleAddon}
                  onClearAll={handleClearAll}
                  onNavigate={navigateTo}
                />
              </motion.div>
            )}

            {currentRoute === 'analytics' && (
              <motion.div
                key="page-analytics"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <AnalyticsDashboard onNavigate={navigateTo} />
              </motion.div>
            )}

            {currentRoute === 'demos' && (
              <motion.div
                key="page-demos"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <WorkflowAppDemos onNavigate={navigateTo} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Footer onNavigate={navigateTo} />
      </div>
    </MotionConfig>
  );
}
