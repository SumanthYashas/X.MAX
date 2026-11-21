import { ArrowRight, Check, Layers, Palette, Video, Code, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { PageRoute } from '../types/routing';
import { formatINR } from '../data/xmaxCatalogue';

interface OurServicesSectionProps {
  onNavigate: (route: PageRoute) => void;
  onSelectService?: (serviceId: string) => void;
}

const SERVICE_HIGHLIGHTS = [
  {
    id: 'graphic-design',
    num: '01',
    title: 'Social & Ad Creatives',
    startingPrice: 300,
    tagline: 'Scroll-stopping Meta, Instagram & display ads',
    Icon: Palette,
    offerings: [
      { name: 'Instagram Story & Feed Ad Visuals', price: 'From ₹300' },
      { name: 'Paid Social Carousels (5 slides)', price: '₹1,500' },
      { name: 'Campaign Offer & Promo Creatives', price: '₹1,000' },
      { name: 'CTR YouTube & Display Ad Thumbnails', price: 'From ₹500' },
    ],
  },
  {
    id: 'brand-identity',
    num: '02',
    title: 'Digital Campaign Identity',
    startingPrice: 2000,
    tagline: 'Conversion-first brand systems & ad kits',
    Icon: Layers,
    offerings: [
      { name: 'Digital Brand Identity & Mark', price: '₹5,000' },
      { name: 'Campaign Brand & Ad Guidelines', price: '₹3,500' },
      { name: 'Omnichannel Social Banner Pack', price: '₹2,000' },
      { name: 'Performance Brand Messaging Kit', price: '₹6,000' },
    ],
  },
  {
    id: 'video-motion',
    num: '03',
    title: 'Reels & Video Ads',
    startingPrice: 1000,
    tagline: 'Direct-response UGC reels & motion hooks',
    Icon: Video,
    offerings: [
      { name: 'Reels / Shorts Ad Cut (up to 30s)', price: '₹1,500' },
      { name: 'UGC / Performance Ad (30–60s)', price: '₹2,500' },
      { name: 'Hook Motion Title & Endcard Sting', price: '₹2,000' },
      { name: 'Hero Paid Video Commercial (60s)', price: '₹5,000' },
    ],
  },
  {
    id: 'web-development',
    num: '04',
    title: 'Funnels & Landing Pages',
    startingPrice: 3500,
    tagline: 'CRO-engineered pages & high-ROAS storefronts',
    Icon: Code,
    offerings: [
      { name: 'Lead-Gen Conversion Landing Page', price: '₹5,000' },
      { name: 'SEO Growth Website (up to 5 pages)', price: '₹12,000' },
      { name: 'CRO Wireframe & UX Audit (per view)', price: '₹800' },
      { name: 'D2C Storefront & Pixel Setup', price: '₹18,000' },
    ],
  },
  {
    id: 'digital-marketing',
    num: '05',
    title: 'Paid Ads, SEO & Growth',
    startingPrice: 2500,
    tagline: 'Meta Ads, Google Search, GA4 & technical SEO',
    Icon: TrendingUp,
    offerings: [
      { name: 'Meta Ads & CAPI Campaign Setup', price: '₹4,000' },
      { name: 'Google Search & PMax Ads Setup', price: '₹5,000' },
      { name: 'Monthly Performance Ad Management', price: '₹8,000' },
      { name: 'Technical & On-Page SEO Audit', price: '₹3,500' },
    ],
  },
];

export function OurServicesSection({ onNavigate }: OurServicesSectionProps) {
  return (
    <section
      id="services"
      aria-label="02 Our Services"
      className="mx-auto max-w-[1360px] px-[20px] md:px-[60px] py-[80px] md:py-[110px]"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#111418]/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111418] text-white text-[12px] font-mono tracking-wider uppercase mb-3">
            <span className="text-[#ff5512] font-bold">02</span>
            <span>DIGITAL MARKETING SERVICES</span>
          </div>
          <h2 className="text-[32px] sm:text-[42px] md:text-[50px] font-medium tracking-[-0.025em] leading-[1.04] text-[#111418]">
            Performance marketing deliverables with transparent starting rates.
          </h2>
        </div>
        <p className="text-[15px] md:text-[16px] text-[#111418]/65 max-w-md leading-relaxed">
          Modular digital marketing pricing. Pick standalone creatives, ad setups, or SEO audits to assemble your growth scope.
        </p>
      </div>

      {/* Services Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICE_HIGHLIGHTS.map((service, idx) => {
          const Icon = service.Icon;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-[24px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                idx === 0
                  ? 'bg-[#12151b] text-white lg:col-span-1 border border-white/10'
                  : 'bg-white text-[#111418] border border-[#111418]/10 hover:shadow-[0_20px_45px_rgba(17,20,24,0.06)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-[12px] ${
                      idx === 0 ? 'bg-white/10 text-[#ff5512]' : 'bg-[#111418]/5 text-[#ff5512]'
                    }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <span
                    className={`font-mono text-[12px] font-semibold px-2.5 py-1 rounded-full ${
                      idx === 0 ? 'bg-white/10 text-white/80' : 'bg-[#111418]/5 text-[#111418]/70'
                    }`}
                  >
                    From {formatINR(service.startingPrice)}
                  </span>
                </div>

                <div className="mt-5">
                  <span className="font-mono text-[11px] text-[#ff5512] tracking-wider uppercase block">
                    {service.num} · PILLAR
                  </span>
                  <h3 className="mt-1 text-[22px] sm:text-[24px] font-medium tracking-[-0.015em]">
                    {service.title}
                  </h3>
                  <p
                    className={`mt-1 text-[13.5px] ${
                      idx === 0 ? 'text-white/65' : 'text-[#111418]/60'
                    }`}
                  >
                    {service.tagline}
                  </p>
                </div>

                {/* Offerings list */}
                <ul className="mt-6 space-y-2.5 pt-5 border-t border-current/10">
                  {service.offerings.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between text-[13px] gap-2"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Check className="w-3.5 h-3.5 text-[#ff5512] shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span
                        className={`font-mono text-[11.5px] shrink-0 ${
                          idx === 0 ? 'text-white/70' : 'text-[#111418]/65'
                        }`}
                      >
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-7 pt-4 border-t border-current/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className={`text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                    idx === 0
                      ? 'text-white hover:text-[#ff5512]'
                      : 'text-[#111418] hover:text-[#ff5512]'
                  }`}
                >
                  View Rate Card
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('quote')}
                  className={`text-[12px] font-mono px-3 py-1 rounded-[7px] transition-colors cursor-pointer ${
                    idx === 0
                      ? 'bg-[#ff5512] text-white hover:bg-[#e5490b]'
                      : 'bg-[#111418] text-white hover:bg-[#2b3140]'
                  }`}
                >
                  Quote
                </button>
              </div>
            </motion.div>
          );
        })}

        {/* 6th Card: All 40 Services CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[24px] p-6 sm:p-7 flex flex-col justify-between bg-gradient-to-br from-[#ff5512] to-[#e54406] text-white shadow-[0_20px_45px_rgba(255,85,18,0.22)]"
        >
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/80 block">
              COMPLETE CATALOGUE
            </span>
            <h3 className="mt-2 text-[24px] sm:text-[28px] font-medium tracking-[-0.02em] leading-tight text-white">
              40 Individual Modular Services
            </h3>
            <p className="mt-2 text-[14px] text-white/90 leading-relaxed">
              Transparent rate card with instant itemized cost calculation. No hidden retainers or surprises.
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-white/20 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onNavigate('pricing')}
              className="h-[44px] px-5 rounded-[12px] bg-white text-[#111418] text-[13.5px] font-medium hover:bg-white/90 transition-colors cursor-pointer text-center"
            >
              Explore All 40 Rates →
            </button>
            <button
              type="button"
              onClick={() => onNavigate('quote')}
              className="h-[44px] px-5 rounded-[12px] bg-black/25 text-white text-[13.5px] font-medium hover:bg-black/35 transition-colors cursor-pointer text-center"
            >
              Build Quote
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
