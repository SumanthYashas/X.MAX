import { ArrowRight, Check, PackageCheck, Sparkles, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { BUNDLED_PACKAGES, formatINR } from '../data/xmaxCatalogue';
import { PageRoute } from '../types/routing';

interface PricingSectionProps {
  onNavigate: (route: PageRoute) => void;
  onSelectPackage?: (packageId: string) => void;
}

export function PricingSection({ onNavigate, onSelectPackage }: PricingSectionProps) {
  return (
    <section
      id="pricing"
      aria-label="06 Pricing"
      className="mx-auto max-w-[1360px] px-[20px] md:px-[60px] py-[80px] md:py-[110px]"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#111418]/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111418] text-white text-[12px] font-mono tracking-wider uppercase mb-3">
            <span className="text-[#ff5512] font-bold">06</span>
            <span>PRICING</span>
          </div>
          <h2 className="text-[32px] sm:text-[42px] md:text-[50px] font-medium tracking-[-0.025em] leading-[1.04] text-[#111418]">
            Modular marketing pricing and turnkey growth bundles.
          </h2>
        </div>
        <p className="text-[15px] md:text-[16px] text-[#111418]/65 max-w-md leading-relaxed">
          Choose standalone performance marketing tasks starting at ₹300 or structured campaign launch bundles with clear deliverables.
        </p>
      </div>

      {/* Two Pricing Models Overview */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Modular Starting Price Pillars */}
        <div className="lg:col-span-5 rounded-[24px] bg-[#12151b] text-white p-7 sm:p-8 flex flex-col justify-between border border-white/10">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#ff5512]">
                MODEL A · A LA CARTE
              </span>
              <Tag className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
            </div>

            <h3 className="mt-3 text-[24px] sm:text-[28px] font-medium tracking-[-0.015em]">
              Individual Marketing Rates
            </h3>
            <p className="mt-2 text-[14px] text-white/70 leading-relaxed">
              Ideal for specific ad creatives, reels hooks, landing pages, or SEO sprints.
            </p>

            {/* Price list */}
            <div className="mt-6 space-y-3 pt-5 border-t border-white/10 font-mono text-[13px]">
              {[
                { domain: 'Social & Ad Creatives', start: '₹300', unit: 'per ad static / ₹1.5k carousel' },
                { domain: 'Digital Campaign Identity', start: '₹2,000', unit: 'per asset / ₹5k brand kit' },
                { domain: 'Reels & Video Ads', start: '₹1,000', unit: 'per hook / ₹1.5k reel ad' },
                { domain: 'Funnels & Landing Pages', start: '₹3,500', unit: 'per page / ₹5k funnel' },
                { domain: 'Paid Ads, SEO & Growth', start: '₹2,500', unit: 'setup / ₹4k Meta Ads' },
              ].map((row) => (
                <div
                  key={row.domain}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0"
                >
                  <span className="text-white/85 font-sans font-medium">{row.domain}</span>
                  <div className="text-right">
                    <span className="text-[#ff5512] font-semibold">From {row.start}</span>
                    <span className="text-white/40 text-[11px] block">{row.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
            <span className="text-[12px] text-white/50">40 itemized catalog rates</span>
            <button
              type="button"
              onClick={() => onNavigate('pricing')}
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white hover:text-[#ff5512] transition-colors cursor-pointer"
            >
              Browse Rate Card
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Right Side: Popular Turnkey Bundled Packages Preview */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#ff5512]">
                MODEL B · TURNKEY SCOPES
              </span>
              <h3 className="text-[20px] sm:text-[22px] font-medium text-[#111418] tracking-[-0.01em]">
                One-Time Project Packages
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('packages')}
              className="text-[13px] font-medium text-[#ff5512] hover:underline cursor-pointer"
            >
              View all 5 bundles →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BUNDLED_PACKAGES.slice(0, 3).map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-[20px] p-5 flex flex-col justify-between transition-all duration-200 ${
                  pkg.featured
                    ? 'bg-[#12151b] text-white border-2 border-[#ff5512] shadow-[0_12px_30px_rgba(255,85,18,0.14)]'
                    : 'bg-white text-[#111418] border border-[#111418]/10 hover:border-[#111418]/25'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-mono text-[11px] uppercase text-[#ff5512] font-semibold">
                      {pkg.featured ? '★ Most Popular' : 'Turnkey'}
                    </span>
                  </div>

                  <h4 className="text-[17px] font-medium tracking-tight leading-snug">
                    {pkg.name}
                  </h4>
                  <p className="mt-2 text-[22px] font-semibold font-mono tracking-tight text-[#ff5512]">
                    {formatINR(pkg.price)}
                  </p>
                  <p
                    className={`mt-1 text-[12px] leading-tight ${
                      pkg.featured ? 'text-white/60' : 'text-[#111418]/60'
                    }`}
                  >
                    {pkg.audience}
                  </p>

                  <ul className="mt-4 space-y-1.5 pt-3 border-t border-current/10 text-[12px]">
                    {pkg.deliverables.slice(0, 3).map((d) => (
                      <li key={d} className="flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-[#ff5512] shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="line-clamp-2">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-current/10">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPackage?.(pkg.id);
                      onNavigate('quote');
                    }}
                    className={`w-full py-2 rounded-[9px] text-[12.5px] font-medium transition-colors cursor-pointer text-center ${
                      pkg.featured
                        ? 'bg-[#ff5512] text-white hover:bg-[#e5490b]'
                        : 'bg-[#111418] text-white hover:bg-[#2b3140]'
                    }`}
                  >
                    Select Package
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick quote action banner */}
          <div className="rounded-[20px] bg-[#f0f4fa] border border-[#111418]/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#111418] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#ff5512]" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[14px] font-medium text-[#111418]">Need a tailored custom scope?</p>
                <p className="text-[12.5px] text-[#111418]/65">
                  Combine individual services or custom deliverables to receive an instant estimate.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('quote')}
              className="shrink-0 h-[40px] px-4 rounded-[10px] bg-[#ff5512] text-white text-[13px] font-medium hover:bg-[#e5490b] transition-colors cursor-pointer text-center"
            >
              Open Quote Builder →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
