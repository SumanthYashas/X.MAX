import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRoute, ROUTE_PATHS } from '../types/routing';

interface HeaderProps {
  entranceStarted: boolean;
  currentRoute: PageRoute;
  quoteCount: number;
  onNavigate: (route: PageRoute) => void;
}

const NAV_ITEMS: Array<{ route: PageRoute; label: string; shortLabel?: string }> = [
  { route: 'home', label: 'Home' },
  { route: 'demos', label: 'Test Tools' },
  { route: 'pricing', label: 'Pricing' },
  { route: 'packages', label: 'Packages' },
  { route: 'terms', label: 'Terms' },
];

export function Header({ entranceStarted, currentRoute, quoteCount, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const leftPillRef = useRef<HTMLDivElement | null>(null);
  const rightPillRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentRoute]);

  useEffect(() => {
    if (!entranceStarted || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const pills = [leftPillRef.current, rightPillRef.current].filter(Boolean);
    if (pills.length === 0) return;

    gsap.fromTo(
      pills,
      { y: -16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        delay: 0.25,
        stagger: 0.08,
        ease: 'expo.out',
      }
    );
  }, [entranceStarted]);

  const handleLinkClick = (e: React.MouseEvent, route: PageRoute) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <header className="pointer-events-none absolute top-[10px] sm:top-[16px] lg:top-[20px] left-0 right-0 z-40 px-3 sm:px-6 lg:px-10 xl:px-14">
      <div className="mx-auto max-w-[1360px] flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Targeted Primary Header Bar: Brand + Adaptive Multi-Screen Nav */}
        <div
          ref={leftPillRef}
          className={`header-pill-left pointer-events-auto relative flex items-center w-auto max-w-full rounded-[13px] md:rounded-[15px] h-[44px] sm:h-[48px] md:h-[52px] lg:h-[56px] px-3.5 sm:px-4 lg:px-5 border transition-all duration-300 ${
            scrolled
              ? 'bg-white/92 backdrop-blur-xl border-[#111418]/12 shadow-[0_10px_32px_rgba(17,20,24,0.10),inset_0_1px_0_rgba(255,255,255,0.9)]'
              : 'bg-white/80 backdrop-blur-xl border-[#111418]/[0.09] shadow-[0_6px_24px_rgba(17,20,24,0.06),inset_0_1px_0_rgba(255,255,255,0.85)]'
          }`}
        >
          <a
            href={ROUTE_PATHS.home}
            onClick={(e) => handleLinkClick(e, 'home')}
            aria-label="X.MAX home"
            className="group flex items-center shrink-0 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111418] rounded-sm"
          >
            <img
              src="/assets/aistudio/Asset_1_964a5860.png"
              alt="X.MAX"
              className="h-[15px] sm:h-[17px] lg:h-[19px] w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-[1.05]"
            />
          </a>

          {/* Crisp Architectural Divider */}
          <span
            aria-hidden="true"
            className="hidden md:block w-px h-[20px] bg-[#111418]/12 mx-3.5 lg:mx-5 shrink-0"
          />

          {/* Desktop & Tablet Primary Navigation */}
          <nav
            aria-label="Primary navigation"
            className="header-nav-fade hidden md:flex items-center gap-3.5 lg:gap-5 xl:gap-6 text-[13px] lg:text-[14px] text-[#111418]/72"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <a
                  key={item.route}
                  href={ROUTE_PATHS[item.route]}
                  onClick={(e) => handleLinkClick(e, item.route)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111418] ${
                    isActive ? 'font-semibold text-[#111418]' : 'font-medium hover:text-[#111418]'
                  }`}
                >
                  {item.shortLabel ? (
                    <>
                      <span className="xl:hidden">{item.shortLabel}</span>
                      <span className="hidden xl:inline">{item.label}</span>
                    </>
                  ) : (
                    item.label
                  )}

                  {isActive && (
                    <motion.span
                      layoutId="header-active-nav"
                      transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                      aria-hidden="true"
                      className="absolute left-0 right-0 -bottom-[2px] h-[2px] bg-[#ff5512] rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right Zone: Primary Quote Action + Mobile Drawer Trigger */}
        <div ref={mobileMenuRef} className="pointer-events-auto relative flex items-center gap-2 shrink-0">
          <div
            ref={rightPillRef}
            className={`flex items-center rounded-[13px] md:rounded-[15px] h-[44px] sm:h-[48px] md:h-[52px] lg:h-[56px] p-1.5 border transition-all duration-300 ${
              scrolled
                ? 'bg-white/92 backdrop-blur-xl border-[#111418]/12 shadow-[0_10px_32px_rgba(17,20,24,0.10)]'
                : 'bg-white/80 backdrop-blur-xl border-[#111418]/[0.09] shadow-[0_6px_24px_rgba(17,20,24,0.06)]'
            }`}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('quote')}
              className={`h-full inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-[9px] md:rounded-[10px] px-3 sm:px-3.5 lg:px-4 text-[12.5px] sm:text-[13px] lg:text-[13.5px] font-medium transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111418] tabular-nums ${
                currentRoute === 'quote'
                  ? 'bg-[#ff5512] text-white hover:bg-[#e5490b]'
                  : 'bg-[#111418] text-white hover:bg-[#262b36]'
              }`}
            >
              <span>{quoteCount > 0 ? `Quote (${quoteCount})` : 'Build Quote'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80 hidden sm:inline" aria-hidden="true" />
            </motion.button>
          </div>

          {/* Mobile Drawer Trigger (<768px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className={`md:hidden flex items-center justify-center w-[44px] sm:w-[48px] h-[44px] sm:h-[48px] rounded-[13px] border text-[#111418] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111418] ${
              scrolled
                ? 'bg-white/92 backdrop-blur-xl border-[#111418]/12 shadow-[0_10px_32px_rgba(17,20,24,0.10)]'
                : 'bg-white/80 backdrop-blur-xl border-[#111418]/[0.09] shadow-[0_6px_24px_rgba(17,20,24,0.06)]'
            }`}
          >
            {mobileMenuOpen ? (
              <X className="w-[18px] h-[18px]" aria-hidden="true" />
            ) : (
              <Menu className="w-[18px] h-[18px]" aria-hidden="true" />
            )}
          </button>

          {/* Responsive Mobile Menu Panel */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="md:hidden absolute right-0 top-[calc(100%+10px)] w-[275px] max-w-[calc(100vw-24px)] rounded-[16px] bg-white/96 backdrop-blur-xl border border-[#111418]/12 shadow-[0_24px_60px_rgba(17,20,24,0.16)] p-2 text-[13.5px] text-[#111418]"
              >
                <div className="px-3 py-1.5 text-[10.5px] font-mono uppercase tracking-wider text-[#111418]/45 border-b border-[#111418]/8 mb-1">
                  Navigation Directory
                </div>
                {(
                  [
                    { route: 'home', label: '01. Home Overview' },
                    { route: 'demos', label: '02. Test Tools (Apps UI)' },
                    { route: 'pricing', label: '03. Individual Pricing' },
                    { route: 'packages', label: '04. Bundled Packages' },
                    { route: 'terms', label: '05. Terms & Revisions' },
                    { route: 'quote', label: '06. Custom Quote Builder' },
                  ] as const
                ).map((entry) => {
                  const active = currentRoute === entry.route;
                  return (
                    <a
                      key={entry.route}
                      href={ROUTE_PATHS[entry.route]}
                      onClick={(e) => handleLinkClick(e, entry.route)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-[10px] transition-colors ${
                        active
                          ? 'bg-[#111418] text-white font-semibold'
                          : 'hover:bg-slate-100 text-[#111418]/85'
                      }`}
                    >
                      <span>{entry.label}</span>
                      {active && <ArrowUpRight className="w-3.5 h-3.5 text-[#ff5512]" aria-hidden="true" />}
                    </a>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
