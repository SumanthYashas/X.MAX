import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { PageRoute, ROUTE_PATHS } from '../types/routing';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

const WHATSAPP_CHAT_URL =
  'https://wa.me/917829035362?text=' +
  encodeURIComponent("Hi X.MAX, I'd like to discuss a project scope and pricing.");

export function Footer({ onNavigate }: FooterProps) {
  const handleLink = (e: React.MouseEvent, route: PageRoute) => {
    e.preventDefault();
    onNavigate(route);
  };

  const handleScrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (window.location.pathname !== ROUTE_PATHS.home) {
      onNavigate('home');
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 340);
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer
      id="footer"
      aria-label="X.MAX Site Footer"
      className="bg-[#12151b] text-white border-t border-white/10"
    >
      <div className="mx-auto max-w-[1360px] px-[20px] md:px-[60px] pt-14 md:pt-20 pb-10 md:pb-12">
        {/* Top Closing CTA Band */}
        <div className="pb-12 md:pb-14 border-b border-white/10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="font-mono text-[12px] tracking-[0.08em] uppercase text-[#ff5512] mb-3">
              Start A Project · X.MAX 2026–27
            </p>
            <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-medium tracking-[-0.025em] leading-[1.08] text-white [text-wrap:balance]">
              Ideas into impact. Built around your requirements and transparent pricing.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('quote')}
              className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 h-[48px] px-6 rounded-[12px] bg-[#ff5512] text-white text-[14px] font-medium hover:bg-[#ff6a30] transition-colors cursor-pointer"
            >
              Build Custom Quote
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <a
              href={WHATSAPP_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap shrink-0 inline-flex items-center gap-2 h-[48px] px-6 rounded-[12px] bg-[#25D366] text-[#071f11] text-[14px] font-semibold hover:bg-[#2ee372] transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              WhatsApp · 7829035362
            </a>
          </div>
        </div>

        {/* Multi-column Directory */}
        <div className="py-12 md:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-6 pr-0 lg:pr-8">
            <a
              href={ROUTE_PATHS.home}
              onClick={(e) => handleLink(e, 'home')}
              aria-label="X.MAX home"
              className="group inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded-sm"
            >
              <img
                src="/assets/aistudio/Asset_1_964a5860.png"
                alt="X.MAX"
                className="h-[26px] w-auto object-contain brightness-0 invert transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              />
            </a>
            <p className="mt-4 text-[12px] font-mono tracking-[0.06em] text-white/55">
              META ADS • GOOGLE ADS • REELS CREATIVES • SEO &amp; CONVERSION FUNNELS
            </p>
            <p className="mt-3 text-[15px] leading-[1.6] text-white/75 max-w-md">
              Performance-driven digital marketing, thumb-stopping ad creatives, high-retention
              Reels, and conversion funnels engineered for measurable ROI.
            </p>
          </div>

          {/* Pages */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-[12px] uppercase tracking-[0.06em] text-white/50 mb-4">
              Pages
            </h3>
            <ul className="space-y-2.5 text-[14px] text-white/80">
              <li>
                <a
                  href={ROUTE_PATHS.home}
                  onClick={(e) => handleLink(e, 'home')}
                  className="hover:text-[#ff5512] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href={ROUTE_PATHS.demos}
                  onClick={(e) => handleLink(e, 'demos')}
                  className="hover:text-[#ff5512] transition-colors font-medium text-white"
                >
                  Test Tools (Apps UI)
                </a>
              </li>
              <li>
                <a
                  href={`${ROUTE_PATHS.home}#how-we-work`}
                  onClick={(e) => handleScrollToSection(e, 'how-we-work')}
                  className="hover:text-[#ff5512] transition-colors"
                >
                  How We Work
                </a>
              </li>
              <li>
                <a
                  href={ROUTE_PATHS.pricing}
                  onClick={(e) => handleLink(e, 'pricing')}
                  className="hover:text-[#ff5512] transition-colors"
                >
                  Individual Rates
                </a>
              </li>
              <li>
                <a
                  href={ROUTE_PATHS.packages}
                  onClick={(e) => handleLink(e, 'packages')}
                  className="hover:text-[#ff5512] transition-colors"
                >
                  Bundled Packages
                </a>
              </li>
              <li>
                <a
                  href={ROUTE_PATHS.terms}
                  onClick={(e) => handleLink(e, 'terms')}
                  className="hover:text-[#ff5512] transition-colors"
                >
                  Terms &amp; Charges
                </a>
              </li>
              <li>
                <a
                  href={ROUTE_PATHS.quote}
                  onClick={(e) => handleLink(e, 'quote')}
                  className="hover:text-[#ff5512] transition-colors font-medium text-white"
                >
                  Custom Quote
                </a>
              </li>
              <li>
                <a
                  href={ROUTE_PATHS.analytics}
                  onClick={(e) => handleLink(e, 'analytics')}
                  className="hover:text-[#ff5512] transition-colors"
                >
                  Analytics &amp; SEO Hub
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-[12px] uppercase tracking-[0.06em] text-white/50 mb-4">
              Direct Desk
            </h3>
            <div className="space-y-3 text-[14px]">
              <div>
                <p className="text-[12px] text-white/50">WhatsApp Inquiries</p>
                <a
                  href={WHATSAPP_CHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 inline-block font-mono text-[14px] text-white hover:text-[#25D366] transition-colors"
                >
                  +91 78290 35362
                </a>
              </div>
              <div>
                <p className="text-[12px] text-white/50">Engagement Model</p>
                <p className="mt-0.5 text-white/80">One-time projects &amp; modular scopes</p>
              </div>
              <div className="pt-1 flex items-center gap-3 text-[12px] font-mono text-white/55">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ff5512] transition-colors"
                >
                  sitemap.xml
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ff5512] transition-colors"
                >
                  robots.txt
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Catalogue Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] text-white/55">
          <span>&copy; 2026 X.MAX · Service Pricing Catalogue 2026–27</span>
          <span>All prices in INR (₹) · Milestone billing · Custom quotes on request</span>
        </div>
      </div>
    </footer>
  );
}
