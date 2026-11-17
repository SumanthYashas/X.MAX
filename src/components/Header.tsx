import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRoute, ROUTE_PATHS } from '../types/routing';

interface HeaderProps {
  entranceStarted: boolean;
  currentRoute: PageRoute;
  quoteCount: number;
  onNavigate: (route: PageRoute) => void;
}

const NAV_ITEMS: Array<{ route: PageRoute; label: string }> = [
  { route: 'home', label: 'Home' },
  { route: 'pricing', label: 'Pricing' },
  { route: 'packages', label: 'Packages' },
  { route: 'terms', label: 'Terms' },
  { route: 'quote', label: 'Quote' },
];

export function Header({ entranceStarted, currentRoute, quoteCount, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const leftPillRef = useRef<HTMLDivElement | null>(null);
  const rightPillRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

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
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay: 0.4,
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
    <header className="pointer-events-none absolute top-[12px] left-[12px] right-[12px] md:top-[20px] md:left-[28px] md:right-[28px] lg:top-[calc(24*var(--u))] lg:left-[calc(90*var(--u))] lg:right-[calc(90*var(--u))] z-20 flex items-start justify-between gap-2">
      {/* Left Pill: Official X.MAX Logo + Multi-Page Nav */}
      <div className="pointer-events-auto relative">
        <div
          ref={leftPillRef}
          className="header-pill-left flex items-center overflow-hidden bg-[var(--pill-bg)] backdrop-blur-[14px] h-[44px] rounded-[12px] px-[14px] md:h-[52px] md:rounded-[14px] md:px-[16px] lg:h-[calc(64*var(--u))] lg:rounded-[calc(16*var(--u))] lg:px-[calc(22*var(--u))]"
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
              className="h-[15px] md:h-[18px] lg:h-[calc(22*var(--u))] w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-[1.06]"
            />
          </a>

          <nav
            aria-label="Primary navigation"
            className="header-nav-fade hidden md:flex items-center md:ml-[22px] md:gap-[16px] md:text-[14px] lg:ml-[calc(34*var(--u))] lg:gap-[calc(22*var(--u))] lg:text-[calc(17.5*var(--u))] text-[#1e2128]"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <a
                  key={item.route}
                  href={ROUTE_PATHS[item.route]}
                  onClick={(e) => handleLinkClick(e, item.route)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative whitespace-nowrap shrink-0 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111418] ${
                    isActive ? 'font-semibold text-[#111418]' : 'hover:opacity-55'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 right-0 -bottom-[3px] h-[1.5px] bg-[#ff5512] rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Right Side Controls: Mobile Nav Toggle (<768px) & Inner-Page Quote Pill */}
      <div ref={mobileMenuRef} className="pointer-events-auto relative flex items-center gap-2">
        {currentRoute !== 'home' && (
          <div
            ref={rightPillRef}
            className="flex items-center bg-[var(--pill-bg)] backdrop-blur-[14px] h-[44px] rounded-[12px] gap-[10px] pl-[12px] pr-[5px] text-[13.5px] sm:pl-[14px] sm:pr-[6px] md:h-[52px] md:rounded-[14px] md:gap-[14px] md:pl-[16px] md:pr-[8px] md:text-[14px] lg:mt-[calc(2*var(--u))] lg:h-[calc(60*var(--u))] lg:rounded-[calc(16*var(--u))] lg:gap-[calc(18*var(--u))] lg:pl-[calc(22*var(--u))] lg:pr-[calc(13*var(--u))] lg:text-[calc(17.5*var(--u))]"
          >
            <a
              href={ROUTE_PATHS.pricing}
              onClick={(e) => handleLinkClick(e, 'pricing')}
              className="hidden sm:inline whitespace-nowrap shrink-0 text-[#1e2128] transition-opacity duration-200 hover:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111418]"
            >
              Rate Card
            </a>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('quote')}
              className="whitespace-nowrap shrink-0 bg-[#16191f] text-[#fafafa] rounded-[8px] px-[11px] py-[7px] md:rounded-[9px] md:px-[14px] md:py-[7px] lg:rounded-[calc(9*var(--u))] lg:px-[calc(16*var(--u))] lg:py-[calc(8*var(--u))] transition-colors duration-200 hover:bg-[#2b3140] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111418] tabular-nums"
            >
              {quoteCount > 0 ? `Quote (${quoteCount})` : 'Build Quote'}
            </motion.button>
          </div>
        )}

        {/* Mobile-only navigation trigger so phones (<768px) always reach all 5 routes cleanly */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          className="md:hidden flex items-center justify-center w-[44px] h-[44px] rounded-[12px] bg-[var(--pill-bg)] backdrop-blur-[14px] text-[#111418] hover:opacity-75 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111418]"
        >
          {mobileMenuOpen ? (
            <X className="w-[18px] h-[18px]" aria-hidden="true" />
          ) : (
            <Menu className="w-[18px] h-[18px]" aria-hidden="true" />
          )}
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden absolute right-0 top-[calc(100%+8px)] w-[250px] max-w-[calc(100vw-24px)] rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_20px_50px_rgba(17,20,24,0.12)] p-2 text-[14px] text-[#111418]"
            >
              <a
                href={ROUTE_PATHS.home}
                onClick={(e) => handleLinkClick(e, 'home')}
                className={`block px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors ${
                  currentRoute === 'home' ? 'bg-slate-100 font-semibold' : ''
                }`}
              >
                Home &amp; Interactive Showcase
              </a>
              <a
                href={ROUTE_PATHS.pricing}
                onClick={(e) => handleLinkClick(e, 'pricing')}
                className={`block px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors ${
                  currentRoute === 'pricing' ? 'bg-slate-100 font-semibold' : ''
                }`}
              >
                01. Individual Service Rate Card
              </a>
              <a
                href={ROUTE_PATHS.packages}
                onClick={(e) => handleLinkClick(e, 'packages')}
                className={`block px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors ${
                  currentRoute === 'packages' ? 'bg-slate-100 font-semibold' : ''
                }`}
              >
                02. Bundled Project Packages
              </a>
              <a
                href={ROUTE_PATHS.terms}
                onClick={(e) => handleLinkClick(e, 'terms')}
                className={`block px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors ${
                  currentRoute === 'terms' ? 'bg-slate-100 font-semibold' : ''
                }`}
              >
                03. Additional Charges &amp; Terms
              </a>
              <a
                href={ROUTE_PATHS.quote}
                onClick={(e) => handleLinkClick(e, 'quote')}
                className={`block px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors font-medium text-[#ff5512] ${
                  currentRoute === 'quote' ? 'bg-slate-100' : ''
                }`}
              >
                04. Request Custom Quotation
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
