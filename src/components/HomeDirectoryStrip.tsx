import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PageRoute } from '../types/routing';

interface HomeDirectoryStripProps {
  onNavigate: (route: PageRoute) => void;
}

const DIRECTORY_CARDS: Array<{
  index: string;
  route: PageRoute;
  title: string;
  summary: string;
  cta: string;
  dark?: boolean;
}> = [
  {
    index: '01',
    route: 'pricing',
    title: 'Individual Service Rate Card',
    summary:
      '40 modular services across Graphic Design, Branding, Video Production, Web Development, and Digital Marketing starting from ₹300.',
    cta: 'View All Rates',
  },
  {
    index: '02',
    route: 'packages',
    title: 'Bundled Project Packages',
    summary:
      'Five structured one-time project scopes from Brand Essentials (₹15,000) to Complete Brand Experience (₹75,000).',
    cta: 'Explore Packages',
  },
  {
    index: '03',
    route: 'terms',
    title: 'Additional Charges & Terms',
    summary:
      'Transparent commercial milestones, revision rounds, urgent delivery rates, and quotation billing policies.',
    cta: 'Read Terms',
  },
  {
    index: '04',
    route: 'quote',
    title: 'Custom Quotation Builder',
    summary:
      'Combine individual services or a bundled package to calculate your starting estimate and request a formal scope.',
    cta: 'Build Quote',
    dark: true,
  },
];

export function HomeDirectoryStrip({ onNavigate }: HomeDirectoryStripProps) {
  return (
    <section
      aria-label="Explore X.MAX Catalogue Pages"
      className="mx-auto max-w-[1360px] px-[20px] md:px-[60px] pb-[90px] md:pb-[130px]"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#111418]/10">
        <div>
          <p className="text-[13px] font-medium tracking-[0.04em] text-[#111418]/50 mb-2">
            Service Pricing Catalogue · 2026–27
          </p>
          <h2 className="text-[28px] md:text-[40px] font-medium tracking-[-0.02em] leading-[1.08] text-[#111418]">
            Your Requirements. Our Pricing.
          </h2>
        </div>
        <p className="text-[15px] text-[#111418]/65 max-w-md">
          Browse modular individual rates or one-time bundled project scopes on dedicated pages.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        {DIRECTORY_CARDS.map((card, i) => (
          <motion.button
            key={card.route}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            onClick={() => onNavigate(card.route)}
            className={`group text-left rounded-[24px] p-7 md:p-8 flex flex-col justify-between transition-[box-shadow,background-color] duration-200 cursor-pointer ${
              card.dark
                ? 'bg-[#12151b] text-white hover:bg-[#1a1f28]'
                : 'bg-white border border-[#111418]/10 text-[#111418] hover:shadow-[0_18px_40px_rgba(17,20,24,0.06)]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-[13px] font-medium ${
                    card.dark ? 'text-[#ff5512]' : 'text-[#ff5512]'
                  }`}
                >
                  {card.index}
                </span>
                <ArrowUpRight
                  className={`w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    card.dark ? 'text-white/60 group-hover:text-white' : 'text-[#111418]/45 group-hover:text-[#111418]'
                  }`}
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-4 text-[22px] md:text-[26px] font-medium tracking-[-0.015em]">
                {card.title}
              </h3>
              <p
                className={`mt-2.5 text-[15px] leading-[1.55] ${
                  card.dark ? 'text-white/70' : 'text-[#111418]/65'
                }`}
              >
                {card.summary}
              </p>
            </div>

            <div className="mt-7 pt-4 border-t border-current/10 flex items-center justify-between">
              <span className="text-[14px] font-medium">{card.cta}</span>
              <span
                className={`text-[12px] ${
                  card.dark ? 'text-white/50' : 'text-[#111418]/45'
                }`}
              >
                Open page
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
